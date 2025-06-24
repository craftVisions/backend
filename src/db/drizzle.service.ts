import { Inject, Injectable } from "@nestjs/common";
import { DATABASE_CONNECTION } from "./database-connection";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

@Injectable()
export class DrizzleService {
    constructor(@Inject(DATABASE_CONNECTION) readonly db: NodePgDatabase<typeof schema>) {}
}