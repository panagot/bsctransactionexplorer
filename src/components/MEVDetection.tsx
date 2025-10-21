'use client';

import { AlertTriangle, Shield, TrendingUp, Info } from 'lucide-react';
import type { BSCTransactionExplanation } from '@/types/transaction';

interface MEVDetectionProps {
  transaction: BSCTransactionExplanation;
}

export default function MEVDetection({ transaction }: MEVDetectionProps) {
  const mevAnalysis = transaction.mevAnalysis;
  
  if (!mevAnalysis || !mevAnalysis.isMEV) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm">
            🛡️
          </div>
          MEV Analysis
        </h3>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h4 className="font-semibold text-green-800 dark:text-green-200">
              No MEV Detected
            </h4>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
            This transaction appears to be a normal user transaction without any MEV (Maximal Extractable Value) activity. 
            The transaction was executed at a reasonable gas price and doesn&apos;t show signs of front-running or sandwich attacks.
          </p>
        </div>
        
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
          <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            What is MEV?
          </h5>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            MEV (Maximal Extractable Value) refers to the maximum value that can be extracted from block production 
            in excess of the standard block reward and gas fees. This can include front-running, back-running, 
            and sandwich attacks on DEX transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white text-sm">
          ⚠️
        </div>
        MEV Analysis
      </h3>
      
      <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h4 className="font-semibold text-orange-800 dark:text-orange-200">
            Potential MEV Activity Detected
          </h4>
        </div>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">MEV Type:</span>
            <span className="ml-2 text-sm text-orange-800 dark:text-orange-200">
              {mevAnalysis.mevType || 'Unknown'}
            </span>
          </div>
          
          <div>
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Confidence:</span>
            <span className="ml-2 text-sm text-orange-800 dark:text-orange-200">
              {Math.round(mevAnalysis.confidence * 100)}%
            </span>
          </div>
          
          {mevAnalysis.profit && (
            <div>
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Estimated Profit:</span>
              <span className="ml-2 text-sm text-orange-800 dark:text-orange-200">
                {mevAnalysis.profit} BNB
              </span>
            </div>
          )}
        </div>
        
        {mevAnalysis.description && (
          <p className="text-orange-700 dark:text-orange-300 text-sm leading-relaxed mt-3">
            {mevAnalysis.description}
          </p>
        )}
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
          <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            MEV Indicators
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• High gas price relative to network average</li>
            <li>• Multiple token transfers in single transaction</li>
            <li>• Complex smart contract interactions</li>
            <li>• Timing patterns suggesting front-running</li>
          </ul>
        </div>
        
        <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
          <h5 className="font-medium text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Protection Tips
          </h5>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Use slippage protection on DEX trades</li>
            <li>• Consider using private mempools</li>
            <li>• Monitor gas prices before large trades</li>
            <li>• Use MEV protection services</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
