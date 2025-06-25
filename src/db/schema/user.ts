import { pgTable, uuid, varchar, jsonb, timestamp } from "drizzle-orm/pg-core";
import { assets } from "./asset";
import { auth } from "./auth";

export const users = pgTable("users", {
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  id: uuid("id").notNull().primaryKey().defaultRandom(),
  credentialId: uuid("credential_id").unique().references(() => auth.id),

  email: varchar("email", { length: 320 }).unique().notNull(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }),
  avatarId: uuid("avatar_id").references(() => assets.id),
  urls: jsonb("urls"),
});
