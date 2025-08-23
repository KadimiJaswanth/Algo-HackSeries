import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut } from "lucide-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    // Use the first available connector (usually injected/MetaMask)
    const primaryConnector = connectors[0];

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          primaryConnector && connect({ connector: primaryConnector })
        }
        disabled={!primaryConnector}
        className="glass glow-hover border-primary/30"
      >
        <Wallet className="mr-2 h-4 w-4 text-primary" />
        Connect Wallet
      </Button>
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
