import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { User } from "src/interfaces/user";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        const path = request.route?.path;
        
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload: User = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
            });

            if (!payload.isEmailVerified && !path?.startsWith("/auth")) {
                throw new UnauthorizedException("Email not verified");
            }

            request["user"] = payload;
        } catch (err) {
            throw new UnauthorizedException(err?.message === "Email not verified" ? err.message : "Unauthorized");
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        return type === "Bearer" ? token : undefined;
    }
}
