import AuthLayout from "@/layouts/auth-layout"
import React from "react"

export default function authLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthLayout>{children}</AuthLayout>
}
