import WalletGenerator from '@/components/dashboard/WalletGenerator';
import React from 'react';

function SOl() {
  return (
    <main className="h-screen container mx-auto px-4 py-8">
      <h3 className="text-4xl font-semibold">Solana Wallets</h3>
      <WalletGenerator />
    </main>
  );
}

export default SOl;
