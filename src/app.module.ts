import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { SharedModule, AuthModule, UserModule } from "./modules";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), SharedModule, AuthModule, UserModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
