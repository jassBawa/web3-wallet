'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowDownUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
// import { tokens, TokensType } from './tokens';
import { Label } from '../ui/label';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, Transaction } from '@solana/web3.js';
import { TokensType } from './tokens';

export default function TokenSwapForm() {
  const [payToken, setPayToken] = useState<TokensType>([]);
  const [receiveToken, setReceiveToken] = useState([]);
  const [payAmount, setPayAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [tokens, setTokens] = useState([]);

  const wallet = useWallet();

  const handleSwap = () => {
    setPayToken(receiveToken);
    setReceiveToken(payToken);
    setPayAmount(receiveAmount);
    setReceiveAmount(payAmount);
  };

  const selectTokenValue = (value: TokensType) => {
    const newToken = tokens.find((t) => t.symbol === value);
    if (newToken && newToken !== receiveToken) setPayToken(newToken);
  };

  useEffect(() => {
    if (!payAmount || !/^\d*\.?\d*$/.test(payAmount)) {
      setReceiveAmount('');
      return;
    }
    setFetchingQuote(true);

    const fetchQuote = async () => {
      try {
        const res = await axios.get(
          `https://quote-api.jup.ag/v6/quote?inputMint=${
            payToken.mint
          }&outputMint=${receiveToken.mint}&amount=${
            Number(payAmount) * 10 ** payToken.decimals
          }&slippageBps=50`
        );

        const outputAmount =
          Number(res.data.outAmount) / 10 ** receiveToken.decimals;
        setReceiveAmount(outputAmount.toString());
      } catch (error) {
        console.error('Error fetching swap price:', error);
        setReceiveAmount('');
      } finally {
        setFetchingQuote(false);
      }
    };

    const debounceFetch = setTimeout(fetchQuote, 500); // Debounce for 500ms
    return () => clearTimeout(debounceFetch); // Clean up previous timeout if the amount changes
  }, [payAmount, payToken, receiveToken]);

  useEffect(() => {
    // Initialize connection to Solana devnet
    const conn = new Connection('https://api.devnet.solana.com');
    setConnection(conn);

    // Fetch available tokens from Jupiter API devnet
    const fetchTokens = async () => {
      const response = await axios.get('https://devnet.jup.ag/v1/tokens');
      setTokens(response.data.tokens);
      setPayToken(response.data.tokens[0]);
      setReceiveToken(response.data.tokens[1]);
    };
    fetchTokens();
  }, []);

  const handleSwapTokens = async () => {
    if (!wallet || !payToken || !receiveToken || !payAmount) return;

    try {
      // Get associated token accounts
      const payerAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        payToken.mint,
        wallet.publicKey
      );
      const receiverAccount = await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        receiveToken.mint,
        wallet.publicKey
      );

      // Create transaction
      const transaction = new Transaction().add(
        Token.createTransferInstruction(
          TOKEN_PROGRAM_ID,
          payerAccount,
          receiverAccount,
          wallet.publicKey,
          [],
          parseFloat(payAmount) * Math.pow(10, payToken.decimals)
        )
      );

      // Sign and send transaction
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction signature:', signature);
    } catch (error) {
      console.error('Error swapping tokens:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Swap Tokens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="">
            <Label
              htmlFor="payAmount"
              className="block text-sm font-medium text-gray-700"
            >
              You Pay
            </Label>
            <div className="flex mt-1 space-x-2">
              <Input
                id="payAmount"
                type="text"
                placeholder="0.0"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="flex-grow"
              />
              <Select
                value={payToken.symbol}
                onValueChange={(value: TokensType) => {
                  const newToken = tokens.find((t) => t.symbol === value);
                  if (newToken && newToken !== receiveToken)
                    setPayToken(newToken);
                }}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="">
                  {tokens.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                      disabled={token === receiveToken}
                    >
                      <div className="flex gap-3">
                        <Image
                          height={20}
                          width={20}
                          alt={token.name}
                          src={
                            token.icon ||
                            'https://solana.com/_next/static/media/solanaLogoMark.17260911.svg'
                          }
                        />
                        <span>{token.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSwap}
            >
              <ArrowDownUp className="h-4 w-4" />
            </Button>
          </div>

          <div className="">
            <Label
              htmlFor="receiveAmount"
              className="block text-sm font-medium text-gray-700"
            >
              You Receive
            </Label>
            <div className="mt-1 flex space-x-2">
              <Input
                id="receiveAmount"
                type="text"
                placeholder="0.0"
                value={receiveAmount}
                onChange={(e) => setReceiveAmount(e.target.value)}
                className="flex-grow"
              />
              <Select
                value={receiveToken.symbol}
                onValueChange={selectTokenValue}
              >
                <SelectTrigger className="w-[250px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="">
                  {tokens.map((token) => (
                    <SelectItem
                      key={token.symbol}
                      value={token.symbol}
                      disabled={token === payToken}
                    >
                      <div className="flex gap-3">
                        <Image
                          height={20}
                          width={20}
                          alt={token.name}
                          src={token.icon || ''}
                        />
                        <span>{token.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="button" onClick={handleSwapTokens}>
          Swap Tokens
        </Button>
      </CardFooter>
    </Card>
  );
}
