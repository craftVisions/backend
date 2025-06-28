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
import { OtpPurpose } from "src/constants/otp.constant";

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
        private readonly templateService: TemplateService,
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

        const accessToken = await this.generateToken({ ...user, email, isEmailVerified: false }, "access");
        const refreshToken = await this.generateToken({ ...user, email, isEmailVerified: false }, "refresh");

        await this.updateRefreshToken(user.credentialId, refreshToken);

        const otp = await this.otpService.createOtp(user.credentialId, OtpPurpose.EMAIL_VERIFICATION);

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
                isEmailVerified: auth.emailVerified,
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

        const accessToken = await this.generateToken(
            {
                userId: user.id,
                credentialId: credential.id,
                email,
                isEmailVerified: credential.isEmailVerified,
            },
            "access",
        );

        const refreshToken = await this.generateToken(
            {
                userId: user.id,
                credentialId: credential.id,
                email,
            },
            "refresh",
        );

        // update the refresh token in the database
        await this.updateRefreshToken(credential.id, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async validateRefreshToken(token: string): Promise<{ isEmailVerified: boolean }> {
        const [storedToken] = await this.drizzleService.db.select().from(auth).where(eq(auth.refreshToken, token)).limit(1);
        if (!storedToken) {
            throw new CustomException("Invalid Refresh Token", HttpStatus.UNAUTHORIZED);
        }
        const payload = {
            isEmailVerified: storedToken.emailVerified,
        };
        return payload;
    }

    @HandleDbErrors(DB_ERRORS)
    async verifyEmail(identityId: string, email: string): Promise<{ message: string }> {
        const otp = await this.otpService.createOtp(identityId, OtpPurpose.EMAIL_VERIFICATION);
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
            throw new CustomException("Failed to send verification email", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {
            message: "Verification email sent successfully",
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async forgotPassword(email: string) {
        const [credential] = await this.drizzleService.db.select({ id: auth.id }).from(auth).where(eq(auth.email, email)).limit(1);

        if (!credential) {
            throw new CustomException("User not found", HttpStatus.NOT_FOUND);
        }

        const otp = await this.otpService.createOtp(credential.id, OtpPurpose.PASSWORD_RESET);
        const html = this.templateService.render("password-reset/html.hbs", {
            otp,
            expiry: this.configService.get("OTP_EXPIRY_MINUTES") || 5,
        });

        const mailOptions = {
            to: email,
            subject: emails.PASSWORD_RESET_SUBJECT,
            html,
        };

        try {
            await this.mailer.sendMail(mailOptions);
        } catch (err) {
            console.log("error sending mail", err);
            throw new CustomException("Failed to send password reset email", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return {
            message: "OTP sent to your email",
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async verifyOtp(email: string, otp: string): Promise<{ message: string }> {
        const [credential] = await this.drizzleService.db.select({ id: auth.id }).from(auth).where(eq(auth.email, email)).limit(1);

        const { isVerified, purpose } = await this.otpService.verifyOtp(credential.id, otp);

        if (!isVerified) {
            throw new CustomException("Invalid OTP", HttpStatus.UNAUTHORIZED);
        }

        if (purpose === OtpPurpose.EMAIL_VERIFICATION) {
            await this.drizzleService.db.update(auth).set({ emailVerified: true }).where(eq(auth.id, credential.id));
            return {
                message: "Email verified successfully",
            };
        }

        if (purpose === OtpPurpose.FORGOT_PASSWORD) {
            const tempToken = await this.jwtService.signAsync({ identityId: credential.id }, { expiresIn: "15m", secret: this.configService.get<string>("TEMP_TOKEN_SECRET") });

            const html = this.templateService.render("password-reset/html.hbs", {
                token: tempToken,
                frontendUrl: this.configService.get<string>("FRONTEND_BASE_URL"),
            });

            const mailOptions = {
                to: email,
                subject: emails.PASSWORD_RESET_SUBJECT,
                html,
            };

            try {
                await this.mailer.sendMail(mailOptions);
            } catch (err) {
                console.log("error sending mail", err);
                throw new CustomException("Failed to send password reset email", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return {
            message: "OTP verified successfully",
        };
    }

    @HandleDbErrors(DB_ERRORS)
    async resetPasswordWithCurrentPassword(credentialId: string, currentPassword: string, newPassword: string): Promise<{ message: string }> {
        const [credential] = await this.drizzleService.db.select().from(auth).where(eq(auth.id, credentialId)).limit(1);

        if (!credential) {
            throw new CustomException("User not found", HttpStatus.NOT_FOUND);
        }

        const isCorrectPassword = await compare(currentPassword, credential.password);
        if (!isCorrectPassword) {
            throw new CustomException("Incorrect current password", HttpStatus.UNAUTHORIZED);
        }

        const hashedNewPassword = await hash(newPassword, +process.env.SALT_ROUNDS! || 10);
        await this.drizzleService.db.update(auth).set({ password: hashedNewPassword }).where(eq(auth.id, credentialId));
        return {
            message: "Password reset successfully",
        };
    }

    async resetPasswordWithTempToken(tempToken: string, newPassword: string): Promise<{ message: string }> {
        let payload: { identityId: string };
        try {
            payload = await this.jwtService.verifyAsync(tempToken, {
                secret: this.configService.get<string>("TEMP_TOKEN_SECRET"),
            });
        } catch (err) {
            throw new CustomException("Invalid or expired reset token", HttpStatus.UNAUTHORIZED);
        }

        const hashedNewPassword = await hash(newPassword, +process.env.SALT_ROUNDS! || 10);
        await this.drizzleService.db.update(auth).set({ password: hashedNewPassword }).where(eq(auth.id, payload.identityId));
        return {
            message: "Password reset successfully",
        };
    }
}
