import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  sales: doublePrecision("sales").notNull(),
  variableCost: doublePrecision("variable_cost").notNull(),
  fixedCost: doublePrecision("fixed_cost").notNull(),
  marginalProfit: doublePrecision("marginal_profit").notNull(),
  marginalProfitRate: doublePrecision("marginal_profit_rate").notNull(),
  breakEvenPoint: doublePrecision("break_even_point").notNull(),
  operatingProfit: doublePrecision("operating_profit"),
  operatingProfitRate: doublePrecision("operating_profit_rate"),
  roi: doublePrecision("roi"),
  investment: doublePrecision("investment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCalculationSchema = createInsertSchema(calculations).omit({
  id: true,
  createdAt: true,
});

export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;
