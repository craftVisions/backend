import { pgTable, uuid, timestamp, text } from 'drizzle-orm/pg-core';

export const activity = pgTable('activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  createdBy: uuid('created_by').notNull(),
  type: text('type').notNull(), // consider enum later if needed
});
