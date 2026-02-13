import Elysia from "elysia"
import { auth } from "./auth"

export const authGuard = new Elysia({ name: "better-auth" }).macro({
  auth: {
    async resolve({ status, request: { headers } }) {
      // Retrieve session using Better Auth API
      const session = await auth.api.getSession({ headers })

      if (!session) {
        return status(401) // Unauthorized
      }

      return {
        user: session.user,
        session: session.session,
      }
    },
  },
})
