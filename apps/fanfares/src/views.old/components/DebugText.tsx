import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getConfig } from '@utils';
import { useState } from 'react';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';

enum AirdropState {
  idle = 'idle',
  airdropping = 'airdropping',
  done = 'done',
  error = 'error'
}

export function DebugText() {
  const { walletState, connection, network, publicKey } = useAppState();
  const { devMode } = getConfig();
  const [airdropState, setAirdropState] = useState<AirdropState>(AirdropState.idle);

  if (!devMode) return null;

  const airdrop = () => {
    if (airdropState === AirdropState.idle) {
      setAirdropState(AirdropState.airdropping);
      connection
        .requestAirdrop(publicKey, LAMPORTS_PER_SOL * 0.21)
        .then(() => {
          setAirdropState(AirdropState.done);
        })
        .catch(e => {
          console.log(e);
          setAirdropState(AirdropState.error);
        });
    }
  };

  const renderAirdropButton = () => {
    if (!publicKey) return;
    return (
      <div className="absolute top-0 left-0 z-50">
        <button id={E2EID.debugAirdropButton} className="btn" onClick={airdrop}>
          Airdrop
        </button>
        <p id={E2EID.debugAirdropState}>{airdropState}</p>
      </div>
    );
  };

  return (
    <>
      {renderAirdropButton()}
      <div className="absolute top-0 right-0 z-50 h-0 text-right text-white pointer-events-none opacity-20">
        <p id={E2EID.debugWalletState}>{`Wallet State: ${walletState.toString()}`}</p>
        <p id={E2EID.debugNetwork}>{`Network: ${network}`}</p>
        <p id={E2EID.debugNetwork}>{`RPC: ${connection.rpcEndpoint.toString()}`}</p>
      </div>
    </>
  );
}
