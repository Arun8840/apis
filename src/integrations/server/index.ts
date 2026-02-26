import { Elysia } from "elysia"

import { helloRouters } from "../routers/hello"
import { userRouters } from "../routers/users"
import { todoRouters } from "../routers/todos"
import { applicationRouter } from "../routers/applications"

export const app = new Elysia({ prefix: "/api" })
  .use(helloRouters)
  .use(userRouters)
  .use(todoRouters)
  .use(applicationRouter)

export type App = typeof app
