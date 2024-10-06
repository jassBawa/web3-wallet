'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateMnemonic, validateMnemonic } from 'bip39';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Wallet } from '@/types';
import { generateWalletFromMnemoic } from '@/utils/generateWalletFromMnemoic';
import MnemoicPhasphrase from './MnemoicPhasphrase';
import WalletGrid from './WalletGrid';

export default function WalletGenerator() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(
    Array(12).fill('')
  );
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

    const wallet = generateWalletFromMnemoic('60', mnemonic, wallets.length);
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      console.log(updatedWallets);
      setWallets(updatedWallets);
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      localStorage.setItem('mnemonics', JSON.stringify(words));
      // localStorage.setItem("paths", JSON.stringify(pathTypes));
      // setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      // setVisiblePhrases([...visiblePhrases, false]);
      toast.success('Wallet generated successfully!');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {wallets.length === 0 && (
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
      )}

      {mnemonicWords && wallets.length > 0 && (
        <MnemoicPhasphrase mnemonicWords={mnemonicWords} />
      )}

      {/* Display wallet pairs */}
      {wallets.length > 0 && <WalletGrid wallets={wallets} />}
    </main>
  );
}
