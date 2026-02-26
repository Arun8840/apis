import type { App } from "@/integrations/server"
import { treaty } from "@elysiajs/eden"

const domain =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    : window.location.origin

export const api = treaty<App>(domain).api
