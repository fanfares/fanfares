import { ReactNode } from "react"

interface ButtonProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  id?: string
  className?: string
}

const Button = ({ label, onClick, className, icon, id }: ButtonProps) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`px-1 flex items-center border border-white/20 justify-center py-2 rounded-full transition-all duration-300 ease-in-out transform text-sm font-semibold hover:bg-slate-900 ${className}`}>
      <span className="">{label}</span>
      <span className={`${icon ? "ml-2" : ""}`}>{icon}</span>
    </button>
  )
}

export default Button
