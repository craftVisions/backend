import { pgTable, uuid, timestamp, text, integer, doublePrecision, numeric } from 'drizzle-orm/pg-core';
import { users } from './user';
import { questions } from './questions';

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  submittedBy: uuid('submitted_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  solution: text('solution').notNull(),
  language: text('language').notNull(),
  attempts: integer('attempts').notNull().default(0),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  score: numeric('score').notNull().default("0"),
  executionTime: doublePrecision('execution_time'),
  status: text('status').notNull(),
});
