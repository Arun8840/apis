"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import MyLoader from "@/components/ui/my-loader"
import { api } from "@/lib/eden.client"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { useMemo } from "react"

function Pages({ appId }: { appId: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: ["pages", appId],
    queryFn: async () =>
      (
        await api.app.application({ appId: appId }).get({
          fetch: { credentials: "include" },
        })
      ).data,
  })

  const pageItems = useMemo(() => {
    return data?.data?.map((page) => {
      const url = `/apps/${appId}/pages/${page?.id}`
      return (
        <Link key={page?.id} href={url}>
          <Card className="p-1 gap-1">
            <div className="flex items-center gap-1 p-2">
              <div className="size-2 bg-red-500 rounded-full" />
              <div className="size-2 bg-yellow-500 rounded-full" />
              <div className="size-2 bg-green-500 rounded-full" />
            </div>

            <CardContent className="px-1">
              <div className="h-50 w-full bg-accent rounded-lg" />
            </CardContent>
            <div className="p-1 w-full flex items-center justify-between">
              <small>{page?.name}</small>
              <small className="text-muted-foreground">
                {new Date(page?.createdAt).toDateString()}
              </small>
            </div>
          </Card>
        </Link>
      )
    })
  }, [appId, data])

  if (isPending)
    return (
      <div className="min-h-screen grid place-items-center">
        <MyLoader />
      </div>
    )
  if (error) return <div>Error:{error.message}</div>

  console.log(data?.data)
  return (
    <section className="p-4 min-h-screen grid lg:grid-cols-4 auto-rows-max gap-3">
      {pageItems}
    </section>
  )
}

export default Pages
