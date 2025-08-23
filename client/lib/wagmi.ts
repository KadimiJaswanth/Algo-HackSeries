import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { avalanche, avalancheFuji } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'RideChain',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [avalanche, avalancheFuji],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
