import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "../user/user.module";
import { UserService } from "../user/user.service";
import { OtpService } from "./otp.service";
import { TemplateService } from "src/lib/mailer/templates/template.service";

@Module({
    imports: [UserModule],
    controllers: [AuthController],
    providers: [AuthService, UserService, OtpService, TemplateService],
})
export class AuthModule {}
