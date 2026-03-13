"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { api } from "@/lib/eden.client"
import { AddComponentReqType } from "@/modules/apps/schema"

export function useEditorMutations() {
  const addComponent = useMutation({
    mutationFn: async (component: AddComponentReqType) =>
      (await api.app.create.component.post(component)).data,
    onSuccess: (res) => toast.success(res?.message),
  })

  const updateComponent = useMutation({
    mutationFn: async (component: AddComponentReqType) =>
      await api.app.update.component.post(component),
    onSuccess: (res) => toast.success(res?.data?.message),
  })

  return {
    addComponent,
    updateComponent,
  }
}
