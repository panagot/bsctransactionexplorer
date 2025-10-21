#!/usr/bin/env node

/**
 * BSC Network Monitor Script
 * Monitors BSC network health, block updates, and transaction detection
 */

const { ethers } = require('ethers');

// BSC RPC endpoints
const BSC_RPC_URLS = [
  'https://bsc-dataseed1.bnbchain.org',
  'https://bsc-dataseed2.bnbchain.org', 
  'https://bsc-dataseed3.bnbchain.org',
  'https://bsc-dataseed4.bnbchain.org',
  'https://bsc-dataseed1.binance.org',
  'https://bsc-dataseed2.binance.org',
  'https://bsc-dataseed3.binance.org',
  'https://bsc-dataseed4.binance.org',
];

// BSCScan API configuration
const BSCSCAN_API_URL = 'https://api.bscscan.com/api';

class BSCMonitor {
  constructor() {
    this.providers = BSC_RPC_URLS.map(url => new ethers.JsonRpcProvider(url));
    this.currentProvider = 0;
    this.lastBlockNumber = 0;
    this.startTime = Date.now();
    this.stats = {
      blocksChecked: 0,
      transactionsFound: 0,
      errors: 0,
      lastUpdate: null
    };
  }

  async testProviderConnection(provider) {
    try {
      const network = await provider.getNetwork();
      const isBSC = Number(network.chainId) === 56;
      console.log(`✅ Provider connected: Chain ID ${network.chainId} ${isBSC ? '(BSC)' : '(NOT BSC)'}`);
      return isBSC;
    } catch (error) {
      console.log(`❌ Provider connection failed: ${error.message}`);
      return false;
    }
  }

  async getCurrentProvider() {
    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const isConnected = await this.testProviderConnection(provider);
      if (isConnected) {
        this.currentProvider = i;
        return provider;
      }
    }
    throw new Error('No BSC providers available');
  }

  async fetchFromBSCScan(endpoint, params = {}) {
    const url = new URL(BSCSCAN_API_URL);
    url.searchParams.set('module', endpoint);
    
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data.status !== '1') {
      throw new Error(`BSCScan API error: ${data.message}`);
    }
    
    return data.result;
  }

  async getBSCScanBlockNumber() {
    try {
      const blockNumberHex = await this.fetchFromBSCScan('proxy', {
        action: 'eth_blockNumber'
      });
      return parseInt(blockNumberHex, 16);
    } catch (error) {
      console.log(`❌ BSCScan API error: ${error.message}`);
      return null;
    }
  }

  async getBSCScanGasPrice() {
    try {
      const gasPriceHex = await this.fetchFromBSCScan('proxy', {
        action: 'eth_gasPrice'
      });
      const gasPriceWei = parseInt(gasPriceHex, 16);
      return parseFloat(ethers.formatUnits(gasPriceWei, 'gwei'));
    } catch (error) {
      console.log(`❌ BSCScan gas price error: ${error.message}`);
      return null;
    }
  }

  async checkBlock(blockNumber) {
    try {
      const provider = await this.getCurrentProvider();
      const block = await provider.getBlock(blockNumber, true);
      
      if (!block) {
        console.log(`❌ Block ${blockNumber} not found`);
        return null;
      }

      const txCount = block.transactions ? block.transactions.length : 0;
      console.log(`📦 Block ${blockNumber}: ${txCount} transactions, ${block.gasUsed} gas used`);
      
      this.stats.blocksChecked++;
      this.stats.transactionsFound += txCount;
      
      return {
        blockNumber,
        txCount,
        gasUsed: block.gasUsed.toString(),
        timestamp: new Date(block.timestamp * 1000).toISOString()
      };
    } catch (error) {
      console.log(`❌ Error checking block ${blockNumber}: ${error.message}`);
      this.stats.errors++;
      return null;
    }
  }

  async monitorNetwork() {
    console.log('🚀 Starting BSC Network Monitor...\n');
    
    try {
      // Test all providers
      console.log('🔍 Testing BSC providers...');
      for (let i = 0; i < this.providers.length; i++) {
        await this.testProviderConnection(this.providers[i]);
      }
      console.log('');

      // Get current block from BSCScan
      console.log('📊 Fetching current block from BSCScan...');
      const bscScanBlock = await this.getBSCScanBlockNumber();
      if (bscScanBlock) {
        console.log(`✅ BSCScan current block: ${bscScanBlock.toLocaleString()}`);
      }

      // Get current block from RPC
      const provider = await this.getCurrentProvider();
      const rpcBlock = await provider.getBlockNumber();
      console.log(`✅ RPC current block: ${rpcBlock.toLocaleString()}`);

      // Get gas price
      const gasPrice = await provider.getGasPrice();
      const gasPriceGwei = parseFloat(ethers.formatUnits(gasPrice, 'gwei'));
      console.log(`⛽ Current gas price: ${gasPriceGwei.toFixed(2)} Gwei`);

      // Check recent blocks
      console.log('\n🔍 Checking recent blocks...');
      const startBlock = Math.max(rpcBlock - 5, 0);
      for (let i = startBlock; i <= rpcBlock; i++) {
        await this.checkBlock(i);
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
      }

      // Monitor new blocks
      console.log('\n👀 Monitoring new blocks (press Ctrl+C to stop)...');
      this.lastBlockNumber = rpcBlock;
      
      const monitorInterval = setInterval(async () => {
        try {
          const currentBlock = await provider.getBlockNumber();
          if (currentBlock > this.lastBlockNumber) {
            console.log(`\n🆕 New block detected: ${currentBlock.toLocaleString()}`);
            await this.checkBlock(currentBlock);
            this.lastBlockNumber = currentBlock;
          }
        } catch (error) {
          console.log(`❌ Monitor error: ${error.message}`);
          this.stats.errors++;
        }
      }, 3000); // Check every 3 seconds

      // Print stats every 30 seconds
      const statsInterval = setInterval(() => {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        console.log(`\n📊 Stats (${uptime}s uptime):`);
        console.log(`   Blocks checked: ${this.stats.blocksChecked}`);
        console.log(`   Transactions found: ${this.stats.transactionsFound}`);
        console.log(`   Errors: ${this.stats.errors}`);
        console.log(`   Current block: ${this.lastBlockNumber.toLocaleString()}`);
      }, 30000);

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down monitor...');
        clearInterval(monitorInterval);
        clearInterval(statsInterval);
        
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        console.log('\n📊 Final Stats:');
        console.log(`   Uptime: ${uptime} seconds`);
        console.log(`   Blocks checked: ${this.stats.blocksChecked}`);
        console.log(`   Transactions found: ${this.stats.transactionsFound}`);
        console.log(`   Errors: ${this.stats.errors}`);
        console.log('👋 Monitor stopped.');
        process.exit(0);
      });

    } catch (error) {
      console.error(`❌ Monitor failed: ${error.message}`);
      process.exit(1);
    }
  }
}

// Run the monitor
if (require.main === module) {
  const monitor = new BSCMonitor();
  monitor.monitorNetwork().catch(console.error);
}

module.exports = BSCMonitor;
