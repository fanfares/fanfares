import { FC, ReactNode, useEffect, useMemo } from 'react';

import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { useWalletModal, WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { LedgerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { getConfig } from '@utils';
import { useAppState } from 'src/controllers/state/use-app-state';
import { getTestAdapter } from 'src/controllers/utils/test-wallet/get-test-adapter';

export const ExcaliburSolanaWalletAdapter: FC<{ children: ReactNode }> = ({ children }) => {
  const { network, connection } = useAppState();
  const testMode = getConfig().testMode || getConfig().devMode;

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      ...getTestAdapter(testMode, connection),
      // new PhantomWalletAdapter(),
      // new BackpackWalletAdapter(),
      new LedgerWalletAdapter()
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={connection.rpcEndpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const SolanaWalletInterceptor = () => {
  const walletContext = useWallet();
  const { connectWallet, disconnectWallet, connectionPopupOpen, setDetectedWallets, currencySliceInit } = useAppState();
  const { setVisible } = useWalletModal();

  useEffect(() => {
    currencySliceInit();
  }, [currencySliceInit]);

  useEffect(() => {
    setVisible(connectionPopupOpen !== 0);
    // eslint-disable-next-line
  }, [connectionPopupOpen, setVisible]);

  useEffect(() => {
    setDetectedWallets(walletContext);
    setVisible(connectionPopupOpen !== 0);
    // eslint-disable-next-line
  }, [walletContext.wallets]);

  useEffect(() => {
    if (walletContext.publicKey) {
      connectWallet(walletContext);
    } else {
      disconnectWallet();
    }
    // eslint-disable-next-line
  }, [walletContext.publicKey]);

  return null;
};
