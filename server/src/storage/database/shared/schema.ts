import { pgTable, serial, timestamp, varchar, text, index, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

// 用户表
export const users = pgTable(
  "users",
  {
    id: serial().primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    password: varchar("password", { length: 100 }),
    nickname: varchar("nickname", { length: 50 }),
    school: varchar("school", { length: 100 }),
    subject: varchar("subject", { length: 50 }),
    avatar: varchar("avatar", { length: 500 }),
    token: varchar("token", { length: 200 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("users_username_idx").on(table.username),
    index("users_token_idx").on(table.token),
  ]
);

// 对话记录表
export const conversations = pgTable(
  "conversations",
  {
    id: serial().primaryKey(),
    user_id: integer("user_id").notNull().references(() => users.id),
    title: varchar("title", { length: 200 }),
    preview: text("preview"),
    type: varchar("type", { length: 20 }).default("chat"),
    image_url: varchar("image_url", { length: 500 }),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updated_at: timestamp("updated_at", { withTimezone: true }),
  },
  (table) => [
    index("conversations_user_id_idx").on(table.user_id),
    index("conversations_created_at_idx").on(table.created_at),
  ]
);
