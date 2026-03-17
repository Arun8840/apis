import { authGuard } from "@/lib/auth-guard"
import Elysia, { t } from "elysia"
import { appAssetSchema, components } from "../db/schema"
import { db } from "../db"
import { createAssetSchema, updateAssetSchema } from "@/modules/apps/schema"
import { eq } from "drizzle-orm"

export const assetRouters = new Elysia({ prefix: "assets" })
  .use(authGuard)
  .post(
    "asset",
    async ({ body, user, session }) => {
      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      const { pageId, assetId, componentId } = body
      if (!pageId || !assetId) {
        throw new Error("Required fields are missing")
      }
      const asset = await db.query.appAssetSchema.findFirst({
        where: eq(appAssetSchema.id, assetId),
        with: {
          page: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      })
      if (!asset) {
        throw new Error("Asset not found")
      }
      if (asset.componentId !== componentId) {
        throw new Error(
          "Component ID mismatch: This asset does not belong to the specified component",
        )
      }
      return {
        status: true,
        message: "Asset fetched successfully",
        data: asset,
      }
    },
    {
      auth: true,
      body: t.Object({
        pageId: t.String(),
        assetId: t.String(),
        componentId: t.String(),
      }),
    },
  )
  .post(
    "/create",
    async ({ user, session, body }) => {
      if (!user || !session) {
        throw new Error("Unauthorized")
      }

      const { pageId, componentId, url, type, applicationId } = body

      if (!pageId || !componentId || !url) {
        throw new Error("Required fields are missing")
      }

      const req = {
        id: crypto.randomUUID(),
        url,
        pageId,
        componentId,
        type,
        applicationId,
        name: "",
      }

      const [newAsset] = await db.insert(appAssetSchema).values(req).returning()

      await db
        .update(components)
        .set({
          assetId: newAsset.id,
        })
        .where(eq(components.id, componentId))

      return {
        status: true,
        message: "Asset created successfully",
        data: newAsset,
      }
    },
    {
      auth: true,
      body: createAssetSchema,
    },
  )
  .post(
    "/update",
    async ({ body, user, session }) => {
      if (!user || !session) {
        throw new Error("Unauthorized")
      }
      const { id } = body
      if (!id) {
        throw new Error("Asset ID is required")
      }
      const [updatedAsset] = await db
        .update(appAssetSchema)
        .set({
          url: body?.url,
        })
        .where(eq(appAssetSchema.id, id))
        .returning()
      await db
        .update(components)
        .set({
          assetId: updatedAsset.id,
        })
        .where(eq(components.id, body.componentId))
      return {
        status: true,
        message: "Asset updated successfully",
        data: updatedAsset,
      }
    },
    {
      auth: true,
      body: updateAssetSchema,
    },
  )
