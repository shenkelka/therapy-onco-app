import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  age: integer("age"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const therapyEntries = pgTable("therapy_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(),
  cycle: integer("cycle").notNull(),
  cycleDay: integer("cycle_day").notNull(),
  treatmentType: text("treatment_type").notNull(), // chemotherapy, targeted, immunotherapy, radiation
  medications: text("medications").notNull(),
  wellbeingSeverity: integer("wellbeing_severity").notNull(), // 1-5 scale
  sideEffects: text("side_effects").array(),
  physicalActivity: text("physical_activity").notNull(),
  mood: text("mood"), // emoji representation
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  helpType: text("help_type").notNull(), // walk, cooking, medicine, transport
  location: text("location"),
  status: text("status").default("active"), // active, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpResponses = pgTable("help_responses", {
  id: serial("id").primaryKey(),
  helpRequestId: integer("help_request_id").notNull(),
  userId: integer("user_id").notNull(),
  message: text("message"),
  status: text("status").default("pending"), // pending, accepted, declined
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTherapyEntrySchema = createInsertSchema(therapyEntries).omit({
  id: true,
  createdAt: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertHelpResponseSchema = createInsertSchema(helpResponses).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTherapyEntry = z.infer<typeof insertTherapyEntrySchema>;
export type TherapyEntry = typeof therapyEntries.$inferSelect;
export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;
export type HelpRequest = typeof helpRequests.$inferSelect;
export type InsertHelpResponse = z.infer<typeof insertHelpResponseSchema>;
export type HelpResponse = typeof helpResponses.$inferSelect;
