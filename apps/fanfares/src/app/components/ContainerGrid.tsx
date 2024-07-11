import { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  className?: string
}

export function ContainerGrid(props: GridContainerProps) {
  return (
    <div
      id="main-content-container-element"
      className={`${props.className} h-full overflow-y-auto mx-auto px-2 py-4 pb-20 md:pb-4`}>
      {props.children}
    </div>
  )
}
