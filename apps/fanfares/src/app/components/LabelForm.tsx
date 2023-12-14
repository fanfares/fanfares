import { StringDecoder } from "string_decoder"

interface FormLabelCreatorsProps {
  children: React.ReactNode
  id?: string
}

export default function FormLabelCreators({
  children,
  id,
}: FormLabelCreatorsProps) {
  return (
    <label
      id={id}
      className="px-4 py-2 text-xs font-semibold text-start text-white rounded-lg md:max-w-md flex flex-col min-w-fit md:w-1/2 bg-skin-fill">
      {children}
    </label>
  )
}
