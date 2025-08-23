import { createConfig, http } from "wagmi";
import { avalanche, avalancheFuji } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// Define public RPC endpoints for Avalanche
const AVALANCHE_RPC = "https://api.avax.network/ext/bc/C/rpc";
const AVALANCHE_FUJI_RPC = "https://api.avax-test.network/ext/bc/C/rpc";

export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [
    injected({
      shimDisconnect: true,
      // Target specific injected wallets including MetaMask
      target: () => ({
        id: 'injected',
        name: 'Injected Wallet',
        provider: typeof window !== 'undefined' ? window.ethereum : undefined,
      }),
    }),
  ],
  transports: {
    [avalanche.id]: http(AVALANCHE_RPC),
    [avalancheFuji.id]: http(AVALANCHE_FUJI_RPC),
  },
  ssr: false, // Disable SSR for client-side only app
});
