import { Wallet } from '@/types';
import { Keypair } from '@solana/web3.js';
import { mnemonicToSeedSync } from 'bip39';
import bs58 from 'bs58';
import { derivePath } from 'ed25519-hd-key';
import { toast } from 'sonner';
import nacl from 'tweetnacl';

// TODO ether integration
// import { ethers } from 'ethers';

export const generateWalletFromMnemonic = (
  pathType: string,
  mnemonic: string,
  accountIndex: number
): Wallet | null => {
  try {
    const seedBuffer = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
    const { key: derivedSeed } = derivePath(path, seedBuffer.toString('hex'));
    console.log(derivedSeed);

    let publicKeyEncoded: string;
    let privateKeyEncoded: string;

    if (pathType === '501') {
      // Solana
      const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
      const keypair = Keypair.fromSecretKey(secretKey);

      privateKeyEncoded = bs58.encode(secretKey);
      publicKeyEncoded = keypair.publicKey.toBase58();
    } else {
      toast.error('Unsupported path type.');
      return null;
    }

    return {
      publicKey: publicKeyEncoded,
      privateKey: privateKeyEncoded,
      mnemonic,
      path,
    };
  } catch (error) {
    toast.error('Failed to generate wallet. Please try again.');
    console.log(error);
    return null;
  }
};
