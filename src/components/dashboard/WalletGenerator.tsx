'use client';

import { Button } from '@/components/ui/button';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { useWalletStore } from '@/hooks/useWalletStore';
import { generateWalletFromMnemonic } from '@/utils/generateWalletFromMnemonic';
import { Input } from '../ui/input';
import MnemoicPhasphrase from './MnemoicPhasphrase';
import WalletGrid from './WalletGrid';

export default function WalletGenerator() {
  return (
    <>
      <WalletCta />
      <MnemoicPhasphrase />
      <WalletGrid />
    </>
  );
}

const WalletCta = () => {
  const { setMnemonicWords, wallets, setWallets } = useWalletStore();

  const [mnemonicInput, setMnemonicInput] = useState<string>('');

  const handleGenerateWallet = () => {
    let mnemonic = mnemonicInput.trim();
    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        toast.error('Invalid recovery phrase. Please try again.');
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }

    const words = mnemonic.split(' ');
    setMnemonicWords(words);

    const wallet = generateWalletFromMnemonic('501', mnemonic, wallets.length);
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      console.log(updatedWallets);
      setWallets(updatedWallets);
      localStorage.setItem(`wallets`, JSON.stringify(updatedWallets));
      localStorage.setItem('mnemonics', JSON.stringify(words));

      toast.success('Wallet generated successfully!');
    }
  };

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('wallets') || '');
    const words = JSON.parse(localStorage.getItem('mnemonics') || '');
    setWallets(items);
    setMnemonicWords(words);
  }, [setWallets, setMnemonicWords]);

  return (
    <>
      {wallets.length === 0 && (
        <>
          <div className="mb-8 flex justify-between items-center">
            <p className="text-lg">
              Manage your wallets and mnemonic phrases securely.
            </p>

            <Button
              onClick={handleGenerateWallet}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Generate New Wallet
            </Button>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">
              Enter Custom Mnemonic words
            </h3>
            <p className="text-slate-300">use space for separating words</p>
            <Input
              value={mnemonicInput}
              onChange={(e) => setMnemonicInput(e.target.value)}
              placeholder="Enter mnemonic"
            />
          </div>
        </>
      )}
    </>
  );
};
