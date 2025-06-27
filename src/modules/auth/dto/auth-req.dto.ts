import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ForgotPasswordReqDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}

export class ResetPasswordWithCurrentReqDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}

export class ResetPasswordWithTempToken {
    @IsNotEmpty()
    @IsString()
    tempToken: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}

export class VerifyOtpReqDto {
    @IsNotEmpty()
    @IsString()
    otp: string;
}

export class VerifyOtpWithEmailReqDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    otp: string;
}
