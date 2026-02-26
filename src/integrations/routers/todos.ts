import { authGuard } from "@/lib/auth-guard"
import { Elysia } from "elysia"
import { db } from "../db"
import { todo } from "../db/schema"

export const todoRouters = new Elysia({ prefix: "/todo" }).use(authGuard).get(
  "/",
  async ({ user, session }) => {
    if (!user || !session) {
      throw new Error("Unauthorized")
    }

    const items = await db.select().from(todo)

    return {
      status: true,
      message: "Todos fetched successfully",
      data: items,
    }
  },
  {
    auth: true,
  },
)
