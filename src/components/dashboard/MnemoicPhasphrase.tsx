import { useWalletStore } from '@/hooks/useWalletStore';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';

function MnemoicPhasphrase() {
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false);
  const { wallets, mnemonicWords } = useWalletStore();

  if (wallets.length === 0) return;
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}
      className="mt-8 group flex flex-col items-center gap-4 cursor-pointer rounded-lg border border-primary/10 p-8"
    >
      <div
        className="flex w-full justify-between items-center"
        onClick={() => setShowMnemonic(!showMnemonic)}
      >
        <h2 className="text-2xl md:text-3xl font-bold tracking-tighter">
          Your Secret Phrase
        </h2>
        <Button onClick={() => setShowMnemonic(!showMnemonic)} variant="ghost">
          {showMnemonic ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>

      {showMnemonic && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
          className="flex flex-col w-full items-center justify-center"
          onClick={() => copyToClipboard(mnemonicWords.join(' '))}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 justify-center w-full items-center mx-auto my-8"
          >
            {mnemonicWords.map((word, index) => (
              <p
                key={index}
                className="md:text-lg bg-foreground/5 hover:bg-foreground/10 transition-all duration-300 rounded-lg p-4"
              >
                {word}
              </p>
            ))}
          </motion.div>
          <div className="text-sm md:text-base text-primary/50 flex w-full gap-2 items-center group-hover:text-primary/80 transition-all duration-300">
            <Copy className="size-4" /> Click Anywhere To Copy
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default MnemoicPhasphrase;
