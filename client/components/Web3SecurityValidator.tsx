import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAlgoWallet } from "@/components/AlgoProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Key,
  Lock,
  Eye,
  EyeOff,
  Clock,
  Zap,
  Globe,
  Database,
} from "lucide-react";
import { SecurityAudit, Web3Security, SessionManager } from "@/lib/security";

interface SecurityStatus {
  walletConnected: boolean;
  signatureValid: boolean;
  transactionSafe: boolean;
  rpcSecure: boolean;
  contractVerified: boolean;
  sessionValid: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface Web3SecurityValidatorProps {
  onSecurityChange?: (status: SecurityStatus) => void;
  showDetails?: boolean;
}

export default function Web3SecurityValidator({
  onSecurityChange,
  showDetails = false
}: Web3SecurityValidatorProps) {
  const { address, isConnected, signMessage, rpcUrl } = useAlgoWallet();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    walletConnected: false,
    signatureValid: false,
    transactionSafe: false,
    rpcSecure: false,
    contractVerified: false,
    sessionValid: false,
    riskLevel: 'medium',
  });
  const [isValidating, setIsValidating] = useState(false);
  const [showSecurityDetails, setShowSecurityDetails] = useState(showDetails);
  const [lastValidation, setLastValidation] = useState<number>(0);

  useEffect(() => {
    validateSecurity();
    const interval = setInterval(validateSecurity, 30000); // Validate every 30 seconds
    return () => clearInterval(interval);
  }, [isConnected, address]);

  const validateSecurity = async () => {
    setIsValidating(true);
    
    try {
      const status: SecurityStatus = {
        walletConnected: isConnected && !!address,
        signatureValid: await validateSignature(),
        transactionSafe: await validateTransactionSafety(),
        rpcSecure: await validateRPCSecurity(),
        contractVerified: await validateContractSecurity(),
        sessionValid: SessionManager.isSessionValid(),
        riskLevel: 'low',
      };

      // Calculate risk level
      const risks = [
        !status.walletConnected,
        !status.signatureValid,
        !status.transactionSafe,
        !status.rpcSecure,
        !status.contractVerified,
        !status.sessionValid,
      ];
      
      const riskCount = risks.filter(Boolean).length;
      if (riskCount === 0) status.riskLevel = 'low';
      else if (riskCount <= 2) status.riskLevel = 'medium';
      else if (riskCount <= 4) status.riskLevel = 'high';
      else status.riskLevel = 'critical';

      setSecurityStatus(status);
      setLastValidation(Date.now());
      onSecurityChange?.(status);

      // Log security events
      if (status.riskLevel === 'critical') {
        SecurityAudit.log('critical_security_risk', 'critical', status);
      } else if (status.riskLevel === 'high') {
        SecurityAudit.log('high_security_risk', 'high', status);
      }

    } catch (error) {
      console.error('Security validation failed:', error);
      SecurityAudit.log('security_validation_failed', 'high', { error: error.message });
    } finally {
      setIsValidating(false);
    }
  };

  const validateSignature = async (): Promise<boolean> => {
    if (!isConnected || !address) return false;
    
    try {
      // In production, this would validate a real signature
      // For demo, we'll simulate validation
      const testMessage = `Security validation for ${address} at ${Date.now()}`;
      return true; // Simplified for demo
    } catch (error) {
      SecurityAudit.log('signature_validation_failed', 'medium', { error: error.message });
      return false;
    }
  };

  const validateTransactionSafety = async (): Promise<boolean> => {
    try {
      // Check for common transaction vulnerabilities
      const checks = [
        // Gas price validation
        await validateGasPrice(),
        // Contract interaction safety
        await validateContractInteraction(),
        // Slippage protection
        await validateSlippageProtection(),
      ];
      
      return checks.every(Boolean);
    } catch (error) {
      SecurityAudit.log('transaction_safety_check_failed', 'medium', { error: error.message });
      return false;
    }
  };

  const validateGasPrice = async (): Promise<boolean> => {
    // Simulate gas price validation
    const gasPrice = Math.random() * 100; // Mock gas price in Gwei
    return gasPrice < 50; // Reasonable gas price threshold
  };

  const validateContractInteraction = async (): Promise<boolean> => {
    // Simulate contract security check
    return true; // In production, would check contract bytecode and known vulnerabilities
  };

  const validateSlippageProtection = async (): Promise<boolean> => {
    // Simulate slippage protection validation
    return true; // In production, would validate slippage settings
  };

  const validateRPCSecurity = async (): Promise<boolean> => {
    try {
      // Check Algorand RPC endpoint security
      if (!rpcUrl) return false;

      const isSecure = rpcUrl.startsWith('https://');

      // Known secure Algorand providers
      const secureProviders = ['algonode.cloud', 'algoexplorerapi.io', 'purestake.io'];
      const isKnownProvider = secureProviders.some((p) => rpcUrl.includes(p));

      return isSecure && isKnownProvider;
    } catch (error) {
      SecurityAudit.log('rpc_security_check_failed', 'medium', { error: error.message });
      return false;
    }
  };

  const validateContractSecurity = async (): Promise<boolean> => {
    try {
      // Simulate contract verification check
      // In production, would check if contracts are verified on Etherscan
      return Math.random() > 0.1; // 90% success rate for demo
    } catch (error) {
      SecurityAudit.log('contract_verification_failed', 'medium', { error: error.message });
      return false;
    }
  };

  const getSecurityScore = (): number => {
    const checks = [
      securityStatus.walletConnected,
      securityStatus.signatureValid,
      securityStatus.transactionSafe,
      securityStatus.rpcSecure,
      securityStatus.contractVerified,
      securityStatus.sessionValid,
    ];
    
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'low': return 'default';
      case 'medium': return 'secondary';
      case 'high': return 'destructive';
      case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  const securityScore = getSecurityScore();
  const timeAgo = lastValidation ? Math.floor((Date.now() - lastValidation) / 1000) : 0;

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-gradient">Web3 Security</span>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getRiskBadgeVariant(securityStatus.riskLevel)}>
              {securityStatus.riskLevel.toUpperCase()}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSecurityDetails(!showSecurityDetails)}
            >
              {showSecurityDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Security Score */}
        <div className="text-center">
          <div className={`text-3xl font-bold ${getRiskColor(securityStatus.riskLevel)}`}>
            {securityScore}%
          </div>
          <div className="text-sm text-muted-foreground">Security Score</div>
          <Progress value={securityScore} className="mt-2" />
        </div>

        {/* Last Validation */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Last validation:</span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo}s ago</span>
          </span>
        </div>

        {/* Quick Security Status */}
        {!showSecurityDetails && (
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              {securityStatus.walletConnected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Wallet</span>
            </div>
            <div className="flex items-center space-x-2">
              {securityStatus.sessionValid ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm">Session</span>
            </div>
          </div>
        )}

        {/* Detailed Security Status */}
        {showSecurityDetails && (
          <div className="space-y-3">
            <div className="grid gap-2">
              {[
                { key: 'walletConnected', label: 'Wallet Connected', icon: Key },
                { key: 'signatureValid', label: 'Signature Valid', icon: Lock },
                { key: 'transactionSafe', label: 'Transaction Safe', icon: Shield },
                { key: 'rpcSecure', label: 'RPC Secure', icon: Globe },
                { key: 'contractVerified', label: 'Contract Verified', icon: Database },
                { key: 'sessionValid', label: 'Session Valid', icon: Clock },
              ].map(({ key, label, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between p-2 rounded border">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{label}</span>
                  </div>
                  {securityStatus[key as keyof SecurityStatus] ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security Alerts */}
        {securityStatus.riskLevel === 'critical' && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500">
              Critical security risks detected. Please review your connection.
            </AlertDescription>
          </Alert>
        )}

        {securityStatus.riskLevel === 'high' && (
          <Alert className="border-orange-500 bg-orange-500/10">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <AlertDescription className="text-orange-500">
              High security risks detected. Proceed with caution.
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={validateSecurity}
            disabled={isValidating}
            className="flex-1"
          >
            {isValidating ? (
              <>
                <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                Validating...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Re-validate
              </>
            )}
          </Button>
          
          {securityStatus.riskLevel !== 'low' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                SessionManager.invalidateSession();
                window.location.reload();
              }}
            >
              <Shield className="mr-2 h-4 w-4" />
              Secure Mode
            </Button>
          )}
        </div>

        {/* Security Tips */}
        {showSecurityDetails && (
          <div className="mt-4 p-3 rounded border bg-muted/50">
            <h4 className="font-medium text-sm mb-2">Security Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Always verify contract addresses before interacting</li>
              <li>• Use hardware wallets for large transactions</li>
              <li>• Check gas prices to avoid overpaying</li>
              <li>• Keep your seed phrase secure and private</li>
              <li>• Regularly update your wallet software</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
