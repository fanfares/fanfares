"use client"
// import { FAProSolid, FontAwesomeIcon } from "@excalibur/config/fontawesome"
import React, { useEffect, useState } from "react"
const LazyIframe = React.lazy(() => import("./LazyIframe"))

// const displayIcons = [
//   { icon: <BiPodcast/>, text: "Creative Content" },
//   { icon: FAProSolid.faMoneyBillTransfer, text: "Peer to Peer payments" },

//   { icon: FAProSolid.faPeople, text: "Build Community" },
// ]

const DisplaySection = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // const iconElements = displayIcons.map(({ icon, text }) => (
  //   <div className="flex-col w-20 text-center" key={text}>
  //     <FontAwesomeIcon className="text-4xl" icon={icon} />
  //     <p className="mt-2 text-xs">{text}</p>
  //   </div>
  // ))

  return (
    <div className="py-12 mt-12">
      <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto">
        {/* {isMounted && (
          <Suspense
            fallback={
              <div className="mt-4 flex h-80 w-[300px] items-center justify-center md:w-[800px]">
                <FontAwesomeIcon className="text-4xl animate-spin" icon={FAProSolid.faSpinnerThird} />
              </div>
            }>
            <LazyIframe src="https://www.youtube.com/embed/aWPJbuhwOxc?rel=0" title="Excalibur Explainer Video" />
          </Suspense>
        )} */}
      </div>

      <div className="flex flex-wrap items-start justify-center w-56 gap-16 mx-auto mt-16 justify-items-center md:w-full md:gap-16 "></div>
    </div>
  )
}

export default DisplaySection
