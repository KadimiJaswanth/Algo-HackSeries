import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Key, 
  Lock, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Copy, 
  Download,
  Upload,
  RefreshCw,
  Eye,
  EyeOff
} from "lucide-react";
import { SecurityAudit } from "@/lib/security";

// Dynamic import for quantum security to handle potential import issues
const useQuantumSecuritySafe = () => {
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { useQuantumSecurity, PQCAlgorithm, QuantumSecurityLevel } = require("@/lib/quantumSecurity");
    return {
      useQuantumSecurity: useQuantumSecurity(),
      PQCAlgorithm,
      QuantumSecurityLevel,
      available: true
    };
  } catch (error) {
    console.warn('Quantum security not available:', error);
    return {
      useQuantumSecurity: null,
      PQCAlgorithm: {},
      QuantumSecurityLevel: {},
      available: false
    };
  }
};

type PQCAlgorithm = any;
type QuantumSecurityLevel = any;
type QuantumKeyPair = any;

interface QuantumWalletProps {
  onWalletCreated?: (keyId: string) => void;
  onSignature?: (signature: any) => void;
}

export default function QuantumWallet({ onWalletCreated, onSignature }: QuantumWalletProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [wallets, setWallets] = useState<QuantumKeyPair[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [signMessage, setSignMessage] = useState("");
  const [showPrivateKey, setShowPrivateKey] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<any>(null);

  const {
    generateKeyPair,
    sign,
    verify,
    getMetrics,
    getKeyPair,
    algorithms,
    securityLevels
  } = useQuantumSecurity();

  useEffect(() => {
    loadWallets();
    updateMetrics();
  }, []);

  const loadWallets = () => {
    // In a real implementation, this would load from secure storage
    const storedWallets = localStorage.getItem('quantum-wallets');
    if (storedWallets) {
      try {
        const parsed = JSON.parse(storedWallets);
        setWallets(parsed);
      } catch (error) {
        console.error('Failed to load wallets:', error);
      }
    }
  };

  const saveWallets = (walletsToSave: QuantumKeyPair[]) => {
    // In a real implementation, this would use secure storage
    localStorage.setItem('quantum-wallets', JSON.stringify(walletsToSave));
    setWallets(walletsToSave);
  };

  const updateMetrics = async () => {
    try {
      const currentMetrics = getMetrics();
      setMetrics(currentMetrics);
    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  };

  const createQuantumWallet = async (algorithm: PQCAlgorithm) => {
    setIsCreating(true);
    try {
      const keyPair = await generateKeyPair(algorithm, QuantumSecurityLevel.LEVEL_3);
      
      const updatedWallets = [...wallets, keyPair];
      saveWallets(updatedWallets);
      setSelectedWallet(keyPair.keyId);
      
      SecurityAudit.log('quantum_wallet_created', 'low', { 
        algorithm,
        keyId: keyPair.keyId 
      });
      
      onWalletCreated?.(keyPair.keyId);
      await updateMetrics();
    } catch (error) {
      console.error('Failed to create quantum wallet:', error);
      SecurityAudit.log('quantum_wallet_creation_failed', 'medium', { 
        algorithm, 
        error: error.message 
      });
    } finally {
      setIsCreating(false);
    }
  };

  const signWithQuantumWallet = async () => {
    if (!selectedWallet || !signMessage.trim()) return;
    
    setIsSigning(true);
    try {
      const message = new TextEncoder().encode(signMessage);
      const signature = await sign(message, selectedWallet);
      
      SecurityAudit.log('quantum_signature_created', 'low', { 
        keyId: selectedWallet,
        algorithm: signature.algorithm 
      });
      
      onSignature?.(signature);
      setSignMessage("");
    } catch (error) {
      console.error('Failed to sign message:', error);
      SecurityAudit.log('quantum_signing_failed', 'medium', { 
        keyId: selectedWallet, 
        error: error.message 
      });
    } finally {
      setIsSigning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportWallet = (wallet: QuantumKeyPair) => {
    const exportData = {
      keyId: wallet.keyId,
      algorithm: wallet.algorithm,
      publicKey: Array.from(wallet.publicKey),
      createdAt: wallet.createdAt,
      // Note: In production, never export private keys
      // This is for demonstration only
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum-wallet-${wallet.keyId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getAlgorithmInfo = (algorithm: PQCAlgorithm) => {
    const info = {
      [PQCAlgorithm.ML_DSA_65]: {
        name: "Dilithium (ML-DSA-65)",
        type: "Lattice-based Digital Signature",
        security: "NIST Level 3",
        description: "NIST standard post-quantum digital signature algorithm",
        color: "bg-blue-500"
      },
      [PQCAlgorithm.SLH_DSA_SHAKE_128S]: {
        name: "SPHINCS+ (SLH-DSA-SHAKE-128s)",
        type: "Hash-based Digital Signature",
        security: "NIST Level 1",
        description: "NIST standard stateless hash-based signature scheme",
        color: "bg-green-500"
      },
      [PQCAlgorithm.FALCON_512]: {
        name: "Falcon-512",
        type: "Lattice-based Digital Signature",
        security: "NIST Level 1",
        description: "Compact lattice-based signature with fast verification",
        color: "bg-purple-500"
      },
      [PQCAlgorithm.FALCON_1024]: {
        name: "Falcon-1024",
        type: "Lattice-based Digital Signature",
        security: "NIST Level 5",
        description: "High-security lattice-based signature scheme",
        color: "bg-red-500"
      },
      [PQCAlgorithm.ML_KEM_768]: {
        name: "Kyber (ML-KEM-768)",
        type: "Key Encapsulation Mechanism",
        security: "NIST Level 3",
        description: "NIST standard post-quantum key exchange",
        color: "bg-yellow-500"
      },
    };
    
    return info[algorithm] || {
      name: algorithm,
      type: "Unknown",
      security: "Unknown",
      description: "Unknown algorithm",
      color: "bg-gray-500"
    };
  };

  const selectedWalletData = selectedWallet ? wallets.find(w => w.keyId === selectedWallet) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold text-gradient">Quantum-Resistant Wallet</h2>
          <Badge variant="secondary" className="glass">
            Post-Quantum Cryptography
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={metrics?.quantumResistant ? "default" : "destructive"}>
            {metrics?.quantumResistant ? "Quantum-Safe" : "Quantum-Vulnerable"}
          </Badge>
          <Button variant="outline" size="sm" onClick={updateMetrics}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quantum Security Alert */}
      <Alert className="border-amber-500 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        <AlertDescription>
          <strong>Quantum Threat Protection:</strong> This wallet uses NIST-standardized post-quantum 
          cryptographic algorithms (Dilithium, SPHINCS+, Kyber) to protect against future quantum computer attacks.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wallets">Wallets</TabsTrigger>
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="sign">Sign</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {metrics?.activeKeys || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active Quantum Keys</div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">
                  {metrics?.supportedAlgorithms?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">PQC Algorithms</div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  100%
                </div>
                <div className="text-sm text-muted-foreground">Quantum Resistant</div>
              </CardContent>
            </Card>
          </div>

          {/* Supported Algorithms */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Supported Post-Quantum Algorithms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.values(PQCAlgorithm).map((algorithm) => {
                  const info = getAlgorithmInfo(algorithm);
                  return (
                    <div key={algorithm} className="p-4 rounded-lg border glass-hover">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded ${info.color}`}></div>
                          <span className="font-medium">{info.name}</span>
                        </div>
                        <Badge variant="outline">{info.security}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">{info.type}</div>
                      <div className="text-xs text-muted-foreground">{info.description}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wallets Tab */}
        <TabsContent value="wallets" className="space-y-6">
          {wallets.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Quantum Wallets</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first quantum-resistant wallet to get started
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  <Key className="mr-2 h-4 w-4" />
                  Create Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {wallets.map((wallet) => {
                const info = getAlgorithmInfo(wallet.algorithm);
                const isSelected = selectedWallet === wallet.keyId;
                
                return (
                  <Card 
                    key={wallet.keyId} 
                    className={`glass cursor-pointer transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedWallet(wallet.keyId)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded ${info.color}`}></div>
                            <span className="font-medium">{info.name}</span>
                            <Badge variant="outline">{info.security}</Badge>
                            {isSelected && <Badge>Selected</Badge>}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Key ID: {wallet.keyId}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Created: {new Date(wallet.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(Array.from(wallet.publicKey).join(','));
                            }}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              exportWallet(wallet);
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Create Tab */}
        <TabsContent value="create" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="mr-2 h-5 w-5" />
                Create Quantum-Resistant Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  PQCAlgorithm.ML_DSA_65,
                  PQCAlgorithm.SLH_DSA_SHAKE_128S,
                  PQCAlgorithm.FALCON_512,
                  PQCAlgorithm.FALCON_1024
                ].map((algorithm) => {
                  const info = getAlgorithmInfo(algorithm);
                  
                  return (
                    <Card 
                      key={algorithm} 
                      className="glass-hover cursor-pointer border-2 hover:border-primary/50"
                      onClick={() => !isCreating && createQuantumWallet(algorithm)}
                    >
                      <CardContent className="p-6 text-center">
                        <div className={`w-12 h-12 rounded-lg ${info.color} flex items-center justify-center mx-auto mb-4`}>
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{info.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{info.description}</p>
                        <Badge variant="outline">{info.security}</Badge>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {isCreating && (
                <div className="text-center p-6">
                  <div className="animate-spin mx-auto h-8 w-8 rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                  <p className="text-muted-foreground">Generating quantum-resistant key pair...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sign Tab */}
        <TabsContent value="sign" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Quantum-Resistant Digital Signature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!selectedWallet ? (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Please select a wallet from the Wallets tab to sign messages.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {selectedWalletData && (
                    <div className="p-4 rounded-lg border bg-muted/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <Shield className="h-4 w-4 text-primary" />
                        <span className="font-medium">Selected Wallet</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getAlgorithmInfo(selectedWalletData.algorithm).name} • {selectedWalletData.keyId}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message to Sign</label>
                    <textarea
                      value={signMessage}
                      onChange={(e) => setSignMessage(e.target.value)}
                      placeholder="Enter message to sign with quantum-resistant signature..."
                      className="w-full h-32 p-3 rounded-md border bg-background"
                    />
                  </div>

                  <Button
                    onClick={signWithQuantumWallet}
                    disabled={!signMessage.trim() || isSigning}
                    className="w-full"
                  >
                    {isSigning ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Signing...
                      </>
                    ) : (
                      <>
                        <Zap className="mr-2 h-4 w-4" />
                        Sign with Quantum-Resistant Algorithm
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
