import Wallet from '@/components/walletAdapter/Wallet';
import WalletProvider from '@/providers/WalletProvider';

export default function Adapter() {
  return (
    <WalletProvider>
      <main className="h-screen flex justify-center items-center">
        <Wallet />
      </main>
    </WalletProvider>
  );
}
