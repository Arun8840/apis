import { Skeleton } from "@/components/ui/skeleton"

import dynamic from "next/dynamic"

const skeletonClass = "w-20 h-20"
export const componentRegistry = {
  Heading: dynamic(() => import("../dropped-components/Heading"), {
    loading: () => <Skeleton className={skeletonClass} />,
  }),
  Paragraph: dynamic(() => import("../dropped-components/Paragraph"), {
    loading: () => <Skeleton className={skeletonClass} />,
  }),
  Button: dynamic(() => import("../dropped-components/Button"), {
    loading: () => <Skeleton className={skeletonClass} />,
  }),
}
