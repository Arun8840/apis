import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { appPage } from "./app-page-schema"
import { relations } from "drizzle-orm"
import { components } from "./component-schema"

export const application = pgTable("applications", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const applicationRelations = relations(application, ({ many }) => ({
  pages: many(appPage),
}))
