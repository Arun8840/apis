"use client"
import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AppWindow, Asterisk, Ban, CheckLine } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

// This is sample data.
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: Asterisk,
      items: [
        {
          title: "Todo",
          url: "/todos",
          isActive: true,
          icon: CheckLine,
        },
        {
          title: "Apps",
          url: "/apps",
          isActive: false,
          icon: AppWindow,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const currentPath = usePathname()
  return (
    <Sidebar {...props} collapsible="icon">
      <SidebarContent>
        {data.navMain.map((item) => {
          const GroupIcon = item?.icon || Ban
          return (
            <SidebarGroup key={item.title}>
              <SidebarGroupLabel>
                <GroupIcon className="mr-1 text-lime-300" />
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => {
                    const isActive = item.url.includes(currentPath)
                    const Icon = item?.icon || Ban
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          className="data-[active=true]:bg-primary/5"
                        >
                          <Link
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <Icon />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
