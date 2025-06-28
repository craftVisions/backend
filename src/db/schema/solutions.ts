import { pgTable, uuid, timestamp, text, integer, doublePrecision } from 'drizzle-orm/pg-core';
import { users } from './user';
import { questions } from './questions';

export const solutions = pgTable('solutions', {
  id: uuid('id').primaryKey().defaultRandom(),
  submittedBy: uuid('submitted_by').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  solution: text('solution').notNull(),
  language: text('language').notNull(),
  attempts: integer('attempts').notNull().default(0),
  failedAttempts: integer('failed_attempts').notNull().default(0),
  executionTime: doublePrecision('execution_time'),
  status: text('status').notNull(),
});
