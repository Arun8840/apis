import React from "react"

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="w-full min-h-screen grid place-items-center">
      {children}
    </section>
  )
}

export default AuthLayout
