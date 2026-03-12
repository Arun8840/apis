import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import {
  AddPageReqType,
  createApplicationSchema,
  createPageSchema,
} from "../schema"
import z from "zod"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/eden.client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

type CreatePageFormProps = {
  close: () => void
  appId: string
}
const CreatePageForm: React.FC<CreatePageFormProps> = ({ close, appId }) => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async (newPageData: AddPageReqType) => {
      const { data, error } = await api.app.page.create.post({
        ...newPageData,
      })
      if (error instanceof Error) {
        throw new Error(error?.message)
      }
      return data
    },
    onSuccess: async (context) => {
      toast.success(context?.message)
      await queryClient.invalidateQueries({
        queryKey: ["pages", appId],
      })
      close()
    },
    onError: (err) => {
      toast.error(err?.message)
    },
  })

  const isPending = mutation?.isPending
  const form = useForm<AddPageReqType>({
    defaultValues: {
      name: "",
      description: "",
      applicationId: appId,
    },
    resolver: zodResolver(createPageSchema),
  })

  const onCreate: SubmitHandler<AddPageReqType> = (data) => {
    mutation.mutate(data)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onCreate)}
      className="size-full flex flex-col justify-between"
    >
      <FieldGroup className="flex-1 ">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-create-name">Name</FieldLabel>
              <Input
                {...field}
                id="form-rhf-create-name"
                aria-invalid={fieldState.invalid || undefined}
                autoComplete="off"
              />
              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-rhf-create-description">
                Description
              </FieldLabel>
              <Textarea
                {...field}
                id="form-rhf-create-description"
                aria-invalid={fieldState.invalid || undefined}
                autoComplete="off"
              />
            </Field>
          )}
        />
      </FieldGroup>

      <Button disabled={isPending} className="w-full" type="submit">
        {isPending ? <Spinner /> : "Create"}
      </Button>
    </form>
  )
}

export default CreatePageForm
