import { jsonb, pgTable, text } from "drizzle-orm/pg-core"
import { application } from "./app-schema"
import { relations } from "drizzle-orm"

export const components = pgTable("components", {
  id: text("id").primaryKey(),
  applicationId: text("applicationId")
    .references(() => application.id, { onDelete: "cascade" })
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
})

// 3. THE MISSING PIECE: Define the relations
export const applicationRelations = relations(application, ({ many }) => ({
  components: many(components), // This allows 'with: { components: true }'
}))

export const componentsRelations = relations(components, ({ one }) => ({
  application: one(application, {
    fields: [components.applicationId],
    references: [application.id],
  }),
}))
