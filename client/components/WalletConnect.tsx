import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiLogOut as LogOut } from "react-icons/fi";
import { FaWallet as Wallet } from "react-icons/fa";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState } from "react";

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    const primaryConnector = connectors[0];
    if (!primaryConnector) return;

    setIsConnecting(true);
    try {
      await connect({ connector: primaryConnector });
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Error is handled by wagmi and displayed via connectError
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    const primaryConnector = connectors[0];

    return (
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={!primaryConnector || isConnecting}
          className="glass glow-hover border-primary/30"
        >
          {isConnecting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4 text-primary" />
              Connect Wallet
            </>
          )}
        </Button>
        {connectError && (
          <div className="text-xs text-red-400 max-w-48 truncate">
            {connectError.message.includes('User rejected') ? 'Connection rejected' : 'Connection failed'}
          </div>
        )}
      </div>
    );
  }

  const isWrongNetwork =
    chain &&
    !["avalanche", "avalancheFuji"].includes(chain.name?.toLowerCase() || "");

  return (
    <div className="flex items-center space-x-2 animate-slide-in-right">
      {chain && (
        <Badge
          variant={isWrongNetwork ? "destructive" : "secondary"}
          className="hidden sm:flex glass glow-accent"
        >
          {chain.name}
        </Badge>
      )}

      <div className="flex items-center space-x-2 glass px-3 py-1 rounded-md border border-glass-border">
        <span className="text-sm font-mono text-primary">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
          className="glass-hover border-red-500/30 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4 text-red-400" />
        </Button>
      </div>
    </div>
  );
}
