import Popover from '@components/ToolTip';
import { getConfig } from '@utils';
import { useEffect, useState } from 'react';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { TextInput } from 'src/views/components/TextInput';

export function MediaParameterForm() {
  const { currentCreatorAccount, currencySliceGetCurrencyString } = useAppState();
  const [btcAddress, setBtcAddress] = useState<string>('');
  const [solPrice, setSolPrice] = useState<number>(getConfig().defaultMinDonation);

  useEffect(() => {
    if (currentCreatorAccount?.btcAddress) {
      setBtcAddress(currentCreatorAccount.btcAddress);
    }
  }, [currentCreatorAccount, setBtcAddress]); //eslint-disable-line

  const handleMinPrice = event => {
    setSolPrice(event.target.value);
  };

  const handleBtcAdress = event => {
    setBtcAddress(event.target.value);
  };

  return (
    <div className="w-full mt-8">
      <p className="mt-4 mb-2 text-2xl">Parameters</p>
      <div className="flex flex-col items-start justify-start w-full gap-2 mx-auto md:items-center md:flex-row">
        <div className="flex flex-col items-center justify-center w-full h-20 text-center btc-adress-wrapper md:w-80">
          <label className="w-full p-2 text-sm font-bold text-white rounded-lg md:w-fit md:max-w-sm bg-skin-fill">
            {' '}
            Bitcoin Donation Wallet
            <span className="text-skin-muted">( Optional ) </span>
            <Popover
              className="w-40 text-xs text-center"
              text="Adding an optional Bitcoin wallet shows your address when your audience clicks 'Contribute'. This is so they can manually send you BTC if they prefer!"
            />{' '}
            <TextInput.Input
              onChange={handleBtcAdress}
              id={E2EID.uploadBTCInput}
              autoComplete="off"
              className="left-[36px] mt-4 block w-full min-w-[300px] border-b-2 border-buttonAccent bg-transparent text-center text-sm font-thin  outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-muted/40 md:w-fit"
              placeholder="Enter Creator Bitcoin Wallet Address"
              value={btcAddress}
              // requiredMessage="Please enter the creator's Solana wallet"
              name="btcWallet"
              maxLength={48} // 44 seems to be the max
            />
          </label>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-20 text-center btc-sol-nft-price-wrapper md:w-80">
          <label className="w-full p-2 text-sm font-bold text-white rounded-lg bg-skin-fill">
            {' '}
            NFT Price in SOL
            <span className="text-skin-muted"> (~{currencySliceGetCurrencyString(solPrice ?? 0)}) </span>
            <Popover className="w-40 text-xs text-center " text="Set the NFT minting price in solana (SOL)." />{' '}
            <TextInput.Input
              onChange={handleMinPrice}
              id={E2EID.uploadSolPriceInput}
              autoComplete="off"
              className="left-[36px] mt-4 block w-full border-b-2 border-buttonAccent bg-transparent text-center text-sm  font-thin outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-inverted"
              placeholder="Minimum Donation(sol)"
              value={solPrice}
              // requiredMessage="Please enter the creator's Solana wallet"
              name="mintPrice"
              maxLength={48} // 44 seems to be the max
              type="number"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
