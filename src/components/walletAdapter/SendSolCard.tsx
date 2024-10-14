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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send } from 'lucide-react';
import { useWalletOperations } from '@/hooks/useWalletOperations';

export const SendSolCard: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sendSol, isLoading } = useWalletOperations();

  const handleSendSol = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendSol(recipient, parseFloat(amount));
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send SOL</CardTitle>
        <CardDescription>Send SOL to another wallet address</CardDescription>
      </CardHeader>
      <CardContent>
        <Send className="w-12 h-12 text-primary" />
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Send SOL</Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSendSol}>
              <DialogHeader>
                <DialogTitle>Send SOL</DialogTitle>
                <DialogDescription>
                  Enter the recipient&apos; address and the amount of SOL to
                  send.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="recipient" className="text-right">
                    Recipient
                  </Label>
                  <Input
                    id="recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="col-span-3"
                    required
                    min="0"
                    step="0.000000001"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send SOL'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
