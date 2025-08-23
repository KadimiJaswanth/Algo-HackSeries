import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, ChevronDown, LogOut } from 'lucide-react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {connectors.map((connector) => (
            <DropdownMenuItem
              key={connector.id}
              onClick={() => connect({ connector })}
              className="cursor-pointer"
            >
              {connector.name}
              {connector.id === 'injected' && ' (Browser Wallet)'}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
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
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {address?.slice(0, 6)}...{address?.slice(-4)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => disconnect()}
            className="cursor-pointer text-red-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
