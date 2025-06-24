import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { DATABASE_CONNECTION } from "./database-connection";
import { DrizzleService } from "./drizzle.service";
import * as schema from "./schema";

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: async (configService: ConfigService) => {
                const pool = new Pool({
                    connectionString: configService.get<string>("DATABASE_URL"),
                    max: 1,
                });
                return drizzle(pool, {
                    schema,
                    casing: "snake_case",
                    // logger: true,
                }) as NodePgDatabase<typeof schema>;
            },
            inject: [ConfigService],
        },
        DrizzleService,
    ],
    exports: [DrizzleService],
})
export class DatabaseModule {}
