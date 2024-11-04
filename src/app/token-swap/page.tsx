'use client';
import TokenSwap from '@/components/swap/TokenSwap';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function TokenSwapPage() {
  return (
    <main className=" container mx-auto px-4 py-8">
      <h3 className="text-4xl font-semibold">Solana launchpad</h3>
      <div className="mt-4">
        <WalletMultiButton />
        <TokenSwap />
      </div>
    </main>
  );
}

export default TokenSwapPage;
