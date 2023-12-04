// import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { FAProSolid, FontAwesomeIcon } from "@excalibur/config/fontawesome"
import { IconDefinition } from "@fortawesome/free-brands-svg-icons"
// import { Keypair } from '@solana/web3.js';
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
// import { useAppState } from 'src/controllers/state/use-app-state';
// import { E2EID } from 'src/controllers/utils/e2e-ids';
// import LoginLogoutButton from "src/views/components/LoginLogoutButton"

// import { contentfulLoader } from "../../controllers/utils/image-loader"
// import { HexagonPFP } from "./HexagonPFP"

export function MobileNavbar() {


  const renderMobileLink1 = (
    href: string,
    icon: IconDefinition,
    text: string
  ) => {
    // const isCurrent = isCurrentLink(href)
    const isCurrent = false

    return (
      <Link passHref href={href} arial-label={text}>
        <div
          className={`group flex cursor-pointer flex-col items-center active:scale-95 active:text-skin-inverted ${
            isCurrent ? "text-buttonAccentHover  " : "text-white"
          } `}>
          <Link className="flex items-center gap-2" href={href}>
            <FontAwesomeIcon
              icon={icon}
              className={`flex w-10 justify-center text-xl group-hover:text-skin-muted  ${
                isCurrent ? "text-buttonAccentHover" : "text-white"
              }`}
            />
          </Link>
          <p className="mt-1 text-xs font-semibold"> {text}</p>
        </div>
      </Link>
    )
  }


  return (
    <>
      <div className="fixed bottom-0 z-40 flex flex-row items-center justify-between w-screen h-16 space-x-4 overflow-hidden border-t-2 border-buttonAccentHover md:hidden">
        <div className="flex w-full justify-evenly">
          {/* {renderMobileLink1(
            `/player/${playerMediaKey?.toString() ?? "demo"}`,
            FAProSolid.faPlayCircle,
            "Listen"
          )} */}
          {renderMobileLink1("/discover", FAProSolid.faCompass, "Discover")}
          {renderMobileLink1("/upload", FAProSolid.faCloudArrowUp, "Upload")}
          {/* {publicKey !== null ? renderMobileLink1('/wallet', FAProSolid.faWallet, 'Wallet') : null} */}
          {renderMobileLink1("/wallet", FAProSolid.faWallet, "Wallet")}
          {/* {renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, 'Creator')} */}
          {/* {currentCreatorHasUserAccount
            ? renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, "Creator")
            : null} */}
        </div>
      </div>
    </>
  )
}
