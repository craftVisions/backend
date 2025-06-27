import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { User } from "src/interfaces/user";
import { AuthService } from "src/modules/auth/auth.service";

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("Refresh token is missing");
        }

        try {
            const {exp, iat, ...payload} = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>("REFRESH_TOKEN_SECRET"),
            });

            await this.authService.validateRefreshToken(token);

            const accessToken = await this.authService.generateToken(payload, "access");
            request["accessToken"] = accessToken;

            return true;
        } catch (error) {
            console.log("Error verifying refresh token:", error);
            throw new UnauthorizedException("Invalid refresh token");
        }
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
