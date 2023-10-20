interface ButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

const Button = ({ label, onClick, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full transition flex items-center justify-center duration-300 ease-in-out transform text-sm font-semibold hover:bg-zinc-800 ${className}`}>
      {label}
    </button>
  )
}

export default Button
