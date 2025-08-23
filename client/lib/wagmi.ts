import { createConfig, http } from 'wagmi';
import { avalanche, avalancheFuji } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors';

// Create a more flexible config that works without requiring WalletConnect project ID
const projectId = process.env.VITE_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected(),
    metaMask(),
    safe(),
    // Only include WalletConnect if we have a valid project ID
    ...(projectId !== 'demo-project-id' ? [walletConnect({ projectId })] : []),
  ],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});
