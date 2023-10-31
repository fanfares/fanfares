import { ReactNode } from "react"
import { clsx } from "clsx"

interface AnimatedMenuButtonProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
  className?: string
  mobile?: boolean
}

// todo remove the rounded border when on smaller screens

const AnimatedMenuButton = ({
  label,
  onClick,
  className,
  icon,
  mobile,
}: AnimatedMenuButtonProps) => {
  return (
    <div className="relative text-center rounded-full md:w-36 group">
      <div className="absolute top-0 w-0 h-full duration-300 ease-in-out transform rounded-full bg-neutral-900 group-hover:md:w-full" />
      <button
        onClick={onClick}
        className={clsx(
          className,
          `px-1 flex items-center gap-2 justify-center py-2 rounded-full md:w-full w-fit transition duration-300 ease-in-out transform  font-semibold 
          `,
          { "text-sm": !mobile }
        )}>
        <span className="flex lg:hidden">{icon}</span>
        <span
          className={clsx("lg:flex", {
            flex: mobile,
            hidden: !mobile,
          })}>
          {label}
        </span>
      </button>
    </div>
  )
}

export default AnimatedMenuButton
