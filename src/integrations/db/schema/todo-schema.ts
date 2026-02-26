import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { user } from "./auth-schema"

export const todo = pgTable("todo", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  completed: boolean("completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  creatorUserId: text("creator_user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
})
