"use client"
import { ModalDrawer } from "@/components/custom/modal-drawer"
import { Button } from "@/components/ui/button"
import MyLoader from "@/components/ui/my-loader"
import { useGetModalState } from "@/hooks/use-modal-state"
import { api } from "@/lib/eden.client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, ArrowUpRight, Eye, Plus, X } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import CreatePageForm from "../ui/create-page-form"
import { useConfirm } from "@/hooks/use-confirm"
import { toast } from "sonner"
import FadeIn from "@/components/custom/fade-in"

function Pages({ appId }: { appId: string }) {
  const { close, isOpen, open, setIsOpen } = useGetModalState({
    value: "create-page",
  })
  const queryClient = useQueryClient()
  const [DeleteModal, confirmDelete] = useConfirm(
    "Delete Page",
    "Are you sure you want to delete this page?",
    "destructive",
  )
  const { data, isPending, error } = useQuery({
    queryKey: ["pages", appId],
    queryFn: async () =>
      (
        await api.app.application({ appId: appId }).get({
          fetch: { credentials: "include" },
        })
      ).data,
  })

  const mutation = useMutation({
    mutationFn: async (pageId: string) => {
      return await api.app.remove.page.post(
        { id: pageId },
        { fetch: { credentials: "include" } },
      )
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message)
      queryClient.invalidateQueries({
        queryKey: ["pages", appId],
      })
    },
    onError: (err) => {
      toast.error(err?.message)
    },
  })

  const application = data?.data

  const hasPages =
    Array.isArray(application?.pages) && application?.pages?.length > 0
  const deletePage = async (pageId: string) => {
    const res = await confirmDelete()
    if (res) {
      mutation.mutate(pageId)
    }
  }

  const createPages = useMemo(() => {
    return application?.pages?.map((page) => {
      const url = `/apps/${appId}/pages/${page?.id}`
      return (
        <div
          key={page?.id}
          className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
        >
          {/* Page name header */}
          <div className="bg-muted/50 px-3 py-2 border-b flex items-center gap-1.5">
            <Button
              size={"icon-xs"}
              type="button"
              className="size-3 bg-red-400 rounded-full"
              onClick={() => deletePage(page?.id)}
              title="Remove page"
            >
              <X className="size-2 text-red-800" />
            </Button>
            <Button
              size={"icon-xs"}
              type="button"
              className="size-3 bg-blue-400 rounded-full"
              title="Design page"
            >
              <Link key={page?.id} href={url} className="group">
                <ArrowUpRight className="size-2 text-blue-800" />
              </Link>
            </Button>
            <span className="ml-2 text-xs font-medium truncate text-foreground">
              {page?.name}
            </span>
          </div>

          {/* Page preview area */}
          <div className="h-44 w-full bg-accent/40 group-hover:bg-accent/60 transition-colors flex items-center justify-center">
            <span className="text-4xl font-bold text-muted-foreground/10 select-none uppercase">
              {page?.name?.charAt(0)}
            </span>
          </div>

          {/* Footer */}
          <div className="px-3 py-2 flex items-center justify-between">
            <span className="text-xs font-medium truncate">{page?.name}</span>
            <span className="text-xs text-muted-foreground shrink-0">
              {new Date(page?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      )
    })
  }, [data?.data])

  if (isPending)
    return (
      <div className="min-h-screen grid place-items-center">
        <MyLoader />
      </div>
    )
  if (error) return <div>Error: {error.message}</div>

  return (
    <section className="p-4 min-h-screen flex flex-col gap-4">
      <DeleteModal />
      <ModalDrawer
        title="Create Page"
        description="Fill out the form below to create a new page."
        open={isOpen}
        setOpen={setIsOpen}
      >
        <CreatePageForm close={close} appId={appId} />
      </ModalDrawer>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant={"outline"} size={"icon-sm"} asChild>
            <Link href={"/apps"}>
              <ArrowLeft />
            </Link>
          </Button>
          <h1 className="text-2xl font-sans font-semibold px-2">
            {application?.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {hasPages && (
            <Button size={"sm"} variant={"outline"} asChild>
              <Link href={`/apps/${appId}/preview`}>
                <Eye /> Preview
              </Link>
            </Button>
          )}
          <Button size={"sm"} onClick={open}>
            <Plus /> Create Page
          </Button>
        </div>
      </div>

      {application?.pages?.length === 0 ? (
        <div className="flex-1 grid place-items-center text-muted-foreground text-sm">
          create a page to get started
        </div>
      ) : (
        <FadeIn
          stagger={0.1}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {createPages}
        </FadeIn>
      )}
    </section>
  )
}

export default Pages
