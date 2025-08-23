import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme, lightTheme, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { ReactNode } from 'react';
import { avalanche, avalancheFuji } from 'wagmi/chains';

const queryClient = new QueryClient();

interface Web3ProviderProps {
  children: ReactNode;
}

// Get default wallets without requiring project ID
const { wallets } = getDefaultWallets();

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={[avalanche, avalancheFuji]}
          theme={{
            lightMode: lightTheme({
              accentColor: 'hsl(217, 91%, 60%)',
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
            }),
            darkMode: darkTheme({
              accentColor: 'hsl(217, 91%, 60%)',
              accentColorForeground: 'white',
              borderRadius: 'medium',
              fontStack: 'system',
            }),
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
