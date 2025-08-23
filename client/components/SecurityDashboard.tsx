import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Globe,
  Lock,
  Key,
  Database,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Bell,
  Settings,
  Download,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  SecurityAudit,
  SessionManager,
  useSecurityMonitoring,
} from "@/lib/security";
import { ContractSecurityAnalyzer } from "@/lib/contractSecurity";
import { useQuantumSecurity } from "@/lib/quantumSecurity";
import Web3SecurityValidator from "./Web3SecurityValidator";
import QuantumWallet from "./QuantumWallet";

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highSeverityEvents: number;
  mediumSeverityEvents: number;
  lowSeverityEvents: number;
  securityScore: number;
  threatLevel: "low" | "medium" | "high" | "critical";
  activeThreats: number;
  lastUpdate: number;
  quantumMetrics?: QuantumMetrics;
}

interface QuantumMetrics {
  quantumResistant: boolean;
  supportedAlgorithms: string[];
  activeKeys: number;
  activeSessions: number;
  securityLevels: number[];
}

interface ThreatEvent {
  id: string;
  timestamp: number;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  source: string;
  status: "active" | "resolved" | "investigating";
  details: any;
}

export default function SecurityDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetrics>({
    totalEvents: 0,
    criticalEvents: 0,
    highSeverityEvents: 0,
    mediumSeverityEvents: 0,
    lowSeverityEvents: 0,
    securityScore: 85,
    threatLevel: "low",
    activeThreats: 0,
    lastUpdate: Date.now(),
  });
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [quantumEnabled, setQuantumEnabled] = useState(false);
  const { checkSecurity, reportSecurityEvent } = useSecurityMonitoring();
  const {
    getMetrics: getQuantumMetrics,
    generateKeyPair,
    algorithms,
  } = useQuantumSecurity();

  useEffect(() => {
    updateSecurityMetrics();

    if (autoRefresh) {
      const interval = setInterval(updateSecurityMetrics, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const updateSecurityMetrics = () => {
    try {
      // Get security audit metrics
      const auditMetrics = SecurityAudit.getSecurityMetrics();

      // Get contract security report
      const contractReport = ContractSecurityAnalyzer.getSecurityReport();

      // Get quantum security metrics
      let quantumMetrics: QuantumMetrics | undefined;
      try {
        const qMetrics = getQuantumMetrics();
        quantumMetrics = {
          quantumResistant: qMetrics.quantumResistant,
          supportedAlgorithms: qMetrics.supportedAlgorithms || [],
          activeKeys: qMetrics.activeKeys || 0,
          activeSessions: qMetrics.activeSessions || 0,
          securityLevels: qMetrics.securityLevels || [],
        };
      } catch (error) {
        console.log("Quantum metrics not available:", error);
      }

      // Calculate overall security score
      const baseScore = 100;
      const criticalPenalty = auditMetrics.criticalEvents * 20;
      const highPenalty = auditMetrics.highSeverityEvents * 10;
      const mediumPenalty = auditMetrics.mediumSeverityEvents * 5;

      // Bonus for quantum resistance
      const quantumBonus = quantumMetrics?.quantumResistant ? 10 : 0;

      const securityScore = Math.min(
        100,
        Math.max(
          0,
          baseScore -
            criticalPenalty -
            highPenalty -
            mediumPenalty +
            quantumBonus,
        ),
      );

      // Determine threat level
      let threatLevel: "low" | "medium" | "high" | "critical" = "low";
      if (auditMetrics.criticalEvents > 0) threatLevel = "critical";
      else if (auditMetrics.highSeverityEvents > 5) threatLevel = "high";
      else if (auditMetrics.mediumSeverityEvents > 10) threatLevel = "medium";

      const metrics: SecurityMetrics = {
        ...auditMetrics,
        securityScore,
        threatLevel,
        activeThreats:
          auditMetrics.criticalEvents + auditMetrics.highSeverityEvents,
        lastUpdate: Date.now(),
        quantumMetrics,
      };

      setSecurityMetrics(metrics);

      // Update threat events
      updateThreatEvents();
    } catch (error) {
      console.error("Failed to update security metrics:", error);
      reportSecurityEvent("metrics_update_failed", "medium", {
        error: error.message,
      });
    }
  };

  const updateThreatEvents = () => {
    const logs = SecurityAudit.getLogs();
    const recentThreats = logs
      .filter((log) => log.severity === "high" || log.severity === "critical")
      .slice(-20) // Get last 20 threats
      .map((log) => ({
        id: `threat_${log.timestamp}`,
        timestamp: log.timestamp,
        type: log.event,
        severity: log.severity,
        description: getThreatDescription(log.event),
        source: log.ip || "Unknown",
        status: "active" as const,
        details: log.details,
      }));

    setThreats(recentThreats);
  };

  const getThreatDescription = (event: string): string => {
    const descriptions: Record<string, string> = {
      critical_security_risk: "Critical security vulnerability detected",
      high_security_risk: "High-severity security issue identified",
      too_many_critical_events: "Unusual number of critical events detected",
      blacklisted_contract_detected: "Interaction with blacklisted contract",
      signature_validation_failed: "Digital signature validation failed",
      transaction_validation_failed: "Transaction security validation failed",
      contract_analysis_failed: "Smart contract security analysis failed",
      security_validation_failed: "General security validation failure",
      session_expired: "User session expired unexpectedly",
      rpc_security_check_failed: "RPC endpoint security check failed",
      contract_verification_failed: "Contract verification process failed",
    };

    return descriptions[event] || `Security event: ${event}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "high":
        return "text-orange-500";
      case "critical":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getBadgeVariant = (severity: string) => {
    switch (severity) {
      case "low":
        return "secondary";
      case "medium":
        return "outline";
      case "high":
        return "destructive";
      case "critical":
        return "destructive";
      default:
        return "outline";
    }
  };

  const resolveThreat = (threatId: string) => {
    setThreats((prev) =>
      prev.map((threat) =>
        threat.id === threatId ? { ...threat, status: "resolved" } : threat,
      ),
    );
    reportSecurityEvent("threat_resolved", "low", { threatId });
  };

  const exportSecurityReport = () => {
    const report = {
      metrics: securityMetrics,
      threats: threats,
      auditLogs: SecurityAudit.getLogs(),
      contractReport: ContractSecurityAnalyzer.getSecurityReport(),
      timestamp: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `security-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    reportSecurityEvent("security_report_exported", "low");
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gradient">Security Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`}
            />
            {autoRefresh ? "Auto" : "Manual"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportSecurityReport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Security Alert Banner */}
      {securityMetrics.threatLevel === "critical" && (
        <Alert className="border-red-500 bg-red-500/10 animate-pulse">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-500 font-medium">
            CRITICAL SECURITY ALERT: {securityMetrics.activeThreats} active
            threats detected
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6 glass">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="quantum">Quantum</TabsTrigger>
          <TabsTrigger value="threats">Threats</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div
                  className={`text-3xl font-bold ${getScoreColor(securityMetrics.securityScore)}`}
                >
                  {securityMetrics.securityScore}
                </div>
                <div className="text-sm text-muted-foreground">
                  Security Score
                </div>
                <Progress
                  value={securityMetrics.securityScore}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div
                  className={`text-3xl font-bold ${getThreatLevelColor(securityMetrics.threatLevel)}`}
                >
                  {securityMetrics.threatLevel.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Threat Level
                </div>
                <Badge
                  variant={getBadgeVariant(securityMetrics.threatLevel)}
                  className="mt-2"
                >
                  {securityMetrics.activeThreats} Active
                </Badge>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">
                  {securityMetrics.totalEvents}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Events (24h)
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last: {timeAgo(securityMetrics.lastUpdate)}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent">
                  {isMonitoring ? "ACTIVE" : "PAUSED"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Monitoring Status
                </div>
                <div
                  className={`w-2 h-2 rounded-full mx-auto mt-2 ${
                    isMonitoring ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div
                  className={`text-3xl font-bold ${
                    securityMetrics.quantumMetrics?.quantumResistant
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {securityMetrics.quantumMetrics?.quantumResistant
                    ? "SAFE"
                    : "VULNERABLE"}
                </div>
                <div className="text-sm text-muted-foreground">
                  Quantum Status
                </div>
                <Badge
                  variant={
                    securityMetrics.quantumMetrics?.quantumResistant
                      ? "default"
                      : "destructive"
                  }
                  className="mt-2"
                >
                  {securityMetrics.quantumMetrics?.activeKeys || 0} Keys
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Security Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Event Severity Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span className="text-sm">Critical</span>
                    </div>
                    <span className="font-medium">
                      {securityMetrics.criticalEvents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded"></div>
                      <span className="text-sm">High</span>
                    </div>
                    <span className="font-medium">
                      {securityMetrics.highSeverityEvents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span className="text-sm">Medium</span>
                    </div>
                    <span className="font-medium">
                      {securityMetrics.mediumSeverityEvents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span className="text-sm">Low</span>
                    </div>
                    <span className="font-medium">
                      {securityMetrics.lowSeverityEvents}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="mr-2 h-5 w-5" />
                  Recent Security Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {threats.slice(0, 5).map((threat) => (
                      <div
                        key={threat.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant={getBadgeVariant(threat.severity)}
                            className="text-xs"
                          >
                            {threat.severity}
                          </Badge>
                          <span className="truncate">{threat.description}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(threat.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Web3 Security Validator */}
          <Web3SecurityValidator showDetails={true} />
        </TabsContent>

        {/* Quantum Security Tab */}
        <TabsContent value="quantum" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Post-Quantum Cryptography
                </div>
                <Badge
                  variant={
                    securityMetrics.quantumMetrics?.quantumResistant
                      ? "default"
                      : "destructive"
                  }
                >
                  {securityMetrics.quantumMetrics?.quantumResistant
                    ? "Quantum-Safe"
                    : "Quantum-Vulnerable"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {securityMetrics.quantumMetrics ? (
                <div className="space-y-6">
                  {/* Quantum Metrics */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-primary">
                        {
                          securityMetrics.quantumMetrics.supportedAlgorithms
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        PQC Algorithms
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-accent">
                        {securityMetrics.quantumMetrics.activeKeys}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Keys
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-success">
                        {securityMetrics.quantumMetrics.activeSessions}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Quantum Sessions
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg border">
                      <div className="text-2xl font-bold text-green-500">
                        {Math.max(
                          ...securityMetrics.quantumMetrics.securityLevels,
                          0,
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Max Security Level
                      </div>
                    </div>
                  </div>

                  {/* Supported Algorithms */}
                  <div>
                    <h4 className="font-semibold mb-3">
                      NIST Post-Quantum Standards
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        {
                          name: "ML-DSA (Dilithium)",
                          type: "Digital Signature",
                          status: "NIST Standard",
                        },
                        {
                          name: "SLH-DSA (SPHINCS+)",
                          type: "Hash-based Signature",
                          status: "NIST Standard",
                        },
                        {
                          name: "ML-KEM (Kyber)",
                          type: "Key Encapsulation",
                          status: "NIST Standard",
                        },
                        {
                          name: "Falcon",
                          type: "Compact Signature",
                          status: "Alternative",
                        },
                      ].map((algo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded border"
                        >
                          <div>
                            <div className="font-medium">{algo.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {algo.type}
                            </div>
                          </div>
                          <Badge
                            variant={
                              algo.status === "NIST Standard"
                                ? "default"
                                : "outline"
                            }
                          >
                            {algo.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    Quantum security not initialized
                  </p>
                  <Button onClick={() => setQuantumEnabled(true)}>
                    Enable Quantum Protection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quantum Wallet Integration */}
          <QuantumWallet
            onWalletCreated={(keyId) => {
              updateSecurityMetrics();
              reportSecurityEvent("quantum_wallet_integrated", "low", {
                keyId,
              });
            }}
            onSignature={(signature) => {
              reportSecurityEvent("quantum_signature_generated", "low", {
                algorithm: signature.algorithm,
                timestamp: signature.timestamp,
              });
            }}
          />
        </TabsContent>

        {/* Threats Tab */}
        <TabsContent value="threats" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Active Threats
                </div>
                <Badge variant="destructive">
                  {threats.filter((t) => t.status === "active").length} Active
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-4">
                  {threats.map((threat) => (
                    <div
                      key={threat.id}
                      className="p-4 rounded-lg border glass-hover"
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getBadgeVariant(threat.severity)}>
                              {threat.severity}
                            </Badge>
                            <Badge
                              variant={
                                threat.status === "active"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {threat.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {threat.type}
                            </span>
                          </div>
                          <div className="font-medium">
                            {threat.description}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Source: {threat.source} •{" "}
                            {timeAgo(threat.timestamp)}
                          </div>
                          {threat.details && (
                            <details className="text-xs text-muted-foreground">
                              <summary className="cursor-pointer">
                                View Details
                              </summary>
                              <pre className="mt-2 p-2 bg-muted/50 rounded overflow-auto">
                                {JSON.stringify(threat.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                        {threat.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => resolveThreat(threat.id)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {threats.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="mx-auto h-12 w-12 mb-4" />
                      <p>No threats detected</p>
                      <p className="text-sm">Your application is secure</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="mr-2 h-5 w-5" />
                  Real-time Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Security Monitoring</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isMonitoring
                          ? "bg-green-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <span className="text-sm">
                      {isMonitoring ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Session Monitoring</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transaction Validation</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Contract Analysis</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Threat Detection</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Auto-refresh Dashboard</span>
                    <Button
                      variant={autoRefresh ? "default" : "outline"}
                      size="sm"
                      onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                      {autoRefresh ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <span className="text-sm text-muted-foreground">
                      30 minutes
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rate Limiting</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm">CSRF Protection</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="mr-2 h-5 w-5" />
                Smart Contract Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Database className="mx-auto h-12 w-12 mb-4" />
                <p>Contract security analysis will appear here</p>
                <p className="text-sm">
                  Connect wallet and interact with contracts to see data
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Security Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {SecurityAudit.getLogs()
                    .slice(-50)
                    .reverse()
                    .map((log, index) => (
                      <div key={index} className="p-3 rounded border text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant={getBadgeVariant(log.severity)}>
                              {log.severity}
                            </Badge>
                            <span className="font-medium">{log.event}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <details className="mt-2 text-xs text-muted-foreground">
                            <summary className="cursor-pointer">
                              Details
                            </summary>
                            <pre className="mt-1 p-2 bg-muted/50 rounded overflow-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
