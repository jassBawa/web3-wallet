import LandingHeader from '@/components/landingpage/LandingHeader';
import { BackgroundLines } from '@/components/ui/background-lines';
import { HoverEffect } from '@/components/ui/card-hover-effect';

const projects = [
  {
    title: 'Solana Wallet',
    description:
      'A blockchain based wallet you always wanted to have. Create and generate keypairs.',
    link: '/wallet',
  },
];

export default function Home() {
  return (
    <BackgroundLines className="h-full py-24 flex items-center justify-center w-full flex-col px-4">
      <LandingHeader />
      <div className="max-w-3xl mx-auto px-8">
        <HoverEffect items={projects} />
      </div>
    </BackgroundLines>
  );
}
