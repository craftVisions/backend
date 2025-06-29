import { pgTable, uuid, varchar, jsonb, timestamp, numeric, pgEnum } from "drizzle-orm/pg-core";
import { assets } from "./asset";
import { auth } from "./auth";

export const rewardTypeEnum = pgEnum("reward_type_enum", ["question_created", "submission_created", "test_case_created"]);

export const users = pgTable("users", {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    credentialId: uuid("credential_id")
        .unique()
        .references(() => auth.id),
    email: varchar("email", { length: 320 }).unique().notNull(),
    firstName: varchar("first_name", { length: 100 }).notNull(),
    lastName: varchar("last_name", { length: 100 }),
    avatarId: uuid("avatar_id").references(() => assets.id),
    urls: jsonb("urls"),
});


export const userRewards = pgTable("user_rewards", {
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    userId: uuid("userId").notNull().references(() => users.id),
    rewardType: rewardTypeEnum("reward_type").notNull(),
    referenceId: uuid("reference_id"),
    pointsEarned: numeric("points_earned").notNull().default("0"),
});
