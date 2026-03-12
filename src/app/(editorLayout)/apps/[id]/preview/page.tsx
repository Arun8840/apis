import ApplicationPreviewContainer from "@/modules/apps/preview"

interface ParamsProps {
  id: string
}
export default async function ApplicationPagePreview({
  params,
}: {
  params: Promise<ParamsProps>
}) {
  const { id } = await params
  return (
    <>
      <ApplicationPreviewContainer appId={id} />
    </>
  )
}
