import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import algosdk from "algosdk";
import { ALGOD_URL, algod, pera, getSuggestedParams, encodeNote } from "@/lib/algo";

interface AlgoWalletContextValue {
  address: string | null;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage: (message: string) => Promise<Uint8Array | null>;
  rpcUrl: string;
}

const AlgoWalletContext = createContext<AlgoWalletContextValue | undefined>(undefined);

const queryClient = new QueryClient();

export function AlgoProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const reconnectTriedRef = useRef(false);

  // Try to reconnect existing session on mount (silent)
  useEffect(() => {
    if (reconnectTriedRef.current) return;
    reconnectTriedRef.current = true;

    pera.reconnectSession()
      .then((accounts) => {
        if (accounts && accounts.length > 0) {
          setAddress(accounts[0]);
        }
      })
      .catch(() => {
        // ignore
      });

    // Subscribe to account changes
    const handleDisconnect = () => setAddress(null);
    pera.connector?.on("disconnect", handleDisconnect);
    return () => {
      pera.connector?.off?.("disconnect", handleDisconnect as any);
    };
  }, []);

  const connect = useCallback(async () => {
    const accounts = await pera.connect();
    if (accounts && accounts.length > 0) setAddress(accounts[0]);
  }, []);

  const disconnect = useCallback(async () => {
    await pera.disconnect();
    setAddress(null);
  }, []);

  // Sign an off-chain message by signing a 0-ALGO self-payment with the note set to the message.
  // We DO NOT submit the transaction; we just return the signature bytes.
  const signMessage = useCallback(async (message: string) => {
    if (!address) return null;
    const params = await getSuggestedParams();

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: address,
      to: address,
      amount: 0,
      note: encodeNote(message),
      suggestedParams: params,
    });

    const txnBytes = txn.toByte();
    const [{ blob }] = await pera.signTransaction([{ txn: txnBytes }]);
    return blob as Uint8Array;
  }, [address]);

  const value = useMemo<AlgoWalletContextValue>(
    () => ({
      address,
      isConnected: !!address,
      connect,
      disconnect,
      signMessage,
      rpcUrl: ALGOD_URL,
    }),
    [address, connect, disconnect, signMessage]
  );

  return (
    <AlgoWalletContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </AlgoWalletContext.Provider>
  );
}

export function useAlgoWallet() {
  const ctx = useContext(AlgoWalletContext);
  if (!ctx) throw new Error("useAlgoWallet must be used within AlgoProvider");
  return ctx;
}
