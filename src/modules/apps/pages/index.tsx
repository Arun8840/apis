"use client"
import { ModalDrawer } from "@/components/custom/modal-drawer"
import { Button } from "@/components/ui/button"
import MyLoader from "@/components/ui/my-loader"
import { useGetModalState } from "@/hooks/use-modal-state"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import { Eye, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import CreatePageForm from "../ui/create-page-form"

function Pages({ appId }: { appId: string }) {
  const { close, isOpen, open, setIsOpen } = useGetModalState({
    value: "create-page",
  })
  const { data, isPending, error } = useQuery({
    queryKey: ["pages", appId],
    queryFn: async () =>
      (
        await api.app.application({ appId: appId }).get({
          fetch: { credentials: "include" },
        })
      ).data,
  })

  const application = data?.data

  const createPages = useMemo(() => {
    return application?.pages?.map((page) => {
      const url = `/apps/${appId}/pages/${page?.id}`
      return (
        <Link key={page?.id} href={url} className="group">
          <div className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            {/* Page name header */}
            <div className="bg-muted/50 px-3 py-2 border-b flex items-center gap-1.5">
              <div className="size-2 bg-red-400 rounded-full" />
              <div className="size-2 bg-yellow-400 rounded-full" />
              <div className="size-2 bg-green-400 rounded-full" />
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
        </Link>
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
      <ModalDrawer
        title="Create Page"
        description="Fill out the form below to create a new page."
        open={isOpen}
        setOpen={setIsOpen}
      >
        <CreatePageForm close={close} appId={appId} />
      </ModalDrawer>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold px-2">{application?.title}</h1>
        <div className="flex items-center gap-2">
          <Button size={"sm"} variant={"outline"} asChild>
            <Link href={`/apps/${appId}/preview`}>
              <Eye /> Preview
            </Link>
          </Button>
          <Button size={"sm"} onClick={open}>
            <Plus /> Create Page
          </Button>
        </div>
      </div>

      {application?.pages?.length === 0 ? (
        <div className="flex-1 grid place-items-center text-muted-foreground text-sm">
          No pages yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {createPages}
        </div>
      )}
    </section>
  )
}

export default Pages
