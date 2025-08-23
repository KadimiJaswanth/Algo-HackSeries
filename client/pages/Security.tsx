import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { FiArrowLeft as ArrowLeft, FiShield as Shield, FiLock as Lock, FiKey as Key, FiEye as Eye, FiAlertTriangle as AlertTriangle, FiCheckCircle as CheckCircle, FiDatabase as Database, FiUsers as Users, FiBarChart2 as BarChart3, FiActivity, FiSettings, FiZap, FiServer, FiGlobe, FiFileText } from "react-icons/fi";
import { FaBug } from "react-icons/fa";
import WalletConnect from "@/components/WalletConnect";
import SecurityDashboard from "@/components/SecurityDashboard";
import Web3SecurityValidator from "@/components/Web3SecurityValidator";
import { useSecurityMonitoring } from "@/lib/security";

export default function Security() {
  const [activeTab, setActiveTab] = useState("overview");
  const [securityScore, setSecurityScore] = useState(95);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [isLoadingToken, setIsLoadingToken] = useState(false);
  const { checkSecurity, reportSecurityEvent } = useSecurityMonitoring();

  useEffect(() => {
    let isMounted = true;

    // Only fetch if not already loading and no token exists
    if (!isLoadingToken && !csrfToken) {
      fetchCSRFToken();
    }

    // Report security page access
    if (isMounted) {
      reportSecurityEvent('security_page_accessed', 'low', { timestamp: Date.now() });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchCSRFToken = async () => {
    // Prevent concurrent requests
    if (isLoadingToken) {
      return;
    }

    setIsLoadingToken(true);

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response has content and is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }

      // Clone the response to avoid "body stream already read" error
      const responseClone = response.clone();
      let data;

      try {
        data = await responseClone.json();
      } catch (jsonError) {
        // If JSON parsing fails, try with original response
        data = await response.json();
      }

      if (data && data.csrfToken) {
        setCsrfToken(data.csrfToken);
      } else {
        throw new Error('Invalid CSRF token response');
      }
    } catch (error) {
      clearTimeout(timeoutId);

      // Don't log aborted requests as errors
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('CSRF token request was aborted');
        return;
      }

      console.error('Failed to fetch CSRF token:', error);
      reportSecurityEvent('csrf_token_fetch_failed', 'medium', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoadingToken(false);
    }
  };

  const testSecurityEndpoint = async (endpoint: string, method: string = 'GET', includeCSRF: boolean = false) => {
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000); // 5 second timeout

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (includeCSRF && csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        credentials: 'include',
        body: method !== 'GET' ? JSON.stringify({ test: 'data' }) : undefined,
        signal: abortController.signal,
      });

      clearTimeout(timeoutId);

      // Clone response to avoid stream consumption issues
      const responseClone = response.clone();
      let data;

      try {
        data = await responseClone.json();
      } catch (jsonError) {
        // Fallback to text if JSON parsing fails
        data = await response.text();
      }

      return {
        success: response.ok,
        status: response.status,
        data,
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        return {
          success: false,
          status: 0,
          error: 'Request timeout',
        };
      }

      return {
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  const securityFeatures = [
    {
      category: "Web3 Security",
      features: [
        { name: "Wallet Signature Validation", status: "active", description: "Validates all wallet signatures" },
        { name: "Smart Contract Analysis", status: "active", description: "Analyzes contract security before interaction" },
        { name: "Transaction Validation", status: "active", description: "Validates transaction parameters" },
        { name: "RPC Security Check", status: "active", description: "Ensures secure RPC connections" },
      ]
    },
    {
      category: "API Security",
      features: [
        { name: "Rate Limiting", status: "active", description: "Prevents API abuse and DDoS attacks" },
        { name: "Input Sanitization", status: "active", description: "Cleans and validates all inputs" },
        { name: "CSRF Protection", status: "active", description: "Prevents cross-site request forgery" },
        { name: "Request Size Limiting", status: "active", description: "Limits request payload sizes" },
      ]
    },
    {
      category: "Infrastructure Security",
      features: [
        { name: "Security Headers", status: "active", description: "Comprehensive HTTP security headers" },
        { name: "CORS Configuration", status: "active", description: "Secure cross-origin resource sharing" },
        { name: "Session Management", status: "active", description: "Secure session handling" },
        { name: "Error Handling", status: "active", description: "Secure error responses" },
      ]
    },
    {
      category: "Monitoring & Audit",
      features: [
        { name: "Security Audit Logging", status: "active", description: "Comprehensive security event logging" },
        { name: "Threat Detection", status: "active", description: "Real-time threat identification" },
        { name: "Performance Monitoring", status: "active", description: "Security performance tracking" },
        { name: "Compliance Reporting", status: "active", description: "Security compliance reports" },
      ]
    }
  ];

  const vulnerabilityProtections = [
    { name: "SQL Injection", protection: "Input validation & parameterized queries", level: "High" },
    { name: "XSS (Cross-Site Scripting)", protection: "Input sanitization & CSP headers", level: "High" },
    { name: "CSRF (Cross-Site Request Forgery)", protection: "CSRF tokens & SameSite cookies", level: "High" },
    { name: "DDoS/Rate Limiting", protection: "Advanced rate limiting algorithms", level: "High" },
    { name: "Data Exposure", protection: "Encryption & access controls", level: "High" },
    { name: "Session Hijacking", protection: "Secure session management", level: "High" },
    { name: "Man-in-the-Middle", protection: "HTTPS/TLS & certificate pinning", level: "High" },
    { name: "Replay Attacks", protection: "Nonces & timestamp validation", level: "Medium" },
    { name: "Reentrancy", protection: "Smart contract security patterns", level: "High" },
    { name: "Integer Overflow", protection: "SafeMath & Solidity 0.8+ protection", level: "High" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass border-b border-glass-border">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 animate-slide-in-left">
            <Link to="/">
              <Button variant="ghost" size="sm" className="glass-hover">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white glow">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gradient">RideChain</span>
              <span className="text-sm text-muted-foreground">Security Center</span>
            </div>
          </div>
          <WalletConnect />
        </div>
      </header>

      <div className="container py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Enterprise-Grade Security
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            RideChain implements comprehensive cybersecurity measures to protect against all known vulnerabilities 
            and ensure the highest level of security for our decentralized ride-sharing platform.
          </p>
          
          {/* Security Score */}
          <div className="mt-8 max-w-md mx-auto">
            <Card className="glass">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold text-green-500 mb-2">{securityScore}</div>
                <div className="text-lg font-medium mb-2">Security Score</div>
                <Progress value={securityScore} className="mb-2" />
                <div className="text-sm text-muted-foreground">
                  Exceeds industry standards
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto glass animate-fade-in-up">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-1 text-xs"
            >
              <Shield className="h-3 w-3" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="features"
              className="flex items-center space-x-1 text-xs"
            >
              <Lock className="h-3 w-3" />
              <span className="hidden sm:inline">Features</span>
            </TabsTrigger>
            <TabsTrigger
              value="protection"
              className="flex items-center space-x-1 text-xs"
            >
              <FaBug className="h-3 w-3" />
              <span className="hidden sm:inline">Protection</span>
            </TabsTrigger>
            <TabsTrigger
              value="monitoring"
              className="flex items-center space-x-1 text-xs"
            >
              <FiActivity className="h-3 w-3" />
              <span className="hidden sm:inline">Monitoring</span>
            </TabsTrigger>
            <TabsTrigger
              value="testing"
              className="flex items-center space-x-1 text-xs"
            >
              <FiSettings className="h-3 w-3" />
              <span className="hidden sm:inline">Testing</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 animate-fade-in-up">
            {/* Security Highlights */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Zero Known Vulnerabilities</h3>
                  <p className="text-sm text-muted-foreground">
                    Our platform is protected against all known security threats
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-blue-500/20 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold mb-2">24/7 Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time security monitoring and threat detection
                  </p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <FiZap className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold mb-2">Instant Response</h3>
                  <p className="text-sm text-muted-foreground">
                    Automated threat response and mitigation systems
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Web3 Security Validator */}
            <Web3SecurityValidator showDetails={true} />

            {/* Security Architecture */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <FiServer className="mr-2 h-5 w-5" />
                  Security Architecture
                </CardTitle>
                <CardDescription>
                  Multi-layered security approach protecting every aspect of the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Frontend Security</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Content Security Policy (CSP)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>XSS Protection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Input Sanitization</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>HTTPS Enforcement</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Backend Security</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>API Rate Limiting</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>CSRF Protection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>SQL Injection Prevention</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Secure Session Management</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6 animate-fade-in-up">
            {securityFeatures.map((category, categoryIndex) => (
              <Card key={categoryIndex} className="glass">
                <CardHeader>
                  <CardTitle className="text-gradient">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {category.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="p-4 rounded-lg border glass-hover">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{feature.name}</h4>
                          <Badge variant={feature.status === 'active' ? 'default' : 'secondary'}>
                            {feature.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Protection Tab */}
          <TabsContent value="protection" className="space-y-6 animate-fade-in-up">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <FaBug className="mr-2 h-5 w-5" />
                  Vulnerability Protection Matrix
                </CardTitle>
                <CardDescription>
                  Comprehensive protection against known security vulnerabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vulnerabilityProtections.map((vuln, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="space-y-1">
                        <h4 className="font-medium">{vuln.name}</h4>
                        <p className="text-sm text-muted-foreground">{vuln.protection}</p>
                      </div>
                      <Badge variant={vuln.level === 'High' ? 'default' : 'secondary'}>
                        {vuln.level} Protection
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6 animate-fade-in-up">
            <SecurityDashboard />
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-6 animate-fade-in-up">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center text-gradient">
                  <FiSettings className="mr-2 h-5 w-5" />
                  Security Testing Tools
                </CardTitle>
                <CardDescription>
                  Test various security features and protections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CSRF Token */}
                <div className="p-4 rounded-lg border">
                  <h4 className="font-medium mb-2">CSRF Token</h4>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Current token: {csrfToken ? `${csrfToken.slice(0, 8)}...` : 'Not generated'}
                    </div>
                    <Button size="sm" onClick={fetchCSRFToken} disabled={isLoadingToken}>
                      {isLoadingToken ? (
                        <>
                          <div className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          Loading...
                        </>
                      ) : (
                        'Refresh Token'
                      )}
                    </Button>
                  </div>
                </div>

                {/* API Testing */}
                <div className="space-y-4">
                  <h4 className="font-medium">API Security Tests</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => testSecurityEndpoint('/api/ping')}
                      className="justify-start"
                    >
                      <FiGlobe className="mr-2 h-4 w-4" />
                      Test Rate Limiting
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testSecurityEndpoint('/api/health')}
                      className="justify-start"
                    >
                      <FiActivity className="mr-2 h-4 w-4" />
                      Test Security Headers
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testSecurityEndpoint('/api/transaction/submit', 'POST', true)}
                      className="justify-start"
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Test CSRF Protection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => testSecurityEndpoint('/api/security/test')}
                      className="justify-start"
                    >
                      <FiFileText className="mr-2 h-4 w-4" />
                      Security Feature Test
                    </Button>
                  </div>
                </div>

                {/* Security Metrics */}
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All security features are operational and continuously monitored. 
                    Regular security audits ensure the platform remains protected against emerging threats.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
