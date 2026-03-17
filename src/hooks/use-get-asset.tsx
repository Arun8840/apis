import BuildLoader from "@/components/ui/my-loader"
import { Spinner } from "@/components/ui/spinner"
import { api } from "@/lib/eden.client"
import { UpdateAssetReqType } from "@/modules/apps/schema"
import { useMutation, useQuery } from "@tanstack/react-query"
import Image from "next/image"
import { JSX } from "react"
interface UseGetAssetProps {
  assetId: string
  pageId: string
  componentId: string
  applicationId: string
}

interface HookReturnProps {
  Component: () => JSX.Element
  isPending: boolean
  uploadImage: (url: string) => void
  updateImage: (updateAssetReqType: UpdateAssetReqType) => void
}
export const useGetAsset = (props: UseGetAssetProps): HookReturnProps => {
  const { assetId, pageId, componentId, applicationId } = props
  const createAsset = useMutation({
    mutationFn: async (url: string) => {
      const res = await api.assets.create.post({
        applicationId: applicationId,
        pageId,
        componentId,
        url: url,
        type: "image",
      })
      return res.data
    },
  })

  const updateAsset = useMutation({
    mutationFn: async (updateAssetReqType: UpdateAssetReqType) => {
      const res = await api.assets.update.post(updateAssetReqType)
      return res.data
    },
  })

  const { data, isPending, isError } = useQuery({
    queryKey: ["get-asset", assetId],
    queryFn: async () => {
      const res = await api.assets.asset.post(
        {
          pageId,
          assetId,
          componentId,
        },
        {
          fetch: {
            credentials: "include",
          },
        },
      )
      return res.data
    },
  })

  const uploadImage = async (url: string) => {
    await createAsset.mutateAsync(url)
  }

  const updateImage = async (updateAssetReqType: UpdateAssetReqType) => {
    await updateAsset.mutateAsync(updateAssetReqType)
  }
  const ImageComponent = () => {
    if (isPending) {
      return (
        <div className="size-full grid place-items-center">
          <BuildLoader />
        </div>
      )
    }
    if (isError) {
      return <div>Error</div>
    }

    const asset = data?.data
    return (
      <div className="size-full">
        <img
          src={asset?.url || ""}
          alt={asset?.name || ""}
          className="size-full object-center rounded-lg"
          loading="lazy"
        />
      </div>
    )
  }

  return { Component: ImageComponent, isPending, uploadImage, updateImage }
}
