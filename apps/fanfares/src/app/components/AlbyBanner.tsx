import { HTMLAttributes, ReactNode } from "react"

export interface AlbyBannerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function AlbyBanner(props: AlbyBannerProps) {
  const { className, ...rest } = props

  return (
    <div
      {...rest}
      className={`px-1 flex items-center border border-white/0 justify-center py-2 transition-all duration-300 ease-in-out transform text-sm hover:bg-skin-fill gap-2 ${className}`}
      style={{ backgroundColor: "#ffdd00", color: "black" }}
      >
        Alby is currently the only supported wallet. More coming soon!
      <img src="https://getalby.com/assets/alby-logo-head-da6c4355b69a3baac3fc306d47741c9394a825e54905ef67c5dd029146b89edf.svg" className={"h-8"}/>
    </div>
  )
}

export default AlbyBanner