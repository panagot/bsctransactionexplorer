'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Shield, 
  AlertTriangle, 
  Activity,
  Network,
  Gauge
} from 'lucide-react';
import type { BSCTransactionExplanation } from '@/types/transaction';

interface Props {
  transaction: BSCTransactionExplanation;
}

export default function EnhancedTransactionDetails({ transaction }: Props) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['gas', 'protocol']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-red-600 dark:text-red-400';
      case 'Medium': return 'text-yellow-600 dark:text-yellow-400';
      case 'Low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'Medium': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'Low': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      default: return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Gas Analysis */}
      {transaction.gasAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection('gas')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Gas Analysis</h3>
            </div>
            {expandedSections.has('gas') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.has('gas') && (
            <div className="px-6 pb-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gas Used</p>
                  <p className="text-lg font-semibold">{transaction.gasAnalysis.gasUsed.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                  <p className="text-lg font-semibold">{transaction.gasAnalysis.gasEfficiency}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  <p className={`text-lg font-semibold ${getRiskColor(transaction.gasAnalysis.efficiencyRating)}`}>
                    {transaction.gasAnalysis.efficiencyRating}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fee</p>
                  <p className="text-lg font-semibold">{transaction.gasAnalysis.gasFee.toFixed(6)} BNB</p>
                </div>
              </div>
              
              {transaction.gasAnalysis.recommendations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Optimization Tips</h4>
                  <ul className="space-y-1">
                    {transaction.gasAnalysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-blue-800 dark:text-blue-200">• {rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Protocol Analysis */}
      {transaction.protocolAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection('protocol')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Network className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Protocol Analysis</h3>
            </div>
            {expandedSections.has('protocol') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.has('protocol') && (
            <div className="px-6 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protocol</p>
                  <p className="font-semibold">{transaction.protocolAnalysis.protocol || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-semibold">{transaction.protocolAnalysis.protocolType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complexity</p>
                  <p className={`font-semibold ${getRiskColor(transaction.protocolAnalysis.complexity)}`}>
                    {transaction.protocolAnalysis.complexity}
                  </p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Features</p>
                <div className="flex flex-wrap gap-2">
                  {transaction.protocolAnalysis.features.map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Risk Analysis */}
      {transaction.riskAnalysis && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection('risk')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Analysis</h3>
            </div>
            {expandedSections.has('risk') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.has('risk') && (
            <div className="px-6 pb-4 space-y-4">
              <div className={`p-4 rounded-lg border ${getRiskBgColor(transaction.riskAnalysis.riskLevel)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="font-medium">Risk Level: {transaction.riskAnalysis.riskLevel}</span>
                  <span className="text-sm">(Score: {transaction.riskAnalysis.riskScore})</span>
                </div>
                
                {transaction.riskAnalysis.risks.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Identified Risks:</p>
                    <ul className="space-y-1">
                      {transaction.riskAnalysis.risks.map((risk, index) => (
                        <li key={index} className="text-sm">• {risk}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {transaction.riskAnalysis.recommendations.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Recommendations:</p>
                    <ul className="space-y-1">
                      {transaction.riskAnalysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">• {rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Impact */}
      {transaction.networkImpact && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <button
            onClick={() => toggleSection('network')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Network Impact</h3>
            </div>
            {expandedSections.has('network') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.has('network') && (
            <div className="px-6 pb-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gas Contribution</p>
                  <p className="text-lg font-semibold">{transaction.networkImpact.gasContribution.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Block Impact</p>
                  <p className="text-lg font-semibold">{transaction.networkImpact.blockContribution.toFixed(2)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Impact Level</p>
                  <p className={`text-lg font-semibold ${getRiskColor(transaction.networkImpact.impactLevel)}`}>
                    {transaction.networkImpact.impactLevel}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                  <p className="text-lg font-semibold">{transaction.networkImpact.networkEfficiency}</p>
                </div>
              </div>
              
              {transaction.networkImpact.isHighImpact && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">
                      High Network Impact Transaction
                    </span>
                  </div>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    This transaction uses significant network resources and may affect block capacity.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
