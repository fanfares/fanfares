import * as test from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, faQuestionCircle, faCloudArrowUp, faCompass, faWallet } from '@fortawesome/pro-solid-svg-icons';

// import { Keypair } from '@solana/web3.js';
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import TestState from "./TestState"
import { E2E } from "../controllers/testing/e2e"
// import { useAppState } from 'src/controllers/state/use-app-state';
// import { E2EID } from 'src/controllers/utils/e2e-ids';
// import LoginLogoutButton from "src/views/components/LoginLogoutButton"

// import { contentfulLoader } from "../../controllers/utils/image-loader"
// import { HexagonPFP } from "./HexagonPFP"

export function Navbar() {
  // const [showMobileMenu, setShowMobileMenu] = useState(false);

  // const { asPath: currentPath } = useRouter()

  // const [sidebarOpen, setSidebarOpen] = useState(true);

  // const { balance, publicKey, currentCreatorHasUserAccount, playerMediaKey } =
  //   useAppState()

  // const getCreatorPlug = () => {
  //   return `/creator/${publicKey?.toString() ?? "owner"}`
  // }

  // const needHelp = () => {
  //   // setShowMobileMenu(false);
  //   router.push(
  //     `/support?startingTab=ContactUs&tick=${Keypair.generate().publicKey.toString()}`
  //   )
  // }

  // const toggleMobileMenu = () => {
  //   setShowMobileMenu(!showMobileMenu);
  // };

  // const renderMobileLink = (href: string, icon: IconDefinition, text: string) => {
  //   const isCurrent = isCurrentLink(href);

  //   return (
  //     <Link
  //       passHref
  //       href={href}
  //       arial-label={text}
  //       onClick={() => {
  //         setShowMobileMenu(false);
  //       }}>
  //       <div
  //         className={`group mx-auto mb-2 w-40 cursor-pointer rounded-lg p-2 hover:text-skin-muted  active:scale-95  active:text-skin-inverted ${
  //           isCurrent ? 'text-buttonAccentHover  ' : 'text-white'
  //         } flex items-center space-x-4`}>
  //         <a className="flex items-center gap-2" href={href}>
  //           <FontAwesomeIcon
  //             icon={icon}
  //             className={`flex w-8 justify-center text-xl group-hover:text-skin-muted  ${
  //               isCurrent ? 'text-buttonAccentHover' : 'text-white'
  //             }`}
  //           />
  //           <span>{text}</span>
  //         </a>
  //       </div>
  //     </Link>
  //   );
  // };

  // const renderMobileNavMenu = () => {
  //   return (
  //     <div className="fixed bottom-0 top-0 z-40 h-screen w-screen touch-none overflow-hidden bg-black/80 backdrop-blur-[2px]">
  //       <div className="flex items-center justify-center mx-auto mt-2 bg-transparent rounded w-fit">
  //         <Image
  //           loader={contentfulLoader}
  //           className=""
  //           src={'/assets/excalibur.png'}
  //           alt=""
  //           layout="intrinsic"
  //           width={100}
  //           height={100}
  //         />
  //       </div>
  //       <div>
  //         <div className="relative top-0 flex justify-center w-full mx-auto ">
  //           <div className="">
  //             <HexagonPFP />
  //           </div>
  //           <div className="ml-2 flex w-[120px] flex-col items-start justify-center">
  //             <p id={E2EID.navbarBalance}>{balance === null ? '' : balance.toFixed(5)}</p>
  //             <p className="text-sm font-thin">{balance === null ? 'Not connected' : 'SOL'}</p>
  //           </div>
  //         </div>
  //         <button onClick={toggleMobileMenu}>
  //           <FontAwesomeIcon
  //             icon={FAProSolid.faClose}
  //             className="absolute flex justify-center w-8 text-3xl bg-black bottom-24 right-10 text-skin-muted"
  //           />
  //         </button>
  //       </div>
  //       <div className="flex justify-center mx-auto mt-4" onClick={() => setShowMobileMenu(false)}>
  //         <LoginLogoutButton />
  //       </div>
  //       <p onClick={needHelp} className="flex flex-col mt-2 text-sm font-black text-center">
  //         <span id="e2e-balance-status" className="font-thin underline cursor-pointer text-skin-muted">
  //           Need Help?
  //         </span>
  //       </p>
  //       <div className="absolute w-full px-4 text-xs -translate-x-1/2 bottom-32 left-1/2">
  //         <div className="columns-2 ">
  //           {renderMobileLink('/discover', FAProSolid.faCompass, 'Discover')}
  //           {/* {testMode ? renderMobileLink('/discover', FAProSolid.faCompass, 'Discover') : null} */}
  //           {renderMobileLink('/upload', FAProSolid.faCloudArrowUp, 'Upload Audio')}
  //           {renderMobileLink(`/player/${playerMediaKey?.toString() ?? 'demo'}`, FAProSolid.faPodcast, 'Player')}
  //           {currentCreatorHasUserAccount ? renderMobileLink(getCreatorPlug(), FAProSolid.faUser, 'Creator') : null}
  //           {publicKey !== null ? renderMobileLink('/wallet', FAProSolid.faWallet, 'Wallet') : null}
  //           {renderMobileLink('/support/', FAProSolid.faQuestionCircle, 'Support')}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  // const renderMobileNav = () => {
  //   return (
  //     <div className="relative flex flex-row items-center justify-between w-screen h-20 p-4 mb-4 space-x-4 overflow-hidden bg-transparent/40 backdrop-blur-md">
  //       <div
  //         className={` ${
  //           showMobileMenu ? 'hidden' : ''
  //         } flex w-fit items-center justify-center rounded bg-transparent`}>
  //         <Link href="/">
  //           <Image
  //             loader={contentfulLoader}
  //             className=""
  //             src={'/assets/excalibur.png'}
  //             alt=""
  //             layout="intrinsic"
  //             width={75}
  //             height={75}
  //           />
  //         </Link>
  //       </div>
  //       <button className="flex flex-col" onClick={toggleMobileMenu}>
  //         {' '}
  //         <FontAwesomeIcon icon={FAProSolid.faBars} className="flex justify-center w-8 text-2xl text-skin-muted" />
  //         <span className="text-xs font-thin uppercase">Menu</span>
  //       </button>
  //     </div>
  //   );
  // };

  // const isCurrentLink = (href: string) => {
  //   return (
  //     (currentPath === "/" && href === "/") ||
  //     (href !== "/" && currentPath.includes(href.split("/")[1]))
  //   )
  // }

  const renderDesktopNavLink = (
    href: string,
    title: string,
    icon: IconDefinition,
    id?: string
  ) => {
    // const isCurrent = isCurrentLink(href)
    const isCurrent = false

    return (
      <Link className="group" href={href}>
        <div
          id={id}
          className={`desktop-sidebar-item  group mx-auto md:w-28 lg:w-48 cursor-pointer rounded-lg p-2 py-3 hover:text-buttonMuted  active:scale-95 active:text-skin-inverted ${
            isCurrent ? "text-buttonAccentHover" : "text-white"
          } flex items-center space-x-4`}>
          <div className="flex items-center gap-2 group-hover:text-buttonMuted md:mx-auto lg:mx-0">
            <FontAwesomeIcon
              icon={icon}
              className={`flex w-8 justify-center text-xl group-hover:text-buttonMuted  ${
                isCurrent ? "text-buttonAccentHover" : "text-white"
              }`}
            />
            <span className="md:hidden lg:block">{title}</span>
          </div>
        </div>
      </Link>
    )
  }

  const renderDesktopSideBar = () => {
    return (
      <div
        className={`desktop-sidebar fixed z-40 hidden h-full flex-col px-4 transition-all duration-100 ease-linear md:flex md:mx-auto `}>
        <div className="flex items-center justify-center mx-auto bg-transparent rounded w-fit">
          <Link href="/">
            <Image
              // loader={contentfulLoader}
              className="cursor-pointer"
              src={"/assets/excalibur.png"}
              alt=""
              layout="intrinsic"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <div className="flex flex-col mx-auto mt-5 mb-20 space-y-4">
          {renderDesktopNavLink("/discover", "Discover", faCompass)}
          {renderDesktopNavLink(
            "/test",
            "Upload Audio",
            faCloudArrowUp,
            "click-to-upload"
          )}
          {/* {renderDesktopNavLink(
            `/player/${playerMediaKey?.toString() ?? "demo"}`,
            "Player",
            FAProSolid.faPodcast
          )}
          {publicKey !== null
            ? renderDesktopNavLink("/wallet", "Wallet", FAProSolid.faWallet)
            : null}
          {currentCreatorHasUserAccount
            ? renderDesktopNavLink(
                getCreatorPlug(),
                "Creator",
                FAProSolid.faUser
              )
            : null} */}
          {renderDesktopNavLink(
            "/support/",
            "Support",
            faQuestionCircle
          )}
        </div>

        {/* <LoginLogoutButton /> */}

        <div className="mt-auto left-5">
          {/* <HexagonPFP /> */}
          <p className="flex flex-col mt-2 text-sm font-black">
            {/* <span id={E2EID.navbarBalance}> */}
            {/* <span >
              {balance === null ? "" : balance.toFixed(5)}
            </span>
            <span id="e2e-balance-status" className="font-thin text-skin-muted">
              {balance === null ? "No wallet connected" : "SOL"}
            </span> */}
          </p>
        </div>
        {/* <div className={`static left-5 h-10 ${publicKey ? "mt-3" : ""}`}> */}
        <div className={`static left-5 h-10 `}>
          <p
            // onClick={needHelp}
            className="flex flex-col mt-2 text-sm font-black">
            <span
              id="e2e-balance-status"
              className="font-thin underline cursor-pointer text-skin-muted">
              Need Help?
            </span>
          </p>
        </div>
      </div>
    )
  }

  const renderMobileLink1 = (
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
        className={`group flex cursor-pointer flex-col items-center active:scale-95 active:text-skin-inverted gap-2${
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

  const renderMobileNav1 = () => {
    return (
      <div className="fixed bottom-0 z-40 flex flex-row items-center justify-between w-screen h-16 space-x-4 overflow-hidden border-t-2 border-buttonAccentHover md:hidden">
        <div className="flex w-full justify-evenly">
          {/* {renderMobileLink1(
            `/player/${playerMediaKey?.toString() ?? "demo"}`,
            FAProSolid.faPlayCircle,
            "Listen"
          )} */}
          {renderMobileLink1("/discover", faCompass, "Discover")}
          {renderMobileLink1("/upload", faCloudArrowUp, "Upload")}
          {/* {publicKey !== null ? renderMobileLink1('/wallet', FAProSolid.faWallet, 'Wallet') : null} */}
          {renderMobileLink1("/wallet", faWallet, "Wallet")}
          {/* {renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, 'Creator')} */}
          {/* {currentCreatorHasUserAccount
            ? renderMobileLink1(getCreatorPlug(), FAProSolid.faUser, "Creator")
            : null} */}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* <div className="z-40 md:hidden">{renderMobileNav1()}</div>
      <div className="z-40 hidden mobileNavbar h-fit drop-shadow-md md:hidden">
        {showMobileMenu && <Modal isOpen={showMobileMenu}>{renderMobileNavMenu()}</Modal>}
        {renderMobileNav()}
      </div> */}
      {renderMobileNav1()}
      {renderDesktopSideBar()}
    </>
  )
}
