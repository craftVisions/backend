import { pgTable, uuid, timestamp, text, integer, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./user";

export const difficultyEnum = pgEnum("difficulty_enum", ["easy", "medium", "hard"]);

export const questions = pgTable("questions", {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    createdBy: uuid("created_by")
        .notNull()
        .references(() => users.id),
    updatedBy: uuid("updated_by")
        .notNull()
        .references(() => users.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    difficulty: difficultyEnum("difficulty").notNull(),
    points: integer("points").notNull(),
    tags: text("tags").array(),
    hints: jsonb("hints"),

});
