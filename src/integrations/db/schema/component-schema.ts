import { jsonb, pgTable, text, index } from "drizzle-orm/pg-core"
import { application } from "./app-schema"
import { relations } from "drizzle-orm"
import { appPage } from "./app-page-schema"

export const components = pgTable("components", {
  id: text("id").primaryKey(),
  applicationId: text("applicationId")
    .references(() => application.id, { onDelete: "cascade" })
    .notNull(),
  pageId: text("pageId")
    .references(() => appPage.id, { onDelete: "cascade" })
    .notNull(),
  type: text("type").notNull(),
  position: jsonb("position")
    .$type<{
      x: number
      y: number
      w: number
      h: number
    }>()
    .notNull(),
  options: jsonb("options")
    .$type<{
      content?: string
      src?: string
    }>()
    .notNull(),
  style: jsonb("style")
    .$type<{
      backgroundColor?: string
      padding?: number
      margin?: number
      border?: string
      borderRadius?: number
      boxShadow?: string
      opacity?: number
      cursor?: string
      transition?: string
    }>()
    .notNull(),
}, (table) => ({
  appIdIdx: index("comp_app_id_idx").on(table.applicationId),
  pageIdIdx: index("comp_page_id_idx").on(table.pageId),
  typeIdx: index("comp_type_idx").on(table.type),
}))

export const componentsRelations = relations(components, ({ one }) => ({
  appPage: one(appPage, {
    fields: [components.pageId],
    references: [appPage.id],
  }),
}))
