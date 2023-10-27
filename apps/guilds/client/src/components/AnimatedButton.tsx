import { ReactNode } from "react"

interface AnimatedMenuButtonProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

// todo remove the rounded border when on smaller screens

const AnimatedMenuButton = ({
  label,
  onClick,
  className,
  icon,
}: AnimatedMenuButtonProps) => {
  return (
    <div className="relative text-center rounded-full md:w-36 group">
      <div className="absolute top-0 w-0 h-full duration-300 ease-in-out transform bg-neutral-900 rounded-full group-hover:w-full" />
      <button
        onClick={onClick}
        className={`px-1 flex items-center gap-2 justify-center py-2 rounded-full w-full transition duration-300 ease-in-out transform text-sm font-semibold ${className}`}>
        <span className="hidden lg:flex">{label}</span>
        <span className="flex lg:hidden">{icon}</span>
      </button>
    </div>
  )
}

export default AnimatedMenuButton
