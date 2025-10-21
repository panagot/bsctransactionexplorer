import { ethers } from 'ethers';
import type { BSCTransactionExplanation, BSCTransaction, BSCTransactionReceipt, BalanceChange, FunctionCall, TokenTransfer, MEVAnalysis } from '@/types/transaction';
import { isDeFiProtocol, getTokenInfo } from './bscClient';

export async function parseBSCTransaction(transaction: BSCTransaction, receipt: BSCTransactionReceipt): Promise<BSCTransactionExplanation> {
  const valueInEth = parseFloat(ethers.formatEther(transaction.value));
  const gasFee = parseFloat(ethers.formatEther(BigInt(receipt.gasUsed) * BigInt(receipt.effectiveGasPrice)));
  
  // Determine transaction type
  const transactionType = determineTransactionType(transaction, receipt);
  
  // Generate summary
  const summary = generateSummary(transaction, receipt, transactionType, valueInEth);
  
  // Extract balance changes
  const balanceChanges = extractBalanceChanges(transaction, receipt);
  
  // Extract function calls
  const functionCalls = extractFunctionCalls(transaction, receipt);
  
  // Extract token transfers
  const tokenTransfers = await extractTokenTransfers(receipt);
  
  // Analyze for MEV
  const mevAnalysis = analyzeMEV(transaction, receipt);
  
  // Generate educational content
  const educationalContent = generateEducationalContent(transactionType, transaction, receipt);
  
  // Enhanced analysis
  const gasAnalysis = analyzeGasUsage(transaction, receipt);
  const protocolAnalysis = analyzeProtocol(transaction, receipt);
  const riskAnalysis = analyzeRisk(transaction, receipt);
  const networkImpact = analyzeNetworkImpact(transaction, receipt);
  
  return {
    hash: transaction.hash,
    from: transaction.from,
    to: transaction.to,
    value: transaction.value,
    valueInEth,
    gasFee,
    gasPrice: transaction.gasPrice.toString(),
    gasLimit: transaction.gasLimit.toString(),
    nonce: transaction.nonce,
    blockNumber: transaction.blockNumber,
    blockHash: transaction.blockHash,
    transactionIndex: transaction.transactionIndex,
    success: receipt.status === 1,
    transactionType,
    summary,
    timestamp: transaction.timestamp || Date.now(),
    educationalContent,
    balanceChanges,
    functionCalls,
    tokenTransfers,
    mevAnalysis,
    // Enhanced analysis
    gasAnalysis,
    protocolAnalysis,
    riskAnalysis,
    networkImpact
  };
}

function determineTransactionType(transaction: BSCTransaction, receipt: BSCTransactionReceipt): string {
  // Check if it's a simple BNB transfer
  if (transaction.value !== '0' && !transaction.data || transaction.data === '0x') {
    return 'BSC_TRANSFER';
  }
  
  // Check for DeFi protocol interactions
  const defiProtocol = isDeFiProtocol(transaction.to);
  if (defiProtocol) {
    if (defiProtocol.includes('PancakeSwap')) {
      return 'PANCAKESWAP';
    }
    if (defiProtocol.includes('SushiSwap')) {
      return 'SUSHISWAP';
    }
    if (defiProtocol.includes('Uniswap')) {
      return 'UNISWAP';
    }
    if (defiProtocol.includes('1inch')) {
      return '1INCH';
    }
    return 'DEX_SWAP';
  }
  
  // Check for token transfers in logs
  const hasTokenTransfers = receipt.logs.some(log => 
    log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' // Transfer event
  );
  
  if (hasTokenTransfers) {
    return 'TOKEN_TRANSFER';
  }
  
  // Check for staking operations
  if (transaction.data && (transaction.data.includes('0x2e1a7d4d') || transaction.data.includes('0x3ccfd60b'))) {
    return 'STAKING';
  }
  
  // Check for lending operations
  if (transaction.data && (transaction.data.includes('0xa0712d68') || transaction.data.includes('0x1249c58b'))) {
    return 'LENDING';
  }
  
  // Check for NFT transfers
  const hasNFTTransfers = receipt.logs.some(log => 
    log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' &&
    log.topics.length === 4 // ERC-721 Transfer event
  );
  
  if (hasNFTTransfers) {
    return 'NFT_TRANSFER';
  }
  
  // Check for bridge operations
  if (transaction.data && (transaction.data.includes('0x40c10f19') || transaction.data.includes('0x095ea7b3'))) {
    return 'BRIDGE';
  }
  
  return 'SMART_CONTRACT';
}

function generateSummary(transaction: BSCTransaction, receipt: BSCTransactionReceipt, type: string, valueInEth: number): string {
  const success = receipt.status === 1;
  const status = success ? 'successfully executed' : 'failed';
  
  switch (type) {
    case 'BSC_TRANSFER':
      return `This transaction ${status} a transfer of ${valueInEth.toFixed(4)} BNB from one address to another on the BSC network.`;
    
    case 'PANCAKESWAP':
      return `This transaction ${status} a token swap using PancakeSwap, the leading DEX on BSC. The transaction involved multiple token transfers and smart contract interactions.`;
    
    case 'DEX_SWAP':
      return `This transaction ${success ? 'successfully executed' : 'failed to execute'} a decentralized exchange swap on BSC. The transaction involved token exchanges through automated market maker protocols.`;
    
    case 'TOKEN_TRANSFER':
      return `This transaction ${status} a BEP-20 token transfer on the BSC network. The transaction involved moving tokens between addresses.`;
    
    case 'STAKING':
      return `This transaction ${status} a staking operation on BSC. The transaction involved locking BNB or tokens for network security and rewards.`;
    
    case 'LENDING':
      return `This transaction ${status} a lending protocol interaction on BSC. The transaction involved depositing or borrowing assets through DeFi lending platforms.`;
    
    case 'NFT_TRANSFER':
      return `This transaction ${status} an NFT transfer on BSC. The transaction involved moving non-fungible tokens between addresses.`;
    
    case 'BRIDGE':
      return `This transaction ${status} a cross-chain bridge operation. The transaction involved moving assets between BSC and other blockchains.`;
    
    default:
      return `This transaction ${status} a smart contract interaction on BSC. The transaction involved executing code on the blockchain.`;
  }
}

function extractBalanceChanges(transaction: BSCTransaction, _receipt: BSCTransactionReceipt): BalanceChange[] {
  const changes: BalanceChange[] = [];
  
  // Add BNB balance changes
  if (transaction.value !== '0') {
    changes.push({
      address: transaction.from,
      before: '0', // We don't have historical data
      after: '0',
      change: `-${ethers.formatEther(transaction.value)}`,
      token: 'BNB',
      type: 'BNB'
    });
    
    changes.push({
      address: transaction.to,
      before: '0',
      after: '0',
      change: `+${ethers.formatEther(transaction.value)}`,
      token: 'BNB',
      type: 'BNB'
    });
  }
  
  return changes;
}

function extractFunctionCalls(transaction: BSCTransaction, _receipt: BSCTransactionReceipt): FunctionCall[] {
  const calls: FunctionCall[] = [];
  
  if (transaction.data && transaction.data !== '0x') {
    calls.push({
      contract: transaction.to,
      method: 'Unknown Method',
      arguments: [],
      value: transaction.value
    });
  }
  
  return calls;
}

async function extractTokenTransfers(receipt: BSCTransactionReceipt): Promise<TokenTransfer[]> {
  const transfers: TokenTransfer[] = [];
  
  for (const log of receipt.logs) {
    // Check for ERC-20 Transfer events
    if (log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef') {
      try {
        const from = ethers.getAddress('0x' + log.topics[1].slice(26));
        const to = ethers.getAddress('0x' + log.topics[2].slice(26));
        const amount = BigInt(log.data);
        
        // Get token info
        const tokenInfo = await getTokenInfo(log.address);
        
        transfers.push({
          from,
          to,
          token: log.address,
          amount: amount.toString(),
          symbol: tokenInfo.symbol,
          decimals: tokenInfo.decimals
        });
      } catch (error) {
        console.error('Error parsing token transfer:', error);
      }
    }
  }
  
  return transfers;
}

function analyzeMEV(transaction: BSCTransaction, receipt: BSCTransactionReceipt): MEVAnalysis {
  // Simple MEV detection based on gas price and transaction patterns
  const gasPrice = parseFloat(ethers.formatUnits(transaction.gasPrice, 'gwei'));
  const isHighGasPrice = gasPrice > 10; // BSC typically has low gas prices
  
  // Check for sandwich attacks (simplified)
  const hasTokenTransfers = receipt.logs.some(log => 
    log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  );
  
  if (isHighGasPrice && hasTokenTransfers) {
    return {
      isMEV: true,
      mevType: 'Potential Sandwich Attack',
      description: 'High gas price with token transfers may indicate MEV activity',
      confidence: 0.7
    };
  }
  
  return {
    isMEV: false,
    confidence: 0.1
  };
}

function generateEducationalContent(type: string, _transaction: BSCTransaction, _receipt: BSCTransactionReceipt): string[] {
  const content: string[] = [];
  
  switch (type) {
    case 'BSC_TRANSFER':
      content.push('💡 BNB transfers are the most basic BSC transactions, moving native BNB tokens between accounts.');
      content.push('⚡ BSC uses a proof-of-stake consensus mechanism with ~3 second block times and ultra-low transaction fees.');
      content.push('🔗 BSC is EVM-compatible, meaning it can run Ethereum smart contracts with much lower costs.');
      content.push('🛡️ The network provides security through validator sets and cross-chain communication with other Binance chains.');
      break;
    
    case 'PANCAKESWAP':
      content.push('🥞 PancakeSwap is the leading DEX on BSC, offering token swaps with low fees and fast transactions.');
      content.push('🔄 Automated Market Makers (AMMs) use liquidity pools to enable token trading without order books.');
      content.push('💰 Liquidity providers earn fees by supplying tokens to trading pools.');
      content.push('📈 Price impact depends on trade size and available liquidity in the pool.');
      break;
    
    case 'DEX_SWAP':
      content.push('🔄 Decentralized exchanges allow peer-to-peer trading without intermediaries.');
      content.push('⚡ BSC&apos;s low fees make it ideal for frequent trading and DeFi activities.');
      content.push('🔒 Smart contracts handle the trading logic, ensuring trustless execution.');
      content.push('📊 Slippage protection helps prevent unfavorable price movements during trades.');
      break;
    
    case 'TOKEN_TRANSFER':
      content.push('🪙 BEP-20 tokens are the BSC equivalent of ERC-20 tokens on Ethereum.');
      content.push('💸 Token transfers are recorded as events in transaction logs, not in the transaction value.');
      content.push('🔍 You can track token movements by analyzing transaction logs and events.');
      content.push('🌐 BSC supports thousands of tokens, from stablecoins to governance tokens.');
      break;
    
    case 'STAKING':
      content.push('🥩 Staking involves locking BNB to secure the network and earn rewards.');
      content.push('🎯 Validators are chosen based on their stake and performance in the network.');
      content.push('💰 Staking rewards come from transaction fees and block rewards.');
      content.push('⏰ Staking periods and rewards vary depending on the specific staking mechanism.');
      break;
    
    case 'LENDING':
      content.push('🏦 DeFi lending allows users to earn interest on deposits or borrow against collateral.');
      content.push('💎 Collateralized lending reduces risk by requiring over-collateralization.');
      content.push('📊 Interest rates are determined algorithmically based on supply and demand.');
      content.push('🔄 Lending protocols enable capital efficiency in the DeFi ecosystem.');
      break;
    
    default:
      content.push('🔧 Smart contracts enable programmable money and automated financial services.');
      content.push('⚡ BSC&apos;s EVM compatibility allows developers to deploy Ethereum dApps with lower costs.');
      content.push('🌐 The BSC ecosystem includes DeFi, NFTs, gaming, and cross-chain applications.');
      content.push('🛡️ Security audits and community governance help maintain protocol integrity.');
  }
  
  return content;
}

// Enhanced analysis functions
function analyzeGasUsage(transaction: BSCTransaction, receipt: BSCTransactionReceipt) {
  const gasUsed = parseInt(receipt.gasUsed);
  const gasLimit = parseInt(transaction.gasLimit);
  const gasPrice = parseInt(transaction.gasPrice);
  const gasEfficiency = (gasUsed / gasLimit) * 100;
  const gasFee = parseFloat(ethers.formatEther(BigInt(gasUsed) * BigInt(gasPrice)));
  
  let efficiencyRating = 'Excellent';
  if (gasEfficiency < 50) efficiencyRating = 'Poor';
  else if (gasEfficiency < 70) efficiencyRating = 'Fair';
  else if (gasEfficiency < 90) efficiencyRating = 'Good';
  
  return {
    gasUsed,
    gasLimit,
    gasPrice,
    gasEfficiency: gasEfficiency.toFixed(1),
    gasFee,
    efficiencyRating,
    isOptimized: gasEfficiency > 80,
    recommendations: gasEfficiency < 70 ? [
      'Consider optimizing smart contract calls',
      'Review gas limit settings',
      'Check for unnecessary operations'
    ] : []
  };
}

function analyzeProtocol(transaction: BSCTransaction, receipt: BSCTransactionReceipt) {
  const protocol = isDeFiProtocol(transaction.to);
  const hasTokenTransfers = receipt.logs.some(log => 
    log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
  );
  
  let protocolType = 'Unknown';
  let riskLevel = 'Low';
  let features = [];
  
  if (protocol) {
    protocolType = protocol;
    riskLevel = 'Medium';
    features = ['DeFi Protocol', 'Smart Contract Interaction'];
  }
  
  if (hasTokenTransfers) {
    features.push('Token Transfer');
    if (riskLevel === 'Low') riskLevel = 'Medium';
  }
  
  if (transaction.value !== '0') {
    features.push('BNB Transfer');
  }
  
  return {
    protocol,
    protocolType,
    riskLevel,
    features,
    isDeFi: !!protocol,
    hasTokenActivity: hasTokenTransfers,
    complexity: features.length > 2 ? 'High' : features.length > 1 ? 'Medium' : 'Low'
  };
}

function analyzeRisk(transaction: BSCTransaction, receipt: BSCTransactionReceipt) {
  const risks = [];
  let riskScore = 0;
  
  // High value transaction risk
  const valueInEth = parseFloat(ethers.formatEther(transaction.value));
  if (valueInEth > 10) {
    risks.push('High value transaction');
    riskScore += 2;
  }
  
  // Gas price risk
  const gasPrice = parseInt(transaction.gasPrice);
  if (gasPrice > 10000000000) { // 10 Gwei
    risks.push('High gas price');
    riskScore += 1;
  }
  
  // MEV risk
  const mevAnalysis = analyzeMEV(transaction, receipt);
  if (mevAnalysis.isMEV) {
    risks.push('Potential MEV activity');
    riskScore += 3;
  }
  
  // Contract interaction risk
  if (transaction.data && transaction.data !== '0x') {
    risks.push('Smart contract interaction');
    riskScore += 1;
  }
  
  let riskLevel = 'Low';
  if (riskScore >= 5) riskLevel = 'High';
  else if (riskScore >= 3) riskLevel = 'Medium';
  
  return {
    risks,
    riskScore,
    riskLevel,
    recommendations: riskLevel === 'High' ? [
      'Review transaction details carefully',
      'Consider using a hardware wallet',
      'Verify contract addresses'
    ] : riskLevel === 'Medium' ? [
      'Double-check transaction parameters',
      'Ensure you trust the contract'
    ] : []
  };
}

function analyzeNetworkImpact(transaction: BSCTransaction, receipt: BSCTransactionReceipt) {
  const gasUsed = parseInt(receipt.gasUsed);
  const blockNumber = transaction.blockNumber;
  
  // Estimate network impact
  let impactLevel = 'Minimal';
  if (gasUsed > 500000) impactLevel = 'Moderate';
  if (gasUsed > 1000000) impactLevel = 'High';
  
  const networkStats = {
    gasContribution: gasUsed,
    blockContribution: (gasUsed / 1000000) * 100, // Assuming 1M gas per block
    impactLevel,
    isHighImpact: gasUsed > 500000,
    networkEfficiency: gasUsed < 100000 ? 'Efficient' : 'Standard'
  };
  
  return networkStats;
}
