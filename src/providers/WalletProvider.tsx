'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const network = WalletAdapterNetwork.Devnet;

  const endpoint = useMemo(
    () => process.env.NEXT_PUBLIC_SOLANA_RPC_ENDPOINT ?? clusterApiUrl(network),
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

export default WalletProvider;
