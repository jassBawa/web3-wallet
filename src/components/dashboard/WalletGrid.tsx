import { motion } from 'framer-motion';
import { Grid2X2, List } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { useWalletStore } from '@/hooks/useWalletStore';
import { Wallet } from '@/types';
import { generateWalletFromMnemonic } from '@/utils/generateWalletFromMnemonic';
import { Button } from '../ui/button';
import DeleteAllWalletsModal from './DeleteAllWalletsModal';
import WalletCard from './WalletCard';

const WalletGrid = () => {
  const [gridView, setGridView] = useState<boolean>(false);
  const { mnemonicWords, wallets, setWallets } = useWalletStore();

  const handleAddWallet = () => {
    if (!mnemonicWords) {
      toast.error('No mnemonic found. Please generate a wallet first.');
      return;
    }

    const wallet = generateWalletFromMnemonic(
      '60',
      mnemonicWords.join(' '),
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem('wallets', JSON.stringify(updatedWallets));
      toast.success('Wallet generated successfully!');
    }
  };

  if (wallets.length === 0) return;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3,
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="flex flex-col gap-8 mt-6"
    >
      <div className="flex md:flex-row flex-col justify-between w-full gap-4 md:items-center">
        <div className="flex gap-2">
          {wallets.length > 1 && (
            <Button
              variant={'ghost'}
              onClick={() => setGridView(!gridView)}
              className="hidden md:block"
            >
              {gridView ? <Grid2X2 /> : <List />}
            </Button>
          )}
          <Button onClick={() => handleAddWallet()}>Add Wallet</Button>
          <DeleteAllWalletsModal />
        </div>
      </div>
      <div
        className={`grid gap-6 grid-cols-1 col-span-1  ${
          gridView ? 'md:grid-cols-2 lg:grid-cols-3' : ''
        }`}
      >
        {wallets.map((wallet: Wallet, index: number) => (
          <WalletCard key={index} index={index} wallet={wallet} />
        ))}
      </div>
    </motion.div>
  );
};
export default WalletGrid;
