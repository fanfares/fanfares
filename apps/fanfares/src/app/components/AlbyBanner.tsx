import { ButtonHTMLAttributes, ReactNode } from "react"

export interface AlbyBannerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string | ReactNode
  className?: string
  style?: string
  icon?: ReactNode
}

export function AlbyBanner(props: AlbyBannerProps) {
  const { label, className, icon, ...rest } = props

  return (
    <div
      {...rest}
      className={`px-1 flex items-center border border-white/0 justify-center py-2 rounded-full transition-all duration-300 ease-in-out transform text-sm hover:bg-skin-fill font-gloock gap-2 ${className}`}
      style={{ backgroundColor: "black" }}
      >
        Please only use Alby for payments!
      <img src="https://getalby.com/assets/alby-logo-head-white-bd4a7729498faefdb4d9302fbebfeaef3f309dace4ca5107ba3a0bad56b87911.svg" className={"h-8"}/>
      <span className="">{label}</span>
    </div>
  )
}

export default AlbyBanner
