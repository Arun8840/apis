import { app } from "@/integrations/server"
import { treaty } from "@elysiajs/eden"

export const api = treaty(app).api

