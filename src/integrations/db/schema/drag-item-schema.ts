import { pgTable, text, uuid } from "drizzle-orm/pg-core"

export const dragItems = pgTable("dragItems", {
  id: uuid("id").primaryKey(),
  type: text("type").notNull(),
  label: text("lable").notNull(),
})
