import solanaIcon from '@/assets/icons/solana.png';
import ethIcon from '@/assets/icons/usdc.png';

export const tokens = [
  {
    symbol: 'SOL',
    name: 'Solana',
    icon: solanaIcon,
    mint: 'So11111111111111111111111111111111111111112', // Solana Devnet SOL mint
    native: true,
    price: '0', // Placeholder, fetch price from an API if required
    image:
      'https://upload.wikimedia.org/wikipedia/commons/3/34/Solana_cryptocurrency_two.jpg',
    decimals: 9,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    icon: ethIcon,
    mint: '2nd82z2BpYzDTM93FgaU2cU48sLQJ8Tgm87s62RWa6hT', // Example Devnet mint for ETH on Solana (you can use a wrapped ETH mint on Solana)
    native: false,
    price: '0', // Placeholder, fetch price from an API if required
    image:
      'https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg',
    decimals: 9,
  },
];

export type TokensType = (typeof tokens)[number]['symbol'];
