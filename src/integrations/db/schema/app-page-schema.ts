import { relations } from "drizzle-orm"
import { application } from "./app-schema"
import { text, pgTable, timestamp, json, index } from "drizzle-orm/pg-core"
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
  styles: json("styles").$type<{
    background?: string
    padding?: string
  }>().default({}),
}, (table) => ({
  appIdIdx: index("page_app_id_idx").on(table.applicationId),
}))

export const appPageRelations = relations(appPage, ({ one, many }) => ({
  application: one(application, {
    fields: [appPage.applicationId],
    references: [application.id],
  }),
  components: many(components),
}))
