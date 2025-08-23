import { createConfig, http } from "wagmi";
import { avalanche, avalancheFuji } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [avalanche, avalancheFuji],
  connectors: [injected(), metaMask()],
  transports: {
    [avalanche.id]: http(),
    [avalancheFuji.id]: http(),
  },
});
