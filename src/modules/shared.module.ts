import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { DatabaseModule } from "src/db/database.module";

@Module({
    imports: [DatabaseModule, PassportModule],
    exports: [DatabaseModule, PassportModule],
})
export class SharedModule {}
