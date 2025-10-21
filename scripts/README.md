# BSC Monitoring Scripts

This directory contains scripts to monitor and test the BSC (Binance Smart Chain) network connectivity and data fetching.

## Scripts

### 1. `monitor-bsc.js` - Real-time BSC Network Monitor

Monitors BSC network health, block updates, and transaction detection in real-time.

**Usage:**
```bash
npm run monitor
```

**Features:**
- Tests all BSC RPC endpoints
- Monitors new blocks every 3 seconds
- Tracks transaction counts and gas usage
- Provides real-time statistics
- Graceful shutdown with Ctrl+C

**Output:**
- ✅ Provider connection status
- 📦 Block information with transaction counts
- 📊 Statistics every 30 seconds
- 🆕 New block notifications

### 2. `test-bsc-connection.js` - BSC Connection Test

Tests BSC network connectivity and data fetching capabilities.

**Usage:**
```bash
npm run test-bsc
```

**Tests:**
- RPC endpoint connectivity
- Network chain ID verification (BSC = 56)
- Current block number fetching
- Gas price retrieval
- Recent block transaction analysis
- BSCScan API connectivity

**Output:**
- ✅/❌ Test results for each endpoint
- 📊 Overall success rate
- 🎉/⚠️/❌ Final status assessment

## Troubleshooting

### Common Issues

1. **"No BSC providers available"**
   - Check internet connection
   - Verify BSC network is operational
   - Try different RPC endpoints

2. **"BSCScan API error"**
   - BSCScan API might be rate-limited
   - Check if BSCScan is operational
   - Consider getting a free API key

3. **"Provider connection failed"**
   - RPC endpoint might be down
   - Network connectivity issues
   - Try running the test script first

### Getting BSCScan API Key

1. Visit [bscscan.com](https://bscscan.com)
2. Create a free account
3. Go to API-KEYs section
4. Generate a new API key
5. Update `BSCSCAN_API_KEY` in `src/lib/bscClient.ts`

### RPC Endpoints

The scripts use multiple BSC RPC endpoints for redundancy:
- `bsc-dataseed1.bnbchain.org`
- `bsc-dataseed2.bnbchain.org`
- `bsc-dataseed3.bnbchain.org`
- `bsc-dataseed4.bnbchain.org`
- `bsc-dataseed1.binance.org`
- `bsc-dataseed2.binance.org`
- `bsc-dataseed3.binance.org`
- `bsc-dataseed4.binance.org`

## Monitoring Best Practices

1. **Run tests before deployment**
   ```bash
   npm run test-bsc
   ```

2. **Monitor during development**
   ```bash
   npm run monitor
   ```

3. **Check logs for errors**
   - Look for ❌ error messages
   - Monitor success rates
   - Verify block numbers are updating

4. **Verify BSC data accuracy**
   - Compare with [bscscan.com](https://bscscan.com)
   - Check block numbers match
   - Verify gas prices are reasonable

## Integration with Explorer

These scripts help ensure the BSC Explorer is working correctly:

1. **Network Stats Component** - Uses the same RPC endpoints
2. **Transaction Fetching** - Tests transaction retrieval
3. **Real-time Updates** - Verifies data freshness
4. **Error Handling** - Identifies connection issues

## Support

If you encounter issues:

1. Run the test script first: `npm run test-bsc`
2. Check the monitor output: `npm run monitor`
3. Verify BSC network status on [bscscan.com](https://bscscan.com)
4. Check your internet connection
5. Try different RPC endpoints if needed
