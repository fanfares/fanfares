import { LabelHTMLAttributes } from "react"

export interface FormLabelCreatorsProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode
  className?: string
}

export function FormLabelCreators(props: FormLabelCreatorsProps) {
  const { className, children, ...rest } = props;

  return (
    <label
      {...rest}
      className={`px-4 py-2 text-xs font-semibold text-start text-white rounded-lg md:max-w-md flex flex-col min-w-fit md:w-1/2 bg-skin-fill ${className}`}
    >
      {children}
    </label>
  )
}
