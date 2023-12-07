import { ReactNode } from "react"

interface ButtonProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

const Button = ({ label, onClick, className, icon }: ButtonProps) => {
  return (
    <div className="relative text-center rounded-full md:w-36 group">
      <div className="absolute top-0 w-0 h-full duration-300 ease-in-out transform rounded-full bg-neutral-900 group-hover:w-full" />
      <button
        onClick={onClick}
        className={`px-1 flex items-center border border-white/20 gap-2 justify-center py-2 rounded-full w-full transition duration-300 ease-in-out transform text-sm font-semibold ${className}`}>
        <span className="">{label}</span>
        <span className="flex gap-2">{icon}</span>
      </button>
    </div>
  )
}

export default Button
