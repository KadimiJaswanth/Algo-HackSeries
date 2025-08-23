import { z } from "zod";
import CryptoJS from "crypto-js";

// Input Validation Schemas
export const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");
export const amountSchema = z.number().positive().max(1000000, "Amount too large");
export const coordinateSchema = z.number().min(-180).max(180);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number");
export const emailSchema = z.string().email("Invalid email address");

// Rate Limiting
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const validRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(identifier, validRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }
}

// XSS Protection
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .replace(/script/gi, '')
    .trim();
}

export function sanitizeHtml(html: string): string {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// CSRF Protection
export function generateCSRFToken(): string {
  return CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
}

export function validateCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken && token.length === 32;
}

// Encryption Utilities
export class SecurityManager {
  private static instance: SecurityManager;
  private encryptionKey: string;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.encryptionKey = this.generateEncryptionKey();
    this.rateLimiter = new RateLimiter();
  }

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private generateEncryptionKey(): string {
    return CryptoJS.lib.WordArray.random(256/8).toString(CryptoJS.enc.Hex);
  }

  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.encryptionKey).toString();
  }

  decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  hash(data: string): string {
    return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
  }

  checkRateLimit(identifier: string): boolean {
    return this.rateLimiter.isAllowed(identifier);
  }

  resetRateLimit(identifier: string): void {
    this.rateLimiter.reset(identifier);
  }
}

// Web3 Security Utilities
export class Web3Security {
  static validateSignature(message: string, signature: string, expectedAddress: string): boolean {
    try {
      // This would use ethers.js in a real implementation
      // For now, we'll do basic validation
      return signature.length === 132 && signature.startsWith('0x');
    } catch (error) {
      console.error('Signature validation failed:', error);
      return false;
    }
  }

  static validateTransaction(transaction: any): boolean {
    if (!transaction || typeof transaction !== 'object') return false;
    
    const requiredFields = ['to', 'value', 'gas', 'gasPrice'];
    return requiredFields.every(field => transaction.hasOwnProperty(field));
  }

  static sanitizeTransactionData(data: any): any {
    if (!data || typeof data !== 'object') return {};
    
    return {
      to: addressSchema.safeParse(data.to).success ? data.to : null,
      value: amountSchema.safeParse(Number(data.value)).success ? data.value : null,
      gas: data.gas && Number(data.gas) > 0 ? data.gas : null,
      gasPrice: data.gasPrice && Number(data.gasPrice) > 0 ? data.gasPrice : null,
    };
  }
}

// Security Headers
export const securityHeaders = {
  'Content-Security-Policy': 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https: wss:; " +
    "frame-ancestors 'none';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};

// Audit Logging
export class SecurityAudit {
  private static logs: Array<{
    timestamp: number;
    event: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    details: any;
    userAgent?: string;
    ip?: string;
  }> = [];

  static log(event: string, severity: 'low' | 'medium' | 'high' | 'critical', details: any = {}) {
    this.logs.push({
      timestamp: Date.now(),
      event,
      severity,
      details,
      userAgent: navigator?.userAgent,
      ip: 'masked', // In production, get from server
    });

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Alert on critical events
    if (severity === 'critical') {
      console.error('CRITICAL SECURITY EVENT:', event, details);
      // In production, send to monitoring service
    }
  }

  static getLogs() {
    return [...this.logs];
  }

  static getSecurityMetrics() {
    const last24h = Date.now() - 24 * 60 * 60 * 1000;
    const recentLogs = this.logs.filter(log => log.timestamp > last24h);
    
    return {
      totalEvents: recentLogs.length,
      criticalEvents: recentLogs.filter(log => log.severity === 'critical').length,
      highSeverityEvents: recentLogs.filter(log => log.severity === 'high').length,
      mediumSeverityEvents: recentLogs.filter(log => log.severity === 'medium').length,
      lowSeverityEvents: recentLogs.filter(log => log.severity === 'low').length,
    };
  }
}

// Session Security
export class SessionManager {
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private static sessionStart: number = Date.now();
  private static isActive: boolean = true;

  static isSessionValid(): boolean {
    const now = Date.now();
    return this.isActive && (now - this.sessionStart) < this.SESSION_TIMEOUT;
  }

  static refreshSession(): void {
    if (this.isSessionValid()) {
      this.sessionStart = Date.now();
    }
  }

  static invalidateSession(): void {
    this.isActive = false;
    SecurityAudit.log('session_invalidated', 'medium', { reason: 'manual' });
  }

  static getTimeRemaining(): number {
    if (!this.isActive) return 0;
    const elapsed = Date.now() - this.sessionStart;
    return Math.max(0, this.SESSION_TIMEOUT - elapsed);
  }
}

// Privacy Protection
export class PrivacyManager {
  static maskSensitiveData(data: string, type: 'email' | 'phone' | 'address' | 'wallet'): string {
    switch (type) {
      case 'email':
        const [localPart, domain] = data.split('@');
        return `${localPart.slice(0, 2)}***@${domain}`;
      case 'phone':
        return data.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2');
      case 'address':
        return data.length > 20 ? `${data.slice(0, 10)}...${data.slice(-10)}` : data;
      case 'wallet':
        return `${data.slice(0, 6)}...${data.slice(-4)}`;
      default:
        return data;
    }
  }

  static generateAnonymousId(): string {
    return 'anon_' + CryptoJS.lib.WordArray.random(64/8).toString(CryptoJS.enc.Hex);
  }
}

// Security Hook for React Components
export function useSecurityMonitoring() {
  const securityManager = SecurityManager.getInstance();
  
  const checkSecurity = () => {
    // Check session validity
    if (!SessionManager.isSessionValid()) {
      SecurityAudit.log('session_expired', 'medium');
      return false;
    }
    
    // Check for suspicious activity
    const metrics = SecurityAudit.getSecurityMetrics();
    if (metrics.criticalEvents > 5) {
      SecurityAudit.log('too_many_critical_events', 'critical', metrics);
      return false;
    }
    
    return true;
  };

  const reportSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', details?: any) => {
    SecurityAudit.log(event, severity, details);
  };

  return {
    checkSecurity,
    reportSecurityEvent,
    securityManager,
    sessionTimeRemaining: SessionManager.getTimeRemaining(),
  };
}

export default SecurityManager;
