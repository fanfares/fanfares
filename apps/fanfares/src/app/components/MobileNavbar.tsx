import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faQuestionCircle, faCloudArrowUp, faCompass, faWallet } from '@fortawesome/pro-solid-svg-icons';
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
  const renderMobileLink = (
    href: string,
    icon: IconDefinition,
    text: string
  ) => {
    // const isCurrent = isCurrentLink(href)
    const isCurrent = false

    return (
      <Link
        passHref
        href={href}
        arial-label={text}
        className={`group flex cursor-pointer flex-col items-center active:scale-95 active:text-skin-inverted ${
          isCurrent ? "text-buttonAccentHover  " : "text-white"
        } `}>
        <FontAwesomeIcon
          icon={icon}
          className={`flex w-10 justify-center text-xl group-hover:text-skin-muted  ${
            isCurrent ? "text-buttonAccentHover" : "text-white"
          }`}
        />

        <p className="mt-1 text-xs font-semibold"> {text}</p>
      </Link>
    )
  }

  return (
    <>
      <div className="fixed bottom-0 z-40 flex flex-row items-center justify-between w-screen h-16 space-x-4 overflow-hidden border-t-2 border-buttonAccentHover md:hidden">
        <div className="flex w-full justify-evenly">
          {/* {renderMobileLink(
            `/player/${playerMediaKey?.toString() ?? "demo"}`,
            FAProSolid.faPlayCircle,
            "Listen"
          )} */}
          {renderMobileLink("/discover", faCompass, "Discover")}
          {renderMobileLink("/upload", faCloudArrowUp, "Upload")}
          {/* {publicKey !== null ? renderMobileLink('/wallet', FAProSolid.faWallet, 'Wallet') : null} */}
          {renderMobileLink("/wallet", faWallet, "Wallet")}
          {/* {renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, 'Creator')} */}
          {/* {currentCreatorHasUserAccount
            ? renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, "Creator")
            : null} */}
        </div>
      </div>
    </>
  )
}
