import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ResponseData, ResponseDto } from "src/lib/transformer/response";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenGuard } from "src/guards/refresh-token.guard";
import { ForgotPasswordReqDto, ResetPasswordWithCurrentReqDto, ResetPasswordWithTempToken, VerifyOtpReqDto, VerifyOtpWithEmailReqDto } from "./dto/auth-req.dto";
import { UserContext } from "src/lib/decorators/user-context";
import { User } from "src/interfaces/user";
import { AuthGuard } from "src/guards/auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: RegisterDto): Promise<ResponseDto<{ accessToken: string; refreshToken: string }>> {
        const { accessToken, refreshToken } = await this.authService.register({
            email: dto.email,
            password: dto.password,
            firstName: dto.firstName,
            lastName: dto.lastName,
        });
        return ResponseData({
            accessToken,
            refreshToken,
        });
    }

    @Post("login")
    async login(@Body() dto: LoginDto): Promise<ResponseDto<{ accessToken: string; refreshToken: string }>> {
        const { accessToken, refreshToken } = await this.authService.login({
            email: dto.email,
            password: dto.password,
        });
        return ResponseData({
            accessToken,
            refreshToken,
        });
    }

    @Post("verify-email")
    @UseGuards(AuthGuard)
    async verifyEmail(@UserContext() { credentialId, email }: User): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.verifyEmail(credentialId, email);
        return ResponseData({ message });
    }

    @Post("verify-otp")
    @UseGuards(AuthGuard)
    async verifyOtp(@Body() dto: VerifyOtpReqDto, @UserContext() { email }: User): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.verifyOtp(email, dto.otp);
        return ResponseData({ message });
    }

    @Post("forgot-password")
    async forgotPassword(@Body() dto: ForgotPasswordReqDto): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.forgotPassword(dto.email);
        return ResponseData({ message });
    }

    @Post("verify-otp-with-email")
    async verifyOtpWithEmail(@Body() dto: VerifyOtpWithEmailReqDto): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.verifyOtp(dto.email, dto.otp);
        return ResponseData({ message });
    }

    @Patch("reset-password")
    @UseGuards(AuthGuard)
    async resetPasswordWithCurrentPassword(@Body() dto: ResetPasswordWithCurrentReqDto, @UserContext() { credentialId }: User): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.resetPasswordWithCurrentPassword(credentialId, dto.currentPassword, dto.newPassword);
        return ResponseData({ message });
    }

    @Patch("reset-password-with-temp-token")
    async resetPasswordWithTempToken(@Body() dto: ResetPasswordWithTempToken): Promise<ResponseDto<{ message: string }>> {
        const { message } = await this.authService.resetPasswordWithTempToken(dto.tempToken, dto.newPassword);
        return ResponseData({ message });
    }

    @Get("refresh/token")
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() req: any): Promise<ResponseDto<{ accessToken: string }>> {
        const accessToken = req["accessToken"];
        return ResponseData({ accessToken });
    }
}
