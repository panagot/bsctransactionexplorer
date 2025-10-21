'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, Users, Zap } from 'lucide-react';
import { getNetworkStats } from '@/lib/bscClient';

interface NetworkStats {
  blockNumber: number;
  gasPrice: string;
  networkHashRate: string;
  difficulty: string;
  totalTransactions: number;
  averageBlockTime: number;
}

export default function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real BSC network stats
        const networkStats = await getNetworkStats();
        
        const stats: NetworkStats = {
          blockNumber: networkStats.blockNumber,
          gasPrice: networkStats.gasPrice,
          networkHashRate: '0', // BSC uses PoS, not PoW
          difficulty: '0', // BSC uses PoS, not PoW
          totalTransactions: networkStats.totalTransactions,
          averageBlockTime: networkStats.averageBlockTime
        };
        
        setStats(stats);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Error fetching network stats:', error);
        // Fallback to mock data
        const mockStats: NetworkStats = {
          blockNumber: 38500000,
          gasPrice: '3.5',
          networkHashRate: '0',
          difficulty: '0',
          totalTransactions: 2500000,
          averageBlockTime: 3
        };
        setStats(mockStats);
        setLastUpdated(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Update stats every 10 seconds for more responsive updates
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 animate-pulse">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">Unable to load network statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Last Updated Indicator */}
      {lastUpdated && (
        <div className="text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Block */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Current Block</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
          {stats.blockNumber.toLocaleString()}
        </p>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
          Latest block on BSC
        </p>
      </div>

      {/* Gas Price */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-4 border border-green-200 dark:border-green-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Gas Price</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-green-900 dark:text-green-100">
          {stats.gasPrice}
        </p>
        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
          Ultra-low fees on BSC
        </p>
      </div>

      {/* Block Time */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Block Time</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
          {stats.averageBlockTime}s
        </p>
        <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
          Fast finality on BSC
        </p>
      </div>

      {/* Total Transactions */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl p-4 border border-orange-200 dark:border-orange-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Daily Txs</p>
          </div>
        </div>
        <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
          {stats.totalTransactions.toLocaleString()}
        </p>
        <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
          High throughput network
        </p>
      </div>
      </div>
    </div>
  );
}
