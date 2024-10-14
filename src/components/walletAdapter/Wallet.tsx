'use client';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { FC } from 'react';

import { AirdropCard } from './AirdropCard';
import { SendSolCard } from './SendSolCard';
import { SignMessageCard } from './SignMessageCard';

const Wallet: FC = () => {
  return (
    <div className="">
      <WalletMultiButton />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <AirdropCard />
        <SendSolCard />
        <SignMessageCard />
      </div>
    </div>
  );
};

export default Wallet;
