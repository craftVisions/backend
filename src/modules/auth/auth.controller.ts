import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/auth.dto";
import { ResponseData } from "src/lib/transformer/response";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post()
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
}
