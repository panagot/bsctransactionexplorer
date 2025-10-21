#!/usr/bin/env node

/**
 * BSC Connection Test Script
 * Tests BSC network connectivity and data fetching
 */

const { ethers } = require('ethers');

// BSC RPC endpoints
const BSC_RPC_URLS = [
  'https://bsc-dataseed1.bnbchain.org',
  'https://bsc-dataseed2.bnbchain.org', 
  'https://bsc-dataseed3.bnbchain.org',
  'https://bsc-dataseed4.bnbchain.org',
];

async function testBSCConnection() {
  console.log('🧪 Testing BSC Network Connection...\n');
  
  let successCount = 0;
  let totalTests = 0;

  // Test each RPC endpoint
  for (let i = 0; i < BSC_RPC_URLS.length; i++) {
    const url = BSC_RPC_URLS[i];
    console.log(`🔍 Testing RPC ${i + 1}: ${url}`);
    
    try {
      const provider = new ethers.JsonRpcProvider(url);
      
      // Test 1: Network connection
      totalTests++;
      const network = await provider.getNetwork();
      const isBSC = Number(network.chainId) === 56;
      console.log(`   ✅ Network: Chain ID ${network.chainId} ${isBSC ? '(BSC)' : '(NOT BSC)'}`);
      if (isBSC) successCount++;
      
      // Test 2: Block number
      totalTests++;
      const blockNumber = await provider.getBlockNumber();
      console.log(`   ✅ Current block: ${blockNumber.toLocaleString()}`);
      successCount++;
      
      // Test 3: Gas price
      totalTests++;
      try {
        const gasPrice = await provider.getGasPrice();
        const gasPriceGwei = parseFloat(ethers.formatUnits(gasPrice, 'gwei'));
        console.log(`   ✅ Gas price: ${gasPriceGwei.toFixed(2)} Gwei`);
        successCount++;
      } catch (gasError) {
        console.log(`   ⚠️  Gas price: Not available (${gasError.message})`);
        // Don't count as failure since some RPCs don't support this
      }
      
      // Test 4: Recent block
      totalTests++;
      const block = await provider.getBlock(blockNumber, true);
      const txCount = block.transactions ? block.transactions.length : 0;
      console.log(`   ✅ Latest block: ${txCount} transactions`);
      successCount++;
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }

  // Test BSCScan API
  console.log('🔍 Testing BSCScan API...');
  try {
    totalTests++;
    const response = await fetch('https://api.bscscan.com/api?module=proxy&action=eth_blockNumber', {
      headers: {
        'User-Agent': 'BSC-Explorer/1.0'
      }
    });
    const data = await response.json();
    
    if (data.status === '1') {
      const blockNumber = parseInt(data.result, 16);
      console.log(`   ✅ BSCScan API: Block ${blockNumber.toLocaleString()}`);
      successCount++;
    } else {
      console.log(`   ⚠️  BSCScan API: ${data.message || 'Rate limited or unavailable'}`);
      // Don't count as failure since API might be rate limited
    }
  } catch (error) {
    console.log(`   ⚠️  BSCScan API: ${error.message}`);
    // Don't count as failure since API might be unavailable
  }

  // Summary
  console.log('\n📊 Test Results:');
  console.log(`   Tests passed: ${successCount}/${totalTests}`);
  console.log(`   Success rate: ${((successCount / totalTests) * 100).toFixed(1)}%`);
  
  if (successCount === totalTests) {
    console.log('🎉 All tests passed! BSC connection is working perfectly.');
  } else if (successCount > totalTests / 2) {
    console.log('⚠️  Some tests failed, but BSC connection is partially working.');
  } else {
    console.log('❌ Most tests failed. Check your internet connection and BSC network status.');
  }
}

// Run the test
if (require.main === module) {
  testBSCConnection().catch(console.error);
}

module.exports = testBSCConnection;
