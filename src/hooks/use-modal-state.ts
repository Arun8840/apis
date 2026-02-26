import { parseAsBoolean, useQueryState } from "nuqs"

interface CreateprojectModalProps {
  value: string
}
export const useGetModalState = ({
  value = "create",
}: CreateprojectModalProps) => {
  const [isOpen, setIsOpen] = useQueryState(
    value,
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  )

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  }
}
