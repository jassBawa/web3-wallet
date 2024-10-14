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
import { FileSignature } from 'lucide-react';
import { useWalletOperations } from '@/hooks/useWalletOperations';

export const SignMessageCard: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { signMessageOperation, isLoading } = useWalletOperations();

  const handleSignMessage = async () => {
    await signMessageOperation();
    setIsDialogOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Message</CardTitle>
        <CardDescription>Sign a message with your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <FileSignature className="w-12 h-12 text-primary" />
      </CardContent>
      <CardFooter>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Sign Message</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sign Message</DialogTitle>
              <DialogDescription>
                Sign a test message with your connected wallet.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleSignMessage} disabled={isLoading}>
                {isLoading ? 'Signing...' : 'Sign Message'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
