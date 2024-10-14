import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';
import { useWalletOperations } from '@/hooks/useWalletOperations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const AirdropCard: React.FC = () => {
  const { requestAirdrop, isLoading } = useWalletOperations();
  const [airdropAmount, setAirdropAmount] = useState('1');
  const [openModal, setOpenModal] = useState(false);

  const handleAirDrop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await requestAirdrop(Number(airdropAmount));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop</CardTitle>
        <CardDescription>
          Request SOL to be airdropped to your wallet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Coins className="w-12 h-12 text-primary" />
      </CardContent>
      <CardFooter>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <Button onClick={() => setOpenModal(true)}>Request Airdrop</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAirDrop}>
              <DialogHeader>
                <DialogTitle>Request Airdrop</DialogTitle>
                <DialogDescription>
                  Enter the amount of SOL you want to request for airdrop.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="airdropAmount" className="text-right">
                    Amount (SOL)
                  </Label>
                  <Input
                    id="airdropAmount"
                    type="number"
                    value={airdropAmount}
                    onChange={(e) => setAirdropAmount(e.target.value)}
                    className="col-span-3"
                    min="0.1"
                    step="0.1"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Confirm Airdrop' : 'Airdropping...'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
