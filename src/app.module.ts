import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./db/database.module";

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, AuthModule],
    controllers: [AppController],
    providers: [],
})
export class AppModule {}
