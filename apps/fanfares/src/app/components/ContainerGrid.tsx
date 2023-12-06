import { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  className?: string
}

export function ContainerGrid(props: GridContainerProps) {
  return (
    <div
      className={`${props.className} container max-w-7xl mx-auto w-full px-2`}>
      {props.children}
    </div>
  )
}
