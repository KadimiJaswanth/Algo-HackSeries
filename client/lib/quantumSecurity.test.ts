/**
 * Simple test to verify quantum security imports work correctly
 */

// Test that we can import the quantum security module without errors
import { 
  QuantumSecurityManager, 
  PQCAlgorithm, 
  QuantumSecurityLevel,
  useQuantumSecurity 
} from './quantumSecurity';

// Test basic functionality
export function testQuantumSecurityImports(): boolean {
  try {
    // Test enum access
    const algorithm = PQCAlgorithm.ML_DSA_65;
    const securityLevel = QuantumSecurityLevel.LEVEL_3;
    
    // Test manager instantiation
    const manager = QuantumSecurityManager.getInstance();
    
    // Test hook availability
    const hook = useQuantumSecurity;
    
    console.log('✅ Quantum security imports working correctly');
    console.log('Available algorithms:', Object.values(PQCAlgorithm));
    console.log('Security levels:', Object.values(QuantumSecurityLevel));
    
    return true;
  } catch (error) {
    console.error('❌ Quantum security import test failed:', error);
    return false;
  }
}

// Auto-run test in development
if (typeof window !== 'undefined' && import.meta.hot) {
  testQuantumSecurityImports();
}
