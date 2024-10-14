'use client';
import LaunchpadForm from '@/components/launchpad/LaunchpadForm';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function Launchpad() {
  return (
    <main className="h-screen container mx-auto px-4 py-8">
      <h3 className="text-4xl font-semibold">Solana launchpad</h3>
      <div className="mt-4">
        <WalletMultiButton />
        <LaunchpadForm />
      </div>
    </main>
  );
}

export default Launchpad;
