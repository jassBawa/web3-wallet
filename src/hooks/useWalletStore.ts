'use client';
import { Wallet } from '@/types';
import { generateWalletFromMnemonic } from '@/utils/generateWalletFromMnemonic';
import { toast } from 'sonner';
import { create } from 'zustand';

// Define the store type
interface WalletStore {
  mnemonicWords: string[]; // Mnemonic words as an array
  wallets: Wallet[];

  setMnemonicWords: (mnemonic: string[]) => void;
  setWallets: (wallets: Wallet[]) => void;

  generateWallet: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
  mnemonicWords: [],
  wallets: [],

  setMnemonicWords: (mnemonic: string[]) => set({ mnemonicWords: mnemonic }),
  setWallets: (wallets: Wallet[]) => {
    set({ wallets });
    localStorage.setItem('wallets', JSON.stringify(wallets));
  },
  generateWallet: () => {
    const { mnemonicWords, wallets } = get();

    const wallet = generateWalletFromMnemonic(
      '501',
      mnemonicWords.join(' '),
      wallets.length
    );

    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      set({
        wallets: updatedWallets,
      });

      // Update localStorage
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      toast.success('Wallet generated successfully!');
    }
  },
}));
