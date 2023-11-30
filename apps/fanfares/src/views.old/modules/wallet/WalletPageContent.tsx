import { useState } from 'react';
import { useAppState } from 'src/controllers/state/use-app-state';
import LoginLogoutButton from 'src/views/components/LoginLogoutButton';
import { WalletDepositSubpage } from './WalletDepositSubpage';
import { WalletHomeSubpage } from './WalletHomeSupage';
import { WalletTransferSubpage } from './WalletTransferSubpage';

export enum WalletSubPageState {
  home,
  transfer,
  deposit
}

export function WalletPageContent() {
  const { publicKey } = useAppState();
  const [walletSubPageState, setWalletSubPageState] = useState<WalletSubPageState>(WalletSubPageState.home);

  const gotoHome = () => {
    setWalletSubPageState(WalletSubPageState.home);
  };
  const gotoTransfer = () => {
    setWalletSubPageState(WalletSubPageState.transfer);
  };
  const gotoDeposit = () => {
    setWalletSubPageState(WalletSubPageState.deposit);
  };

  const renderLogin = () => {
    return (
      <div className="mt-auto flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="w-80 text-center">In order to use this app, you must be logged in with a Solana wallet.</p>
        <LoginLogoutButton />
      </div>
    );
  };
  const renderFromState = () => {
    if (!publicKey) {
      return renderLogin();
    } else {
      return renderContent();
    }
  };

  const renderContent = () => {
    switch (walletSubPageState) {
      case WalletSubPageState.home:
        return <WalletHomeSubpage gotoDeposit={gotoDeposit} gotoTransfer={gotoTransfer} />;

      case WalletSubPageState.transfer:
        return <WalletTransferSubpage gotoHome={gotoHome} />;

      case WalletSubPageState.deposit:
        return <WalletDepositSubpage gotoHome={gotoHome} />;
    }
  };

  return renderFromState();
}
