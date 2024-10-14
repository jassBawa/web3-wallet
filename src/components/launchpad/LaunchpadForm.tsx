'use client';

import * as z from 'zod';

import { Input } from '@/components/ui/input';
// @ts-ignore
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ExtensionType,
  LENGTH_SIZE,
  MINT_SIZE,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
  TYPE_SIZE,
  createAssociatedTokenAccountInstruction,
  createInitializeMetadataPointerInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAssociatedTokenAddressSync,
  getMintLen,
} from '@solana/spl-token';
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Coins } from 'lucide-react';
import { useState } from 'react';

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Token name is required')
    .max(50, 'Token name must be 50 characters or less'),
  symbol: z
    .string()
    .min(1, 'Token symbol is required')
    .max(10, 'Token symbol must be 10 characters or less'),
  imageUrl: z.string().url('Please enter a valid URL for the image'),
  initialSupply: z
    .string()
    .min(1, 'Initial supply is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Initial supply must be a positive number',
    }),
});

type FormValues = z.infer<typeof formSchema>;

function LaunchpadForm() {
  const [openModal, setOpenModal] = useState(false);
  const wallet = useWallet();
  const { connection } = useConnection();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      symbol: '',
      imageUrl: '',
      initialSupply: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    // This is a placeholder for actual token generation logic
    // In a real application, you would integrate with Solana's API here
    console.log('Generating token with:', data);

    if (!wallet.publicKey) return;

    const mintKeypair = Keypair.generate();
    const payer = wallet.publicKey;

    // meta-data
    const metadata = {
      mint: mintKeypair.publicKey,
      name: data.name,
      symbol: data.symbol,
      uri: data.imageUrl,
      additionalMetadata: [],
    };

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataLen
    );

    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: mintKeypair.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      }),
      createInitializeMetadataPointerInstruction(
        mintKeypair.publicKey,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeMintInstruction(
        mintKeypair.publicKey,
        9,
        wallet.publicKey,
        null,
        TOKEN_2022_PROGRAM_ID
      ),
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mintKeypair.publicKey,
        metadata: mintKeypair.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.uri,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
      })
    );

    transaction.feePayer = wallet.publicKey;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    transaction.partialSign(mintKeypair);

    await wallet.sendTransaction(transaction, connection);

    console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
    const associatedToken = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      wallet.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    console.log(associatedToken.toBase58());

    const transaction2 = new Transaction().add(
      createAssociatedTokenAccountInstruction(
        wallet.publicKey,
        associatedToken,
        wallet.publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction2, connection);

    const transaction3 = new Transaction().add(
      createMintToInstruction(
        mintKeypair.publicKey,
        associatedToken,
        wallet.publicKey,
        1000000000,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    await wallet.sendTransaction(transaction3, connection);

    console.log('Minted!');

    form.reset();
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>
          <Coins className="h-6 w-6 inline-block mr-2" />
          Generate Solana Token
        </CardTitle>
        <CardDescription>
          Create a new Solana token with custom metadata
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Token" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Symbol</FormLabel>
                  <FormControl>
                    <Input placeholder="MAT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/token-image.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="initialSupply"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Initial Supply</FormLabel>
                  <FormControl>
                    <Input placeholder="1000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Generate Token
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default LaunchpadForm;
