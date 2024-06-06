// import AnimatedMenuButton from "@/components/AnimatedButton"
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <nav className="landingPageNavbar fixed top-0 z-50 flex h-20 w-full items-center justify-between gap-4 bg-transparent p-4 text-sm font-bold uppercase drop-shadow-2xl backdrop-blur duration-500 md:p-8 md:text-lg">
      <div className=" relative h-10 w-10 md:h-[70px] md:w-[70px]">
        <Image
          src={"/assets/excalibur.png"}
          layout="fill"
          objectFit="contain"
          alt="Excalibur Logo"
        />
      </div>
      <Link
        href="/discover"
        passHref
        role="button"
        target=""
        className={clsx(
          "ml-auto drop-shadow-2xl bg-white rounded-full md:text-sm"
        )}>
        {/* <AnimatedMenuButton
          className=" text-black hover:text-white"
          label="Start Listening"
        /> */}
      </Link>
    </nav>
  )
}

export default Navbar
