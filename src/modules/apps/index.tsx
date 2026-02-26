"use client"
import { ModalDrawer } from "@/components/custom/modal-drawer"
import { Button } from "@/components/ui/button"
import { useGetModalState } from "@/hooks/use-modal-state"
import ApplicationForm from "./ui/create-application-form"
import { DataTable } from "@/components/custom/data-table"
import { ColumnDef } from "@tanstack/react-table"
import { Application } from "@/types/application-types"
import MyLoader from "@/components/ui/my-loader"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/eden.client"
import Image from "next/image"
import PlaceholderImage from "/placeholder.svg"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowUpRight, Plus } from "lucide-react"
import Link from "next/link"
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

  const columns: ColumnDef<Application>[] = [
    {
      accessorKey: "title",
      header: "App",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("title")}</div>
      ),
    },
  ]

  if (isPending) {
    return <MyLoader />
  }
  return (
    <div>
      <ModalDrawer
        title="Create Application"
        description="Fill out the form below to create a new application."
        open={isOpen}
        setOpen={setIsOpen}
      >
        <ApplicationForm close={close} />
      </ModalDrawer>

      {createHeader()}
      <div className="grid lg:grid-cols-4 gap-2">
        {items?.map((app, appIdx) => {
          return (
            <Card
              className="p-1 gap-2 shadow-none hover:shadow transition-shadow relative"
              key={app?.id}
            >
              <CardContent className="px-0">
                <Image
                  src="/placeholder.svg" // Direct path from public folder
                  alt="Project Placeholder"
                  className="object-contain w-full dark:brightness-90"
                  width={200}
                  height={200}
                />
              </CardContent>
              <CardHeader className="p-2">
                <CardTitle>{app?.title}</CardTitle>
                <CardDescription>{app?.description}</CardDescription>
              </CardHeader>

              {/* //* go link */}
              <Button
                size={"icon-sm"}
                variant={"secondary"}
                className="absolute top-2 right-2"
                asChild
              >
                <Link href={`/apps/${app?.id}`}>
                  <ArrowUpRight />
                </Link>
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default AppContainer
