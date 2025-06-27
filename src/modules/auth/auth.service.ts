import { HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DrizzleService } from "src/db/drizzle.service";
import { auth } from "src/db/schema";
import { UserService } from "../user/user.service";
import { Login, Register } from "./interfaces/auth.interface";
import { HandleDbErrors } from "src/lib/decorators/handle-db-errors";
import { hash, compare } from "bcrypt";
import { CustomException } from "src/lib/exception/custom-exception";
import { eq } from "drizzle-orm";
import { users } from "src/db/schema/user";
import { User } from "src/interfaces/user";
import { ConfigService } from "@nestjs/config";
import { Mailer } from "src/lib/mailer/mailer.service";
import { emails } from "src/constants/email.constant";
import { OtpService } from "./otp.service";
import { TemplateService } from "src/lib/mailer/templates/template.service";

const DB_ERRORS = {
    auth_email_unique: new CustomException("Email already Exists", HttpStatus.CONFLICT),
};

@Injectable()
export class AuthService {
    constructor(
        private readonly drizzleService: DrizzleService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly mailer: Mailer,
        private readonly otpService: OtpService,
        private readonly templateService: TemplateService
    ) {}

    async generateToken(payload: User, type: "access" | "refresh") {
        const secret = this.configService.get<string>(`${type.toUpperCase()}_TOKEN_SECRET`);
        const expiresIn = this.configService.get<string>(`${type.toUpperCase()}_TOKEN_EXPIRY`);
        return await this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    private async updateRefreshToken(credentialId: string, refreshToken: string) {
        await this.drizzleService.db.update(auth).set({ refreshToken }).where(eq(auth.id, credentialId));
    }

    @HandleDbErrors(DB_ERRORS)
    async register(input: Register): Promise<{ accessToken: string; refreshToken: string }> {
        const { email, password, firstName, lastName } = input;
        const hashedPassword = await hash(password, +process.env.SALT_ROUNDS! || 10);

        const user = await this.drizzleService.db.transaction(async (tx) => {
            const [credential] = await tx
                .insert(auth)
                .values({
                    email,
                    password: hashedPassword,
                })
                .returning({ id: auth.id });

            const id = await this.userService.createUser(
                {
                    firstName,
                    lastName,
                    email,
                    credentialId: credential.id,
                },
                tx,
            );
            return {
                credentialId: credential.id,
                userId: id,
            };
        });

        const accessToken = await this.generateToken({ userId: user.userId }, "access");
        const refreshToken = await this.generateToken({ userId: user.userId }, "refresh");

        await this.updateRefreshToken(user.credentialId, refreshToken);

        const otp = await this.otpService.createOtp(user.credentialId, "email_verification");

        const html = this.templateService.render("email-verification/html.hbs", {
            otp,
            expiry: this.configService.get("OTP_EXPIRY_MINUTES") || 5,
        });

        const mailOptions = {
            to: email,
            subject: emails.EMAIL_VERIFICATION_SUBJECT,
            html,
        };

        try {
            await this.mailer.sendMail(mailOptions);
        } catch (err) {
            console.log("error sending mail", err);
        }

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
                id: auth.id,
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

        // update the refresh token in the database
        await this.updateRefreshToken(credential.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async validateRefreshToken(token: string): Promise<boolean> {
        const [storedToken] = await this.drizzleService.db.select().from(auth).where(eq(auth.refreshToken, token)).limit(1);
        if (!storedToken) {
            throw new CustomException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED);
        }
        return true;
    }
}
