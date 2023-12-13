import clsx from "clsx"
import React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  className?: string
  child?: React.ReactNode
  icon?: React.ReactNode
  disabled?: boolean
  buttonType?: "default" | "submit" | "reset" | "cancel"
  text?: string
  ariaLabel?: string
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  child,
  className,
  icon,
  disabled,
  buttonType,
  text,
  ariaLabel,
  ...props
}) => {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      disabled={disabled}
      className={clsx(
        className,
        "md:text-md flex w-fit max-w-[175px] cursor-pointer items-center justify-center rounded-md border border-transparent px-5 py-3 font-medium text-skin-base shadow-sm outline-none drop-shadow-lg active:scale-95 active:text-skin-inverted",
        {
          "bg-skin-button-default text-xs hover:bg-skin-button-accent-hover active:bg-skin-button-active ":
            buttonType === "default" || !buttonType,
          " bg-skin-button-default hover:bg-red-400 active:bg-red-300":
            buttonType === "cancel",
          "gap-2": icon,
          "cursor-not-allowed active:scale-100 disabled:bg-slate-900/50 disabled:text-skin-muted/30":
            disabled,
          " hover:bg-green-400 active:bg-green-300": buttonType === "submit",
        }
      )}
      onClick={onClick}>
      {child}
      {text}
      {icon}
    </button>
  )
}

export default Button
