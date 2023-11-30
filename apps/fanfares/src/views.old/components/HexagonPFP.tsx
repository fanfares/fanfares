// import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Image from "next/image"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
// import { EditARCreatorState } from 'src/controllers/state/create-edit-ar-creator-slice';
// import { useAppState } from 'src/controllers/state/use-app-state';
// import { E2EID } from 'src/controllers/utils/e2e-ids';
// import { getConfig } from 'src/controllers/utils/get-config';
// import { contentfulLoader } from '../../controllers/utils/image-loader';

export function HexagonPFP() {
  // const { publicKey, balance, currentCreatorThumbnailUrl, editARCreatorState, currentCreatorHasUserAccount } =
  //   useAppState();
  // const { setVisible, visible } = useWalletModal();
  // const { defaultCreatorThumbnailUrl } = getConfig();

  // const [src, setSrc] = useState<string>(defaultCreatorThumbnailUrl);

  //TODO set this in the state
  // useEffect(() => {
  //   if (currentCreatorThumbnailUrl && editARCreatorState === EditARCreatorState.done) {
  //     setSrc(currentCreatorThumbnailUrl + '?t=' + Date.now().toString());
  //   } else {
  //     setSrc(defaultCreatorThumbnailUrl);
  //   }
  //   // eslint-disable-next-line
  // }, [setSrc, currentCreatorThumbnailUrl, editARCreatorState, defaultCreatorThumbnailUrl]);

  // const onHexClick = async () => {
  //   if (publicKey) {
  //     await navigator.clipboard.writeText(publicKey.toString());
  //     toast.success('Address Copied!', {
  //       position: 'bottom-left',
  //       autoClose: 2000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined
  //     });
  //   } else {
  //     if (!visible) {
  //       setVisible(true);
  //     }
  //   }
  // };

  return (
    <>
      {/* <div
        id="e2e-hexagon"
        onClick={onHexClick}
        className="flex items-center justify-center border-2 cursor-pointer hex"
      >
        <Image
          loader={contentfulLoader}
          className={`img mr-auto`}
          id="profilePicture"
          src={src}
          alt={publicKey?.toString() ?? 'User not logged in'}
          layout={'fill'}
        />
        <p id={E2EID.userStateAddress} className="hidden">
          {publicKey?.toString() ?? 'Not Connected'}
        </p>
        <p id={E2EID.userStateBalance} className="hidden">
          {balance ?? 'No Solana'}
        </p>
        <p id={E2EID.userStateHasAccount} className="hidden">
          {currentCreatorHasUserAccount}
        </p>
      </div> */}
    </>
  )
}
