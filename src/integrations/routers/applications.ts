import { authGuard } from "@/lib/auth-guard"
import { Elysia, t } from "elysia"
import { db } from "../db"
import { application, components, dragItems } from "../db/schema"
import {
  createApplicationSchema,
  createComponentSchema,
  createPageSchema,
} from "@/modules/apps/schema"
import { eq } from "drizzle-orm"
import { appPage } from "../db/schema/app-page-schema"

export const applicationRouter = new Elysia({ prefix: "/app" })
  .use(authGuard)
  .get(
    "/",
    async ({ user, session }) => {
      if (!user || !session) {
        throw new Error("Unauthorized")
      }

      const items = await db.select().from(application)

      return {
        status: true,
        message: "Applications fetched successfully",
        data: items,
      }
    },
    {
      auth: true,
    },
  )
  .get("/dragItems", async () => {
    const components = await db.select().from(dragItems)
    return {
      status: true,
      message: "Drag items fetched successfully",
      data: components,
    }
  })
  .post(
    "/create/application",
    async ({ body, user, session }) => {
      const input = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!input?.title) {
        throw new Error("Title is required")
      }

      const [newApplication] = await db
        .insert(application)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          description: input.description,
        })
        .returning()

      return {
        status: true,
        message: "Application created successfully",
        data: newApplication,
      }
    },
    {
      body: createApplicationSchema,
      auth: true,
    },
  )
  .get(
    "/application/:appId",
    async ({ user, session, params }) => {
      const { appId } = params
      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      const res = await db
        .select()
        .from(appPage)
        .where(eq(appPage.applicationId, appId))
      return {
        status: true,
        message: "Pages fetched successfully",
        data: res,
      }
    },
    {
      auth: true,
    },
  )

  // * FOR PAGES
  .post(
    "/create/page",
    async ({ body, user, session }) => {
      const input = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!input?.applicationId || !input?.name) {
        throw new Error("Title is required")
      }

      const [newPage] = await db
        .insert(appPage)
        .values({
          id: crypto.randomUUID(),
          applicationId: input.applicationId,
          name: input.name,
          description: input.description,
        })
        .returning()

      return {
        status: true,
        message: "Page created successfully",
        data: newPage,
      }
    },
    {
      body: createPageSchema,
      auth: true,
    },
  )
  // * GET PAGES
  .get(
    "/pages/:appId",
    async ({ user, session, params }) => {
      const { appId } = params
      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      const pages = await db
        .select()
        .from(appPage)
        .where(eq(appPage.applicationId, appId))

      return {
        status: true,
        message: "Pages fetched successfully",
        data: pages,
      }
    },
    {
      auth: true,
    },
  )
  // * REMOVE PAGE
  .post(
    "/remove/page",
    async ({ body, user, session }) => {
      const { id } = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!id) {
        throw new Error("Page ID is required")
      }

      await db.delete(appPage).where(eq(appPage.id, id))

      return {
        status: true,
        message: "Page removed successfully",
      }
    },
    {
      body: t.Object({
        id: t.String(),
      }),
      auth: true,
    },
  )
  // * FOR COMPONENTS
  .get(
    "/page/:pageId",
    async ({ user, session, params }) => {
      const { pageId } = params
      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      const pageWithComponents = await db.query.appPage.findFirst({
        where: (appPage, { eq }) => eq(appPage.id, pageId),
        with: {
          components: true,
        },
      })

      return {
        status: true,
        message: "Components fetched successfully",
        data: pageWithComponents,
      }
    },
    {
      auth: true,
    },
  )

  .post(
    "/create/component",
    async ({ body, user, session }) => {
      const input = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!input?.applicationId || !input?.type) {
        throw new Error("Title is required")
      }

      const request = {
        id: input?.id,
        applicationId: input.applicationId,
        pageId: input.pageId,
        type: input.type,
        position: input.position,
        options: input.options ?? {},
        style: input.style ?? {},
      }
      const [newComponent] = await db
        .insert(components)
        .values(request)
        .returning()

      return {
        status: true,
        message: "Component created successfully",
        data: newComponent,
      }
    },
    {
      body: createComponentSchema,
      auth: true,
    },
  )
  .post(
    "/update/component",
    async ({ body, user, session }) => {
      const input = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!input?.applicationId || !input?.type) {
        throw new Error("Title is required")
      }

      const [updatedComponent] = await db
        .update(components)
        .set(input)
        .where(eq(components.id, input.id))
        .returning()

      return {
        status: true,
        message: `${updatedComponent?.type} updated successfully`,
        data: updatedComponent,
      }
    },
    {
      body: createComponentSchema,
      auth: true,
    },
  )
  .post(
    "/delete/component",
    async ({ body, user, session }) => {
      const { id } = body

      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      if (!id) {
        throw new Error("Component ID is required")
      }

      await db.delete(components).where(eq(components.id, id))

      return {
        status: true,
        message: "Component removed successfully",
      }
    },
    {
      body: t.Object({
        id: t.String(),
      }),
      auth: true,
    },
  )
