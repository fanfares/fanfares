interface AnimatedMenuButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

const AnimatedMenuButton = ({
  label,
  onClick,
  className,
}: AnimatedMenuButtonProps) => {
  return (
    <div className="relative text-center rounded-full md:w-36 group">
      <div className="absolute top-0 w-0 h-full duration-300 ease-in-out transform bg-neutral-900 rounded-full group-hover:w-full" />
      <button
        onClick={onClick}
        className={`px-1 py-2 rounded-full w-full transition duration-300 ease-in-out transform text-sm font-semibold ${className}`}>
        {label}
      </button>
    </div>
  )
}

export default AnimatedMenuButton
