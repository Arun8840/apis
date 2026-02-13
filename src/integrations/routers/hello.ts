import { Elysia, t } from "elysia"

export const helloRouters = new Elysia({ prefix: "/hello" }).get(
  "/",
  "Hello world",
)
