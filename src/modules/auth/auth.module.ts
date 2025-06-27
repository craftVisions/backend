import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { JwtModule, JwtService } from "@nestjs/jwt";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [JwtService, AuthService, UserService],
})
export class AuthModule {}
