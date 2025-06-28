import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ForgotPasswordReqDto {
    @ApiProperty({ example: "user@example.com", description: "Registered email address of the user" })
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ResetPasswordWithCurrentReqDto {
    @ApiProperty({ example: "currentPassword123", description: "Current password of the user" })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: "newSecurePassword!456", description: "New password to be set" })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}

export class ResetPasswordWithTempToken {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", description: "Temporary token received via email for password reset" })
    @IsNotEmpty()
    @IsString()
    tempToken: string;

    @ApiProperty({ example: "newSecurePassword!456", description: "New password to be set" })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
}

export class VerifyOtpReqDto {
    @ApiProperty({ example: "123456", description: "One-time password (OTP) sent to email" })
    @IsNotEmpty()
    @IsString()
    otp: string;
}

export class VerifyOtpWithEmailReqDto {
    @ApiPropertyOptional({ example: "user@example.com", description: "Email to which the OTP was sent. Required for unauthenticated OTP verification." })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty({ example: "123456", description: "One-time password (OTP) to verify" })
    @IsNotEmpty()
    @IsString()
    otp: string;
}
