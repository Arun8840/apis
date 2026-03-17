import { Elysia } from "elysia"

import { helloRouters } from "../routers/hello"
import { userRouters } from "../routers/users"
import { todoRouters } from "../routers/todos"
import { applicationRouter } from "../routers/applications"
import { assetRouters } from "../routers/assets"

export const app = new Elysia({ prefix: "/api" })
  .use(helloRouters)
  .use(userRouters)
  .use(todoRouters)
  .use(applicationRouter)
  .use(assetRouters)

export type App = typeof app
