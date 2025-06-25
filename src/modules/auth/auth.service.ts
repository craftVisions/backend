import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleService } from "src/db/drizzle.service";
import { auth } from "src/db/schema";
import { UserService } from "../user/user.service";
import { Login, Register, TokenPayload } from "./interfaces/auth.interface";
import { HandleDbErrors } from "src/lib/decorators/handle-db-errors";
import { hash, compare } from "bcrypt";
import { CustomException } from "src/lib/exception/custom-exception";
import { eq } from "drizzle-orm";
import { users } from "src/db/schema/user";

const DB_ERRORS = {};

@Injectable()
export class AuthService {
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async generateToken(payload: TokenPayload, type: "access" | "refresh") {
        const expiresIn = type === "access" ? process.env.ACCESS_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY;
        return await this.jwtService.signAsync(payload, { expiresIn });
    }

    @HandleDbErrors(DB_ERRORS)
    async register(input: Register): Promise<{ accessToken: string; refreshToken: string }> {
        const { email, password, firstName, lastName } = input || {};
        const hashedPassword = await hash(password, process.env.SALT_ROUNDS || 10);

        const userId = await this.drizzleService.db.transaction(async (tx) => {
            const [credential] = await tx
                .insert(auth)
                .values({
                    email,
                    password: hashedPassword,
                })
                .returning({ id: auth.id });

            const id = this.userService.createUser(
                {
                    firstName,
                    lastName,
                    email,
                    credentialId: credential.id,
                },
                tx,
            );
            return id;
        });

        const accessToken = await this.generateToken({ userId }, "access");
        const refreshToken = await this.generateToken({ userId }, "refresh");

        return {
            accessToken,
            refreshToken,
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async login(input: Login): Promise<{ accessToken: string; refreshToken: string }> {
        const { email, password } = input;

        const [credential] = await this.drizzleService.db
            .select({
                email: auth.email,
                password: auth.password,
            })
            .from(auth)
            .where(eq(auth.email, email))
            .limit(1);

        if (!credential) {
            throw new CustomException("Invalid Credentials", HttpStatus.NOT_FOUND);
        }

        const isCorrectPassword = await compare(password, credential.password);
        if (!isCorrectPassword) {
            throw new CustomException("Invalid Credentials", HttpStatus.UNAUTHORIZED);
        }

        const [user] = await this.drizzleService.db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

        const accessToken = await this.generateToken({ userId: user.id }, "access");
        const refreshToken = await this.generateToken({ userId: user.id }, "refresh");
        return {
            accessToken,
            refreshToken,
        };
    }
}
