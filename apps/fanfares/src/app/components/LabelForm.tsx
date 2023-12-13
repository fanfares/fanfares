interface FormLabelCreatorsProps {
  children: React.ReactNode
}

export default function FormLabelCreators({
  children,
}: FormLabelCreatorsProps) {
  return (
    <label className="px-2 py-1 text-xs font-semibold text-start text-white rounded-lg md:max-w-md flex flex-col min-w-fit md:w-1/2 bg-slate-900">
      {children}
    </label>
  )
}
