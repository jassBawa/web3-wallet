import { useWalletStore } from '@/hooks/useWalletStore';
import { Wallet } from '@/types';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { Eye, EyeOff, Trash } from 'lucide-react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useState } from 'react';

type Props = {
  index: number;
  wallet: Wallet;
};

const WalletCard = ({ index, wallet }: Props) => {
  const [isVisible, setIsVisisble] = useState<boolean>(false);
  const { wallets, setWallets } = useWalletStore();
  const handleDeleteWallet = (index: number) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);

    setWallets(updatedWallets);
    localStorage.setItem('wallets', JSON.stringify(updatedWallets));

    toast.success('Wallet deleted successfully!');
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.3 + index * 0.1,
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="flex flex-col rounded-2xl border border-primary/10"
    >
      <div className="flex justify-between px-8 py-6">
        <h3 className="font-bold text-2xl md:text-3xl tracking-tighter ">
          Wallet {index + 1}
        </h3>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" className="flex gap-2 items-center">
              <Trash className="size-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete all wallets?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                wallets and keys from local storage.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDeleteWallet(index)}
                className="text-destructive"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-col gap-8 px-8 py-4 rounded-2xl bg-secondary/50">
        <div
          className="flex flex-col w-full gap-2"
          onClick={() => copyToClipboard(wallet.publicKey)}
        >
          <span className="text-lg md:text-xl font-bold tracking-tighter">
            Public Key
          </span>
          <p className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate">
            {wallet.publicKey}
          </p>
        </div>
        <div className="flex flex-col w-full gap-2">
          <span className="text-lg md:text-xl font-bold tracking-tighter">
            Private Key
          </span>
          <div className="flex justify-between w-full items-center gap-2">
            <p
              onClick={() => copyToClipboard(wallet.privateKey)}
              className="text-primary/80 font-medium cursor-pointer hover:text-primary transition-all duration-300 truncate"
            >
              {isVisible
                ? wallet.privateKey
                : '•'.repeat(wallet.mnemonic.length)}
            </p>
            <Button
              variant="ghost"
              onClick={() => setIsVisisble((prev) => !prev)}
            >
              {isVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WalletCard;
