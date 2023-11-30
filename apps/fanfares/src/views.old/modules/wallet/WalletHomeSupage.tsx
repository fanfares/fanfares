import Button from '@components/Button';
import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { useAppState } from 'src/controllers/state/use-app-state';
import { Text } from 'src/views/components/Text';
import WalletNFTSubpage from './WalletNFTSubpage';

export interface WalletHomeSubpageProps {
  gotoDeposit: () => void;
  gotoTransfer: () => void;
}

export function WalletHomeSubpage(props: WalletHomeSubpageProps) {
  const { currencySliceGetCurrencyString } = useAppState();
  const { gotoDeposit, gotoTransfer } = props;
  const { balance } = useAppState();

  const { assetSliceReset } = useAppState();

  return (
    <>
      <div className="relative flex w-full flex-col items-center">
        <h1 className="font-font1 mt-12 text-center text-xl font-black uppercase text-gray-100 md:mt-4 md:text-start md:text-4xl">
          EXCALIBUR NFTs
        </h1>
        <div className="sticky top-8 mt-4 flex w-full flex-col items-center">
          <div className="my-1 grid w-64 cursor-default grid-cols-12 grid-rows-2 content-center items-center justify-between space-x-1 rounded-md bg-buttonDefault p-2 drop-shadow-md transition-all ease-linear ">
            <div className="col-span-1 row-span-2 mx-2 mr-4 h-10 w-10 content-center items-center justify-center ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Solana Token Image"
                className="rounded-full"
                src="https://cdn.jsdelivr.net/gh/solana-labs/token-list@main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png"
              />
            </div>
            <Text className="col-start-4 row-start-1 flex w-fit content-start font-bold">SOL</Text>
            <Text
              id="token-balance"
              className="col-span-7 col-start-4 row-start-2 flex w-fit content-start text-sm font-thin">
              {balance.toFixed(5)} SOL
            </Text>
            <Text className="col-span-6 col-start-7 w-full text-right text-skin-muted">
              {currencySliceGetCurrencyString(balance)}
            </Text>
          </div>

          <div className="my-1 mt-5 flex justify-center gap-2">
            {/* <button onClick={gotoDeposit} className="w-20 btn">
              Deposit
            </button> */}
            <Button text="Deposit" buttonType="default" className="w-20" onClick={gotoDeposit} />
            <Button onClick={gotoTransfer} className="w-20" buttonType="default" text="Send" />
            <Button
              onClick={assetSliceReset}
              className="w-20"
              buttonType="default"
              icon={<FontAwesomeIcon icon={FAProSolid.faArrowsRotate} />}
            />
          </div>
          {WalletNFTSubpage()}
        </div>
      </div>
    </>
  );
}
