import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"
import { ReactNode } from "react"

export interface TextProps {
  size?: "sm" | "md" | "lg"
  children: ReactNode
  asChild?: boolean
  className?: string
  id?: string
}

export function Text({
  size = "md",
  children,
  asChild,
  className,
  id,
}: TextProps) {
  const Comp = asChild ? Slot : "span"
  return (
    <Comp
      id={id}
      className={clsx(
        "",
        {
          "text-xs": size === "sm",
          "text-sm": size === "md",
          "text-md": size === "lg",
        },
        className
      )}>
      {children}
    </Comp>
  )
}
