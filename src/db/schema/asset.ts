import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

export const assets = pgTable("assets", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  downloadUrl: varchar("download_url", { length: 2048 }).notNull(),
  uploadUrl: varchar("upload_url", { length: 2048 }).notNull(),
});
