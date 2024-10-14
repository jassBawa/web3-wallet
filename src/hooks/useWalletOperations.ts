import { ed25519 } from '@noble/curves/ed25519';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import bs58 from 'bs58';
import { useState } from 'react';
import { toast } from 'sonner';

export const useWalletOperations = () => {
  const { publicKey, signMessage, sendTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);

  const { connection } = useConnection();

  const requestAirdrop = async (amount: number) => {
    if (!publicKey) {
      toast.error('Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      console.log('runnign');
      const airdropSignature = await connection.requestAirdrop(
        publicKey,
        amount * LAMPORTS_PER_SOL
      );
      await connection.confirmTransaction(airdropSignature);
      toast.success('Airdrop successful');
    } catch (error) {
      toast.error(`Airdrop failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSol = async (recipient: string, amount: number) => {
    if (!publicKey || !sendTransaction) {
      toast.error('Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(recipient),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      await sendTransaction(transaction, connection);
      toast.success('Transaction successful');
    } catch (error) {
      toast.error(`Transaction failed: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const signMessageOperation = async () => {
    if (!publicKey || !signMessage) {
      toast.error('Wallet not connected');
      return;
    }

    setIsLoading(true);
    try {
      const message = `Hello, ${publicKey.toBase58()}! This is a test message.`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      const isValid = ed25519.verify(
        signature,
        encodedMessage,
        publicKey.toBytes()
      );
      if (!isValid) {
        throw new Error('Message signature failed');
      }

      toast.success('Message signed: ' + bs58.encode(signature));
      return signature;
    } catch (error) {
      toast.error(`Error: ${(error as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestAirdrop,
    sendSol,
    signMessageOperation,
    isLoading,
  };
};
