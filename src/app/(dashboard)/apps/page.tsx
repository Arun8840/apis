import AppContainer from "@/modules/apps"
import { Suspense } from "react"

export default function AppTemplates() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppContainer />
    </Suspense>
  )
}
