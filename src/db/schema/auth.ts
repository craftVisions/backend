import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["admin", "user"]);
export const loginMethodEnum = pgEnum("login_method_enum", ["local", "github", "google"]);

export const auth = pgTable("auth", {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    password: text("password").notNull(),
    emailVerified: boolean("email_verified").notNull().default(false),
    role: rolesEnum("role").notNull().default("user"),
    login_method: loginMethodEnum("login_method").notNull().default("local"),
    refreshToken: text('refresh_token')
});
