import { z } from "zod";
import { SecurityAudit } from "./security";

// Contract ABI validation schemas
export const contractABISchema = z.array(z.object({
  name: z.string().optional(),
  type: z.enum(['function', 'constructor', 'event', 'fallback', 'receive']),
  inputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
    indexed: z.boolean().optional(),
  })).optional(),
  outputs: z.array(z.object({
    name: z.string(),
    type: z.string(),
  })).optional(),
  stateMutability: z.enum(['pure', 'view', 'nonpayable', 'payable']).optional(),
}));

export const transactionSchema = z.object({
  to: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid contract address"),
  value: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid value format"),
  data: z.string().regex(/^0x[a-fA-F0-9]*$/, "Invalid data format"),
  gas: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid gas format"),
  gasPrice: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid gas price format"),
});

// Known vulnerable patterns in smart contracts
const VULNERABLE_PATTERNS = [
  // Reentrancy patterns
  /\.call\s*\(/,
  /\.send\s*\(/,
  /\.transfer\s*\(/,
  // Unchecked external calls
  /external\s+payable/,
  // Timestamp dependencies
  /block\.timestamp/,
  /now\s/,
  // Integer overflow/underflow (pre-Solidity 0.8.0)
  /\+\+|\-\-/,
  // Unsafe delegatecall
  /delegatecall/,
];

export interface ContractSecurityReport {
  address: string;
  verified: boolean;
  vulnerabilities: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  securityScore: number;
  lastAudit: number;
  recommendations: string[];
}

export interface TransactionSecurityCheck {
  isSecure: boolean;
  risks: string[];
  gasEstimate: string;
  maxFeePerGas: string;
  warnings: string[];
}

export class ContractSecurityAnalyzer {
  private static verifiedContracts = new Map<string, ContractSecurityReport>();
  private static contractBlacklist = new Set<string>([
    // Known malicious contract addresses (example)
    '0x0000000000000000000000000000000000000000',
  ]);

  static async analyzeContract(address: string, abi?: any[]): Promise<ContractSecurityReport> {
    try {
      // Check cache first
      if (this.verifiedContracts.has(address)) {
        const cached = this.verifiedContracts.get(address)!;
        // Return cached if less than 1 hour old
        if (Date.now() - cached.lastAudit < 3600000) {
          return cached;
        }
      }

      const report: ContractSecurityReport = {
        address,
        verified: false,
        vulnerabilities: [],
        riskLevel: 'medium',
        securityScore: 0,
        lastAudit: Date.now(),
        recommendations: [],
      };

      // Check if contract is blacklisted
      if (this.contractBlacklist.has(address.toLowerCase())) {
        report.vulnerabilities.push('Contract is on security blacklist');
        report.riskLevel = 'critical';
        report.securityScore = 0;
        SecurityAudit.log('blacklisted_contract_detected', 'critical', { address });
        return report;
      }

      // Simulate contract verification check
      report.verified = await this.checkContractVerification(address);
      
      // Analyze ABI if provided
      if (abi && Array.isArray(abi)) {
        const abiAnalysis = this.analyzeABI(abi);
        report.vulnerabilities.push(...abiAnalysis.vulnerabilities);
        report.recommendations.push(...abiAnalysis.recommendations);
      }

      // Simulate bytecode analysis
      const bytecodeAnalysis = await this.analyzeBytecode(address);
      report.vulnerabilities.push(...bytecodeAnalysis.vulnerabilities);
      report.recommendations.push(...bytecodeAnalysis.recommendations);

      // Calculate risk level and security score
      this.calculateRiskMetrics(report);

      // Cache the result
      this.verifiedContracts.set(address, report);

      SecurityAudit.log('contract_security_analyzed', 'low', { 
        address, 
        riskLevel: report.riskLevel,
        securityScore: report.securityScore 
      });

      return report;

    } catch (error) {
      SecurityAudit.log('contract_analysis_failed', 'high', { address, error: error.message });
      
      return {
        address,
        verified: false,
        vulnerabilities: ['Analysis failed - proceed with extreme caution'],
        riskLevel: 'critical',
        securityScore: 0,
        lastAudit: Date.now(),
        recommendations: ['Manual security review required'],
      };
    }
  }

  private static async checkContractVerification(address: string): Promise<boolean> {
    try {
      // In production, this would check Etherscan API or similar
      // For demo, simulate verification check
      const isVerified = Math.random() > 0.3; // 70% verification rate for demo
      
      if (!isVerified) {
        SecurityAudit.log('unverified_contract_detected', 'medium', { address });
      }
      
      return isVerified;
    } catch (error) {
      return false;
    }
  }

  private static analyzeABI(abi: any[]): { vulnerabilities: string[], recommendations: string[] } {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // Validate ABI structure
      const validationResult = contractABISchema.safeParse(abi);
      if (!validationResult.success) {
        vulnerabilities.push('Invalid ABI structure detected');
        return { vulnerabilities, recommendations };
      }

      const functions = abi.filter(item => item.type === 'function');
      const payableFunctions = functions.filter(fn => fn.stateMutability === 'payable');
      const externalFunctions = functions.filter(fn => 
        fn.name && !fn.name.startsWith('_') // Public functions (simplified check)
      );

      // Check for risky patterns
      if (payableFunctions.length > 10) {
        vulnerabilities.push('High number of payable functions');
        recommendations.push('Review all payable functions for proper access control');
      }

      if (externalFunctions.length > 50) {
        vulnerabilities.push('Large attack surface - many external functions');
        recommendations.push('Consider reducing public interface complexity');
      }

      // Check for missing access control patterns
      const hasAccessControl = functions.some(fn => 
        fn.name?.includes('onlyOwner') || 
        fn.name?.includes('onlyAdmin') ||
        fn.name?.includes('onlyRole')
      );

      if (!hasAccessControl && payableFunctions.length > 0) {
        vulnerabilities.push('No obvious access control mechanisms detected');
        recommendations.push('Implement proper access control for sensitive functions');
      }

      // Check for upgrade patterns
      const hasUpgradePattern = functions.some(fn => 
        fn.name?.includes('upgrade') || 
        fn.name?.includes('implementation')
      );

      if (hasUpgradePattern) {
        vulnerabilities.push('Upgradeable contract pattern detected');
        recommendations.push('Ensure upgrade mechanisms are properly secured');
      }

    } catch (error) {
      vulnerabilities.push('ABI analysis failed');
    }

    return { vulnerabilities, recommendations };
  }

  private static async analyzeBytecode(address: string): Promise<{ vulnerabilities: string[], recommendations: string[] }> {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];

    try {
      // In production, this would fetch and analyze actual bytecode
      // For demo, simulate common vulnerability patterns
      
      const simulatedVulnerabilities = [
        { pattern: 'reentrancy', probability: 0.1 },
        { pattern: 'integer_overflow', probability: 0.05 },
        { pattern: 'unchecked_external_call', probability: 0.15 },
        { pattern: 'timestamp_dependency', probability: 0.08 },
        { pattern: 'unsafe_delegatecall', probability: 0.03 },
      ];

      for (const vuln of simulatedVulnerabilities) {
        if (Math.random() < vuln.probability) {
          switch (vuln.pattern) {
            case 'reentrancy':
              vulnerabilities.push('Potential reentrancy vulnerability detected');
              recommendations.push('Use reentrancy guards and checks-effects-interactions pattern');
              break;
            case 'integer_overflow':
              vulnerabilities.push('Potential integer overflow/underflow');
              recommendations.push('Use SafeMath library or Solidity 0.8+ built-in protection');
              break;
            case 'unchecked_external_call':
              vulnerabilities.push('Unchecked external call detected');
              recommendations.push('Always check return values of external calls');
              break;
            case 'timestamp_dependency':
              vulnerabilities.push('Block timestamp dependency detected');
              recommendations.push('Avoid using block.timestamp for critical logic');
              break;
            case 'unsafe_delegatecall':
              vulnerabilities.push('Unsafe delegatecall usage detected');
              recommendations.push('Ensure delegatecall targets are trusted and validated');
              break;
          }
        }
      }

      // Simulate gas optimization issues
      if (Math.random() < 0.2) {
        vulnerabilities.push('Potential gas optimization issues');
        recommendations.push('Review function complexity and storage usage');
      }

    } catch (error) {
      vulnerabilities.push('Bytecode analysis failed');
    }

    return { vulnerabilities, recommendations };
  }

  private static calculateRiskMetrics(report: ContractSecurityReport): void {
    let score = 100;
    
    // Deduct points for each vulnerability
    score -= report.vulnerabilities.length * 15;
    
    // Deduct points for unverified contracts
    if (!report.verified) {
      score -= 25;
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk level
    if (score >= 80) {
      report.riskLevel = 'low';
    } else if (score >= 60) {
      report.riskLevel = 'medium';
    } else if (score >= 30) {
      report.riskLevel = 'high';
    } else {
      report.riskLevel = 'critical';
    }
    
    report.securityScore = score;
  }

  static async validateTransaction(transaction: any): Promise<TransactionSecurityCheck> {
    try {
      // Validate transaction structure
      const validationResult = transactionSchema.safeParse(transaction);
      if (!validationResult.success) {
        return {
          isSecure: false,
          risks: ['Invalid transaction format'],
          gasEstimate: '0x0',
          maxFeePerGas: '0x0',
          warnings: ['Transaction validation failed'],
        };
      }

      const risks: string[] = [];
      const warnings: string[] = [];

      // Check gas price
      const gasPrice = parseInt(transaction.gasPrice, 16);
      const gas = parseInt(transaction.gas, 16);
      
      if (gasPrice > 100 * 1e9) { // > 100 Gwei
        warnings.push('High gas price detected - transaction may be expensive');
      }
      
      if (gas > 500000) { // > 500k gas
        warnings.push('High gas limit - complex transaction detected');
      }

      // Check value
      const value = parseInt(transaction.value, 16);
      if (value > 1e18) { // > 1 ETH
        warnings.push('Large value transfer detected');
      }

      // Analyze contract interaction
      if (transaction.to && transaction.data && transaction.data !== '0x') {
        const contractReport = await this.analyzeContract(transaction.to);
        
        if (contractReport.riskLevel === 'critical') {
          risks.push('Interacting with high-risk contract');
        } else if (contractReport.riskLevel === 'high') {
          warnings.push('Interacting with medium-risk contract');
        }
        
        if (!contractReport.verified) {
          warnings.push('Contract is not verified');
        }
      }

      // Check for suspicious patterns in transaction data
      if (transaction.data && transaction.data.length > 10) {
        const suspiciousPatterns = [
          '0xa9059cbb', // transfer function selector
          '0x23b872dd', // transferFrom function selector
        ];
        
        for (const pattern of suspiciousPatterns) {
          if (transaction.data.startsWith(pattern)) {
            warnings.push('Token transfer detected - verify recipient address');
            break;
          }
        }
      }

      const isSecure = risks.length === 0;

      SecurityAudit.log('transaction_validated', isSecure ? 'low' : 'medium', {
        to: transaction.to,
        value: transaction.value,
        risks: risks.length,
        warnings: warnings.length,
      });

      return {
        isSecure,
        risks,
        gasEstimate: transaction.gas,
        maxFeePerGas: transaction.gasPrice,
        warnings,
      };

    } catch (error) {
      SecurityAudit.log('transaction_validation_failed', 'high', { error: error.message });
      
      return {
        isSecure: false,
        risks: ['Transaction validation failed'],
        gasEstimate: '0x0',
        maxFeePerGas: '0x0',
        warnings: ['Unable to validate transaction security'],
      };
    }
  }

  static addToBlacklist(address: string): void {
    this.contractBlacklist.add(address.toLowerCase());
    SecurityAudit.log('contract_blacklisted', 'high', { address });
  }

  static removeFromBlacklist(address: string): void {
    this.contractBlacklist.delete(address.toLowerCase());
    SecurityAudit.log('contract_removed_from_blacklist', 'medium', { address });
  }

  static isBlacklisted(address: string): boolean {
    return this.contractBlacklist.has(address.toLowerCase());
  }

  static getSecurityReport(): {
    totalAnalyzed: number;
    verifiedContracts: number;
    riskDistribution: Record<string, number>;
    topVulnerabilities: Array<{ type: string; count: number }>;
  } {
    const contracts = Array.from(this.verifiedContracts.values());
    const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
    const vulnerabilityCount = new Map<string, number>();

    contracts.forEach(contract => {
      riskDistribution[contract.riskLevel]++;
      
      contract.vulnerabilities.forEach(vuln => {
        vulnerabilityCount.set(vuln, (vulnerabilityCount.get(vuln) || 0) + 1);
      });
    });

    const topVulnerabilities = Array.from(vulnerabilityCount.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalAnalyzed: contracts.length,
      verifiedContracts: contracts.filter(c => c.verified).length,
      riskDistribution,
      topVulnerabilities,
    };
  }
}

// Security middleware for contract interactions
export function useContractSecurity() {
  const validateContractInteraction = async (contractAddress: string, abi?: any[]) => {
    const report = await ContractSecurityAnalyzer.analyzeContract(contractAddress, abi);
    
    if (report.riskLevel === 'critical') {
      throw new Error(`Critical security risk detected in contract ${contractAddress}`);
    }
    
    return report;
  };

  const validateTransactionSecurity = async (transaction: any) => {
    const check = await ContractSecurityAnalyzer.validateTransaction(transaction);
    
    if (!check.isSecure) {
      const errorMessage = `Transaction security validation failed: ${check.risks.join(', ')}`;
      throw new Error(errorMessage);
    }
    
    return check;
  };

  return {
    validateContractInteraction,
    validateTransactionSecurity,
    getSecurityReport: ContractSecurityAnalyzer.getSecurityReport,
    isBlacklisted: ContractSecurityAnalyzer.isBlacklisted,
  };
}

export default ContractSecurityAnalyzer;
