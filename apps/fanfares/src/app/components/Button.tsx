import { ButtonHTMLAttributes, ReactNode } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>  {
  label: string | ReactNode
  className?: string
  icon?: ReactNode
}

export function Button(props: ButtonProps){
  const { label, className, icon, ...rest } = props;

  return (
    <button
      {...rest}
      className={`px-1 flex items-center border border-white/20 justify-center py-2 rounded-full transition-all duration-300 ease-in-out transform text-sm font-semibold hover:bg-skin-fill ${className}`}
    >
      <span className="">{label}</span>
      <span className={`${icon ? "ml-2" : ""}`}>{icon}</span>
    </button>
  )
}

export default Button
