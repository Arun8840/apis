import { relations } from "drizzle-orm"
import { application } from "./app-schema"
import { text, pgTable, timestamp } from "drizzle-orm/pg-core"
import { components } from "./component-schema"

export const appPage = pgTable("app_page", {
  id: text("id").primaryKey(),
  applicationId: text("applicationId")
    .references(() => application.id, { onDelete: "cascade" })
    .notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

export const appPageRelations = relations(appPage, ({ one, many }) => ({
  application: one(application, {
    fields: [appPage.applicationId],
    references: [application.id],
  }),
  components: many(components),
}))
