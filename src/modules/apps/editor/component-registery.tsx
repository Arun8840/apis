import { Skeleton } from "@/components/ui/skeleton"

import dynamic from "next/dynamic"

const skeletonClass = "w-full h-20"
export const componentRegistry = {
  Heading: dynamic(() => import("../dropped-components/Heading"), {
    loading: () => <Skeleton className={skeletonClass} />,
  }),
  Paragraph: dynamic(() => import("../dropped-components/Paragraph"), {
    loading: () => <Skeleton className={skeletonClass} />,
  }),
}
