import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { ResponseData, ResponseDto } from "src/lib/transformer/response";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenGuard } from "src/guards/refresh-token.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("register")
    async register(@Body() dto: RegisterDto) {
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
    async login(@Body() dto: LoginDto) {
        const { accessToken, refreshToken } = await this.authService.login({
            email: dto.email,
            password: dto.password,
        });
        return ResponseData({
            accessToken,
            refreshToken,
        });
    }

    @Get("refresh/token")
    @UseGuards(RefreshTokenGuard)
    async refreshToken(@Req() req: any): Promise<ResponseDto<{ accessToken: string }>> {
        const accessToken = req["accessToken"];
        return ResponseData({ accessToken });
    }
}
