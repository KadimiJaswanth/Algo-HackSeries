import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FiLogOut as LogOut } from "react-icons/fi";
import { FaWallet as Wallet } from "react-icons/fa";
import { useState } from "react";
import { useAlgoWallet } from "@/components/AlgoProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function WalletConnect() {
  const { address, isConnected, connect, disconnect } = useAlgoWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error("Wallet connection failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleConnect}
          disabled={isConnecting}
          className="glass glow-hover border-primary/30"
        >
          {isConnecting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              Connecting Pera Wallet...
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4 text-primary" />
              Connect Pera Wallet
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 animate-slide-in-right">
      <Badge variant="secondary" className="hidden sm:flex glass glow-accent">
        Algorand TestNet
      </Badge>

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
