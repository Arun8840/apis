import { createAuthClient } from "better-auth/react"
export const authClient = createAuthClient({
  baseURL: "https://apis-amber.vercel.app",
  plugins: [],
})
