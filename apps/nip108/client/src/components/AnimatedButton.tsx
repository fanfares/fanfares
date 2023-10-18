interface AnimatedButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

const AnimatedButton = ({ label, onClick, className }: AnimatedButtonProps) => {
  return (
    <div className="md:w-36 text-center group rounded-full relative">
      <div className="absolute bg-white w-0 h-full top-0 duration-300 ease-in-out transform group-hover:w-full  rounded-full" />
      <button
        onClick={onClick}
        className={`px-1 py-2 rounded-full w-full transition duration-300 ease-in-out transform group-hover:text-black text-sm font-semibold ${className}`}>
        {label}
      </button>
    </div>
  )
}

export default AnimatedButton
