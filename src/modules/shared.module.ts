import { Module } from "@nestjs/common";
import { DatabaseModule } from "src/db/database.module";

@Module({
    imports: [DatabaseModule],
    exports: [DatabaseModule],
})
export class SharedModule {}
