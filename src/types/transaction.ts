export interface BSCTransactionExplanation {
  hash: string;
  from: string;
  to: string;
  value: string;
  valueInEth: number;
  gasFee: number;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  success: boolean;
  transactionType: string;
  summary: string;
  timestamp: number;
  educationalContent: string[];
  balanceChanges: BalanceChange[];
  functionCalls: FunctionCall[];
  tokenTransfers: TokenTransfer[];
  mevAnalysis?: MEVAnalysis;
  // Enhanced analysis
  gasAnalysis?: GasAnalysis;
  protocolAnalysis?: ProtocolAnalysis;
  riskAnalysis?: RiskAnalysis;
  networkImpact?: NetworkImpact;
}

export interface BalanceChange {
  address: string;
  before: string;
  after: string;
  change: string;
  token: string;
  type: 'BNB' | 'BEP20';
}

export interface FunctionCall {
  contract: string;
  method: string;
  arguments: unknown[];
  value: string;
}

export interface TokenTransfer {
  from: string;
  to: string;
  token: string;
  amount: string;
  symbol: string;
  decimals: number;
}

export interface MEVAnalysis {
  isMEV: boolean;
  mevType?: string;
  profit?: string;
  description?: string;
  confidence: number;
}

// Enhanced analysis interfaces
export interface GasAnalysis {
  gasUsed: number;
  gasLimit: number;
  gasPrice: number;
  gasEfficiency: string;
  gasFee: number;
  efficiencyRating: string;
  isOptimized: boolean;
  recommendations: string[];
}

export interface ProtocolAnalysis {
  protocol?: string;
  protocolType: string;
  riskLevel: string;
  features: string[];
  isDeFi: boolean;
  hasTokenActivity: boolean;
  complexity: string;
}

export interface RiskAnalysis {
  risks: string[];
  riskScore: number;
  riskLevel: string;
  recommendations: string[];
}

export interface NetworkImpact {
  gasContribution: number;
  blockContribution: number;
  impactLevel: string;
  isHighImpact: boolean;
  networkEfficiency: string;
}

export interface BSCTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasPrice: string;
  gasLimit: string;
  nonce: number;
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  timestamp?: number;
  data?: string;
}

export interface BSCTransactionReceipt {
  transactionHash: string;
  blockNumber: number;
  blockHash: string;
  from: string;
  to: string;
  gasUsed: string;
  effectiveGasPrice: string;
  status: number;
  logs: Log[];
}

export interface Log {
  address: string;
  topics: readonly string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
}
