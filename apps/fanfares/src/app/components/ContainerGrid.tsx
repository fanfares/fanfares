import { ReactNode } from "react"

interface GridContainerProps {
  children: ReactNode
  className?: string
}

export function ContainerGrid(props: GridContainerProps) {
  return (
    <div
      id="main-content-container-element"
      className={`${props.className}  overflow-y-scroll md:max-w-4xl lg:max-w-6xl mx-auto w-full px-2 py-4 pb-20 md:pb-4`}>
      {props.children}
    </div>
  )
}
