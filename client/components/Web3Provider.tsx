import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { ReactNode } from "react";

// Configure QueryClient with error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on certain wallet/connection errors
        if (error instanceof Error) {
          const errorMessage = error.message.toLowerCase();
          if (
            errorMessage.includes('user rejected') ||
            errorMessage.includes('user denied') ||
            errorMessage.includes('unauthorized') ||
            errorMessage.includes('failed to fetch')
          ) {
            return false;
          }
        }
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      staleTime: 30000, // 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
});

interface Web3ProviderProps {
  children: ReactNode;
}

export default function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider
      config={config}
      reconnectOnMount={false} // Prevent auto-reconnect on mount to avoid fetch errors
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
