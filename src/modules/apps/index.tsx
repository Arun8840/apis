"use client"
import { ModalDrawer } from "@/components/custom/modal-drawer"
import { Button } from "@/components/ui/button"
import { useGetModalState } from "@/hooks/use-modal-state"
import ApplicationForm from "./ui/create-application-form"
import { ColumnDef } from "@tanstack/react-table"
import { Application, PageType } from "@/types/application-types"
import MyLoader from "@/components/ui/my-loader"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUpRight, Asterisk, Plus } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
function AppContainer() {
  const { open, isOpen, setIsOpen, close } = useGetModalState({
    value: "create-application",
  })
  const { data, isPending, isError } = useQuery({
    queryKey: ["get/applications"],
    queryFn: async () => {
      const res = await api.app.get({
        fetch: { credentials: "include" },
      })

      if (res.error) throw res.error
      return res.data
    },
  })

  const items = data?.data || []

  const createHeader = () => {
    return (
      <div className="pb-2 flex items-center">
        <h1 className="flex-1 font-medium font-sans">Applications</h1>
        <Button type="button" size={"sm"} onClick={open}>
          <Plus /> Create App
        </Button>
      </div>
    )
  }

  const createFiles = (pages: PageType[]) => {
    // Only take the first 3 pages to show in the stack
    return pages?.slice(0, 3).map((page, index) => {
      // Offset and rotation values for the stack effect
      const rotations = ["-rotate-6", "rotate-5", "rotate-3"]
      const offsets = ["left-3", "left-5", "left-4"]
      const topOffsets = ["top-4", "top-5", "top-6"]

      return (
        <div
          key={page?.id}
          className={`absolute inset-x-4 ${topOffsets[index]} bottom-10 bg-white shadow-sm border border-black/10 rounded-sm transition-transform duration-300 group-hover:-translate-y-6 ${rotations[index]} ${offsets[index]}`}
          style={{
            zIndex: index + 1,
            width: "85%", // Make them slightly narrower than the folder
          }}
        >
          {/* Lines to simulate text on the "page" */}
          <div className="p-2 flex flex-col gap-1">
            <div className="h-1 w-3/4 bg-gray-100 rounded" />
            <div className="h-1 w-1/2 bg-gray-100 rounded" />
            <div className="mt-2 text-[8px] text-primary dark:text-black font-mono truncate">
              {page.name}.tsx
            </div>
          </div>
        </div>
      )
    })
  }

  const createApplicationFolders = useMemo(() => {
    return items?.map((app) => {
      const hasFiles = Array.isArray(app?.pages) && app?.pages?.length > 0
      return (
        <div
          key={app?.id}
          className="group flex flex-col items-center gap-2 w-64 cursor-pointer"
        >
          {/* Folder Container */}
          <div className="relative w-60 h-48 drop-shadow-md transition-transform duration-200">
            {/* Back Leaf (Darker blue) */}
            <div className="absolute inset-0 bg-blue-600 rounded-2xl shadow-inner">
              <div
                className="absolute -top-[12px] left-0 h-8 w-24 bg-blue-600 rounded-tl-lg rounded-tr-4xl"
                // style={{ clipPath: "polygon(0 0, 85% 0, 100% 100%, 0% 100%)" }}
              />
            </div>

            {/* Render the stack of 3 pages */}
            {createFiles(app?.pages)}

            {/* Front Leaf (Lighter blue with gradient) */}
            <div
              data-hasfiles={hasFiles}
              className="absolute inset-x-0 bottom-0 data-[hasfiles=true]:h-36 h-11/12 bg-gradient-to-b from-blue-400 to-blue-500 rounded-xl shadow-[0_-4px_12px_rgba(0,0,0,0.15)] border-t border-white/40 z-10"
            >
              {/* Decorative Detail */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-white/10" />
            </div>
          </div>

          {/* Label */}
          <Link
            href={`/apps/${app?.id}`}
            className="text-xs font-medium px-2 py-0.5 rounded-md transition-colors group-hover:bg-blue-600 group-hover:text-white flex items-center gap-2"
          >
            {app?.title || "Untitled Application"}
            <small className="text-xs">{app?.createdAt.toDateString()}</small>
          </Link>
        </div>
      )
    })
  }, [items])

  if (isPending) {
    return <MyLoader />
  }
  return (
    <div className="flex flex-col gap-5">
      <ModalDrawer
        title="Create Application"
        description="Fill out the form below to create a new application."
        open={isOpen}
        setOpen={setIsOpen}
      >
        <ApplicationForm close={close} />
      </ModalDrawer>

      {createHeader()}

      <div className="flex flex-wrap gap-5">{createApplicationFolders}</div>
    </div>
  )
}

export default AppContainer
