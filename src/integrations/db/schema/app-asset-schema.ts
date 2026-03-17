import { pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { appPage } from "./app-page-schema"
import { application } from "./app-schema"
import { relations } from "drizzle-orm"
import { components } from "./component-schema"

export const appAssetSchema = pgTable("app_asset", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  applicationId: text("application_id").notNull(),
  componentId: text("component_id").notNull(),
  pageId: text("page_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const appAssetRelations = relations(appAssetSchema, ({ one }) => ({
  page: one(appPage, {
    fields: [appAssetSchema.pageId],
    references: [appPage.id],
  }),
  component: one(components, {
    fields: [appAssetSchema.componentId],
    references: [components.id],
  }),
}))
