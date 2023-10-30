import clsx from "clsx"
import { ReactNode } from "react"

interface ButtonDefaultProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
}

const ButtonDefault = ({
  label,
  onClick,
  className,
  icon,
}: ButtonDefaultProps) => {
  return (
    <div className="relative text-center rounded-full md:w-36 group">
      <div className="absolute top-0 w-0 h-full duration-300 ease-in-out transform bg-neutral-900 rounded-full group-hover:w-full" />
      <button
        onClick={onClick}
        className={clsx(
          className,
          `flex items-center border border-white/20 justify-center py-2 px-4 rounded-full w-full transition duration-300 ease-in-out transform text-sm font-semibold`,
          { "gap-2 ": icon }
        )}>
        <span className="">{label}</span>
        <span className="">{icon}</span>
      </button>
    </div>
  )
}

export default ButtonDefault
