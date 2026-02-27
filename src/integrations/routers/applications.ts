import { authGuard } from "@/lib/auth-guard"
import { Elysia, t } from "elysia"
import { db } from "../db"
import { application, components, dragItems } from "../db/schema"
import {
  createApplicationSchema,
  createComponentSchema,
} from "@/modules/apps/schema"
import { eq } from "drizzle-orm"

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
      const appWithComponents = await db.query.application.findFirst({
        where: (application, { eq }) => eq(application.id, appId),
        with: {
          components: true,
        },
      })

      return {
        status: true,
        message: "Components fetched successfully",
        data: appWithComponents,
      }
    },
    {
      auth: true,
    },
  )
  // * FOR COMPONENTS
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
        applicationId: input?.applicationId,
        type: input?.type,
        position: input?.position,
      }
      const [newComponent] = await db
        .insert(components)
        .values(request)
        .returning()

      return {
        status: true,
        message: "Application created successfully",
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

      const request = {
        id: input?.id,
        applicationId: input?.applicationId,
        type: input?.type,
        position: input?.position,
      }
      const [updatedComponent] = await db
        .update(components)
        .set(request)
        .where(eq(components.id, request.id))
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
