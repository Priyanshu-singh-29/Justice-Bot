import { motion } from 'framer-motion';
import {
  Brain, AlertTriangle, CheckCircle2, Lightbulb, TrendingUp, Shield
} from 'lucide-react';

interface AIAnalysis {
  summary: string;
  legalPoints: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  updatedAt?: string;
}

interface AIAnalysisPanelProps {
  analysis: AIAnalysis;
  onReanalyze?: () => void;
  isLoading?: boolean;
}

const riskConfig = {
  low: { color: 'emerald', label: 'Low Risk', icon: CheckCircle2 },
  medium: { color: 'amber', label: 'Medium Risk', icon: AlertTriangle },
  high: { color: 'red', label: 'High Risk', icon: AlertTriangle },
};

export function AIAnalysisPanel({ analysis, onReanalyze, isLoading }: AIAnalysisPanelProps) {
  const risk = riskConfig[analysis.riskLevel] || riskConfig.medium;
  const RiskIcon = risk.icon;
  const c = risk.color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      {/* Header */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100">AI Analysis</h3>
              {analysis.updatedAt && (
                <p className="text-xs text-slate-500">
                  Updated: {new Date(analysis.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full bg-${c}-500/10 border border-${c}-500/30`}>
            <RiskIcon className={`w-4 h-4 text-${c}-400`} />
            <span className={`text-sm font-semibold text-${c}-400`}>{risk.label}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
          <p className="text-slate-300 leading-relaxed text-sm">{analysis.summary}</p>
        </div>
      </div>

      {/* Legal Points */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Shield className="w-5 h-5 text-blue-400" />
          <h4 className="font-semibold text-slate-200">Key Legal Points</h4>
        </div>
        <ul className="space-y-3">
          {analysis.legalPoints.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start space-x-3"
            >
              <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-400">{i + 1}</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{point}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Recommendations */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h4 className="font-semibold text-slate-200">AI Recommendations</h4>
        </div>
        <ul className="space-y-3">
          {analysis.recommendations.map((rec, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-start space-x-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
            >
              <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-slate-300 text-sm leading-relaxed">{rec}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Re-analyze Button */}
      {onReanalyze && (
        <button
          id="reanalyze-btn"
          onClick={onReanalyze}
          disabled={isLoading}
          className="w-full py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Re-analyze with AI</span>
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
