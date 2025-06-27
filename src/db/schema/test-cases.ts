import { pgTable, uuid, timestamp, text, boolean, integer } from 'drizzle-orm/pg-core';
import { users } from './user';
import { questions } from './questions';

export const testCases = pgTable('test_cases', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdBy: uuid('created_by').notNull().references(() => users.id),
  updatedBy: uuid('updated_by').notNull().references(() => users.id),
  questionId: uuid('question_id').notNull().references(() => questions.id),
  isSample: boolean('is_sample').notNull(),
  input: text('input').notNull(),
  expectedOutput: text('expected_output').notNull(),
  timeoutSecs: integer('timeout_secs').notNull(),
});
