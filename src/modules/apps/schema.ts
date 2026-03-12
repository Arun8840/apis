import z from "zod"

export const createApplicationSchema = z.object({
  title: z.string().min(1, "Required"),
  description: z.string(),
})

export const createComponentSchema = z.object({
  id: z.string(),
  type: z.string(),
  applicationId: z.string().min(1, "application id is required"),
  pageId: z.string().min(1, "page id is required"),
  position: z.object({
    x: z.number(),
    y: z.number(),
    w: z.number(),
    h: z.number(),
  }),
  options: z
    .object({
      content: z.string().optional(),
      src: z.string().optional(),
    })
    .optional(),
  style: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
})

export type AddComponentReqType = z.infer<typeof createComponentSchema>

export const createPageSchema = z.object({
  name: z.string().min(1, "Required"),
  description: z.string(),
  applicationId: z.string().min(1, "application id is required"),
})

export type AddPageReqType = z.infer<typeof createPageSchema>
