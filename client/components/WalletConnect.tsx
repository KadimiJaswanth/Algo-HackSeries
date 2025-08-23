import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

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
        onClick={() => primaryConnector && connect({ connector: primaryConnector })}
        disabled={!primaryConnector}
      >
        <Wallet className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    );
  }

  const isWrongNetwork = chain && !['avalanche', 'avalancheFuji'].includes(chain.name?.toLowerCase() || '');

  return (
    <div className="flex items-center space-x-2">
      {chain && (
        <Badge variant={isWrongNetwork ? "destructive" : "secondary"} className="hidden sm:flex">
          {chain.name}
        </Badge>
      )}
      
      <div className="flex items-center space-x-2">
        <span className="text-sm">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => disconnect()}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
