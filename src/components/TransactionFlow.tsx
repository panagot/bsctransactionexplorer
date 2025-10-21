'use client';

import { ArrowDown, Clock, CheckCircle, XCircle } from 'lucide-react';
import type { BSCTransactionExplanation } from '@/types/transaction';

interface TransactionFlowProps {
  transaction: BSCTransactionExplanation;
}

export default function TransactionFlow({ transaction }: TransactionFlowProps) {
  const steps = [
    {
      title: 'Transaction Initiation',
      description: 'User initiates transaction with wallet signature',
      icon: <Clock className="w-5 h-5" />,
      status: 'completed'
    },
    {
      title: 'Network Validation',
      description: 'BSC network validates transaction and checks balance',
      icon: <CheckCircle className="w-5 h-5" />,
      status: transaction.success ? 'completed' : 'failed'
    },
    {
      title: 'Block Inclusion',
      description: 'Validator includes transaction in block and executes',
      icon: <CheckCircle className="w-5 h-5" />,
      status: transaction.success ? 'completed' : 'failed'
    },
    {
      title: 'Finalization',
      description: 'Transaction is finalized and state changes are applied',
      icon: transaction.success ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />,
      status: transaction.success ? 'completed' : 'failed'
    }
  ];

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50 dark:border-slate-700/50">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">
          🔄
        </div>
        Transaction Flow
      </h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start gap-4">
            {/* Step Icon */}
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
              step.status === 'completed' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : step.status === 'failed'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {step.icon}
            </div>
            
            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                {step.title}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
            
            {/* Arrow */}
            {index < steps.length - 1 && (
              <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
                <ArrowDown className="w-4 h-4 text-slate-400" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Transaction Details */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">From</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {transaction.from.slice(0, 6)}...{transaction.from.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">To</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {transaction.to.slice(0, 6)}...{transaction.to.slice(-4)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Value</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {transaction.valueInEth.toFixed(4)} BNB
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Gas Used</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                {transaction.gasFee.toFixed(6)} BNB
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Block</span>
              <span className="font-mono text-sm text-slate-900 dark:text-white">
                #{transaction.blockNumber.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <span className={`text-sm font-medium ${
                transaction.success 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.success ? 'Success' : 'Failed'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
