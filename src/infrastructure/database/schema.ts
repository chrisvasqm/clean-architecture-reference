import { integer, numeric, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const productsTable = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull().default(''),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).notNull().defaultNow(),
});

export type ProductSelectRow = typeof productsTable.$inferSelect;
export type ProductInsertRow = typeof productsTable.$inferInsert;
