import { PublicKey } from '@solana/web3.js';
import { useEffect } from 'react';
import { AssetSliceState } from 'src/controllers/state/create-asset-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import { NftTile } from './NftTile';

export function WalletNFTSubpage() {
  const {
    publicKey,
    playerMediaKey,
    playerSetMedia,
    playerIsPlaying,
    playerTogglePlaying,
    playerShowGlobalPlayer,
    playerIsLoading,
    assetSliceMetadatas,
    assetSliceErrorMessage,
    assetSliceFetch,

    assetSliceState
  } = useAppState();

  useEffect(() => {
    if (publicKey && assetSliceState === AssetSliceState.idle) {
      assetSliceFetch();
    }
  }, [publicKey, assetSliceState, assetSliceFetch]);

  const onPlayPause = (key: PublicKey) => {
    if (playerIsLoading) return;
    if (key && playerMediaKey && key.equals(playerMediaKey)) {
      playerTogglePlaying();
    } else {
      playerSetMedia(key.toString());
      playerShowGlobalPlayer();
      if (!playerIsPlaying) {
        playerTogglePlaying();
      }
    }
  };

  if (assetSliceState !== AssetSliceState.done) {
    return (
      <div className="mt-40 flex w-full items-center justify-center">
        <p>{assetSliceState}</p>
        <p> </p>
        <p>{assetSliceErrorMessage}</p>
      </div>
    );
  }

  if (assetSliceMetadatas.length === 0) {
    return (
      <div className="mt-40 flex w-full items-center justify-center">
        <p>You have no Excalibur NFTs</p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto mt-8 flex h-full w-full flex-col items-center justify-center">
        <div className="mb-20 max-h-[80vh] overflow-scroll">
          <div className="mb-20 flex h-full w-full flex-wrap pb-20 ">
            {' '}
            {assetSliceMetadatas.map(nft => {
              return (
                <>
                  {' '}
                  <NftTile
                    key={nft.key.toString() + '-NFTTile'}
                    nft={nft}
                    isLoading={playerIsLoading}
                    currentMediaKey={playerMediaKey}
                    isCurrentlyPlaying={playerIsPlaying}
                    onPlayPause={onPlayPause}
                  />
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default WalletNFTSubpage;
