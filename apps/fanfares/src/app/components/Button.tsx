import { ButtonHTMLAttributes, ReactNode } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
  className?: string
  icon?: ReactNode
}

export function Button(props: ButtonProps) {
  const { label, className, icon, ...rest } = props

  return (
    <button
      {...rest}
      className={`px-2 flex items-center border border-white/20 justify-center py-2 rounded-full transition-all duration-300 ease-in-out transform text-sm font-gloock gap-2 ${className}`}>
      <span className="">{label}</span>
      <div className={icon ? "w-4 h-4 animate-spin" : "hidden"}>{icon}</div>
    </button>
  )
}

export default Button
