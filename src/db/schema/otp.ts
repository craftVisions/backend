import { pgTable, timestamp, uuid, text, boolean, integer } from "drizzle-orm/pg-core";
import { auth } from "./auth";

export const otpVerification = pgTable("otp_verification", {
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    identityId: uuid("identity_id")
        .references(() => auth.id)
        .notNull(),
    otp: text("otp").notNull(),
    purpose: text("purpose").notNull(), // 'password_reset', 'email_verification', etc.
    expiresAt: timestamp("expires_at").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    attempts: integer("attempts").notNull().default(0),
});