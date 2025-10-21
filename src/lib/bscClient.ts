import { ethers } from 'ethers';

// BSCScan API configuration
const BSCSCAN_API_URL = 'https://api.bscscan.com/api';
const BSCSCAN_API_KEY = 'YourApiKeyToken'; // Get free API key from bscscan.com

// BSC Mainnet RPC endpoints (updated with working endpoints)
const BSC_RPC_URLS = [
  'https://bsc-dataseed1.bnbchain.org',
  'https://bsc-dataseed2.bnbchain.org', 
  'https://bsc-dataseed3.bnbchain.org',
  'https://bsc-dataseed4.bnbchain.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
  'https://bsc-dataseed1.defibit.io',
  'https://bsc-dataseed2.defibit.io',
  'https://bsc-dataseed3.defibit.io',
  'https://bsc-dataseed1.ninicoin.io',
  'https://bsc-dataseed2.ninicoin.io',
  'https://bsc-dataseed3.ninicoin.io',
];

// Create provider with fallback
const createProvider = () => {
  const providers = BSC_RPC_URLS.map(url => new ethers.JsonRpcProvider(url));
  return providers[0]; // Use first provider for now, can implement fallback later
};

const provider = createProvider();

// Test provider connection
async function _testProviderConnection(provider: ethers.JsonRpcProvider): Promise<boolean> {
  try {
    const network = await provider.getNetwork();
    return Number(network.chainId) === 56; // BSC chain ID
  } catch (error) {
    console.error('Provider connection test failed:', error);
    return false;
  }
}

// Popular BSC tokens
export const POPULAR_TOKENS = {
  '0x55d398326f99059ff775485246999027b3197955': { symbol: 'USDT', name: 'Tether USD', decimals: 18 },
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': { symbol: 'USDC', name: 'USD Coin', decimals: 18 },
  '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3': { symbol: 'DAI', name: 'Dai Stablecoin', decimals: 18 },
  '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82': { symbol: 'CAKE', name: 'PancakeSwap Token', decimals: 18 },
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': { symbol: 'WBNB', name: 'Wrapped BNB', decimals: 18 },
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8': { symbol: 'ETH', name: 'Ethereum Token', decimals: 18 },
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': { symbol: 'BTCB', name: 'Bitcoin BEP2', decimals: 18 },
};

// DeFi protocols on BSC
export const DEFI_PROTOCOLS = {
  '0x10ed43c718714eb63d5aa57b78b54704e256024e': 'PancakeSwap Router',
  '0x05fF2B0DB69458A0750badebc4f9e13aDd608C7F': 'PancakeSwap Router V1',
  '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506': 'SushiSwap Router',
  '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D': 'Uniswap V2 Router',
  '0xE592427A0AEce92De3Edee1F18E0157C05861564': 'Uniswap V3 Router',
  '0x1111111254fb6c44bac0bed2854e76f90643097d': '1inch Router',
  '0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640': 'Uniswap V3 Pool',
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45': 'Uniswap V3 Router',
};

export async function fetchTransactionDetails(txHash: string) {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) {
      throw new Error('Transaction not found');
    }
    
    // Convert to BSCTransaction format
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to || '',
      value: tx.value.toString(),
      gasPrice: tx.gasPrice?.toString() || '0',
      gasLimit: tx.gasLimit?.toString() || '0',
      nonce: tx.nonce,
      blockNumber: tx.blockNumber || 0,
      blockHash: tx.blockHash || '',
      transactionIndex: tx.index || 0,
      timestamp: Date.now(), // Use current time as fallback
      data: tx.data
    };
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

export async function fetchTransactionReceipt(txHash: string) {
  try {
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) {
      throw new Error('Transaction receipt not found');
    }
    
    // Convert to BSCTransactionReceipt format
    return {
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash,
      from: receipt.from,
      to: receipt.to || '',
      gasUsed: receipt.gasUsed.toString(),
      effectiveGasPrice: receipt.gasPrice?.toString() || '0',
      status: receipt.status || 0,
      logs: receipt.logs.map((log, index) => ({
        address: log.address,
        topics: [...log.topics],
        data: log.data,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        transactionIndex: log.transactionIndex,
        blockHash: log.blockHash,
        logIndex: index,
        removed: log.removed || false
      }))
    };
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    throw error;
  }
}

export async function fetchRecentTransactions(limit: number = 10): Promise<string[]> {
  try {
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber, true);
    
    if (!block || !block.transactions) {
      return [];
    }
    
    // Get the most recent transactions
    const recentTxs = block.transactions.slice(-limit);
    return recentTxs.map((tx: string | ethers.TransactionResponse) => 
      typeof tx === 'string' ? tx : tx.hash
    );
  } catch (error) {
    console.error('Error fetching recent transactions:', error);
    return [];
  }
}

export async function getTokenInfo(tokenAddress: string) {
  try {
    // Check if it's a popular token first
    if (POPULAR_TOKENS[tokenAddress as keyof typeof POPULAR_TOKENS]) {
      return POPULAR_TOKENS[tokenAddress as keyof typeof POPULAR_TOKENS];
    }
    
    // For other tokens, we would need to call the contract
    // This is a simplified version - in production you'd want to cache this
    return {
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      decimals: 18
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return {
      symbol: 'UNKNOWN',
      name: 'Unknown Token',
      decimals: 18
    };
  }
}

export async function getBlockInfo(blockNumber: number) {
  try {
    const block = await provider.getBlock(blockNumber);
    return block;
  } catch (error) {
    console.error('Error fetching block info:', error);
    return null;
  }
}

export function isDeFiProtocol(address: string): string | null {
  return DEFI_PROTOCOLS[address as keyof typeof DEFI_PROTOCOLS] || null;
}

export function getNetworkInfo() {
  return {
    name: 'BSC Mainnet',
    chainId: 56,
    rpcUrl: BSC_RPC_URLS[0],
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  };
}

// BSCScan API functions
async function fetchFromBSCScan(endpoint: string, params: Record<string, string> = {}) {
  const url = new URL(BSCSCAN_API_URL);
  url.searchParams.set('module', endpoint);
  
  // Only add API key if we have one
  if (BSCSCAN_API_KEY && BSCSCAN_API_KEY !== 'YourApiKeyToken') {
    url.searchParams.set('apikey', BSCSCAN_API_KEY);
  }
  
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });
  
  console.log('BSCScan API call:', url.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'BSC-Explorer/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.status !== '1') {
    throw new Error(`BSCScan API error: ${data.message || 'Unknown error'}`);
  }
  
  return data.result;
}

export async function getNetworkStats() {
  try {
    console.log('🔍 Fetching BSC network stats from BSCScan API...');
    
    // Fetch current block number from BSCScan
    const blockNumberHex = await fetchFromBSCScan('proxy', {
      action: 'eth_blockNumber'
    });
    const blockNumber = parseInt(blockNumberHex, 16);
    
    // Fetch gas price from BSCScan
    const gasPriceHex = await fetchFromBSCScan('proxy', {
      action: 'eth_gasPrice'
    });
    const gasPriceWei = parseInt(gasPriceHex, 16);
    const gasPriceInGwei = parseFloat(ethers.formatUnits(gasPriceWei, 'gwei'));
    
    console.log('✅ BSC Network Stats from BSCScan:', { 
      blockNumber, 
      gasPrice: gasPriceInGwei 
    });
    
    return {
      blockNumber,
      gasPrice: gasPriceInGwei.toFixed(2),
      averageBlockTime: 3, // BSC has ~3 second block time
      totalTransactions: Math.floor(Math.random() * 100000) + 2000000 // Mock daily transactions
    };
  } catch (error) {
    console.error('❌ Error fetching network stats from BSCScan:', error);
    console.log('🔄 Falling back to RPC calls...');
    
    try {
      // Fallback to RPC calls
      const blockNumber = await provider.getBlockNumber();
      
      let gasPriceInGwei = 3.5; // Default BSC gas price
      try {
        const feeData = await provider.getFeeData();
        if (feeData.gasPrice) {
          gasPriceInGwei = parseFloat(ethers.formatUnits(feeData.gasPrice, 'gwei'));
        }
      } catch (gasError) {
        console.log('⚠️ Gas price not available from RPC, using default:', gasError instanceof Error ? gasError.message : String(gasError));
      }
      
      console.log('✅ BSC Network Stats from RPC:', { 
        blockNumber, 
        gasPrice: gasPriceInGwei 
      });
      
      return {
        blockNumber,
        gasPrice: gasPriceInGwei.toFixed(2),
        averageBlockTime: 3,
        totalTransactions: Math.floor(Math.random() * 100000) + 2000000
      };
    } catch (rpcError) {
      console.error('❌ RPC fallback also failed:', rpcError);
      console.log('⚠️ Using static fallback data...');
      
      // Static fallback with current BSC block number
      console.log('Using static fallback with current BSC block number...');
      
      return {
        blockNumber: 65439400, // Current BSC block number (updated)
        gasPrice: '3.50',
        averageBlockTime: 3,
        totalTransactions: 2500000
      };
    }
  }
}
