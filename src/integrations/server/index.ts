import { Elysia } from "elysia"

import { helloRouters } from "../routers/hello"
import { userRouters } from "../routers/users"

export const app = new Elysia({ prefix: "/api" })
  .use(helloRouters)
  .use(userRouters)
