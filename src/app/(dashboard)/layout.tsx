import DashboradLayout from "@/layouts/dashboard-layout"
import React from "react"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboradLayout>{children}</DashboradLayout>
}
