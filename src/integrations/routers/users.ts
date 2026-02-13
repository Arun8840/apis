import { authGuard } from "@/lib/auth-guard"
import { Elysia } from "elysia"

export const userRouters = new Elysia({ prefix: "/user" })
  .use(authGuard)
  .get(
    "/",
    ({ user, session }) => {
      return { message: "Welcome to the user endpoint!", user, session }
    },
    {
      auth: true,
    },
  )
  .get("/public", () => {
    return "this is public api"
  })
