import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  AlertTriangle, 
  Lightbulb, 
  Search, 
  Scale, 
  ChevronRight,
  Sparkles,
  FileWarning,
  MessageSquare
} from 'lucide-react';
import { analyzeStandaloneText } from '../services/api';

interface Insight {
  id: string;
  type: 'inconsistency' | 'lead' | 'pattern' | 'legal';
  title: string;
  description: string;
  confidence: number;
  evidence: string[];
  severity?: 'low' | 'medium' | 'high';
}


const sampleInsights: Insight[] = [
  {
    id: '1',
    type: 'inconsistency',
    title: 'Timeline Discrepancy Detected',
    description: 'Witness Mrs. Sharma reports seeing suspect at 08:45 AM, but CCTV footage shows the area was empty until 09:00 AM.',
    confidence: 82,
    evidence: ['CCTV Footage', 'Witness Statement #001'],
    severity: 'high'
  },
  {
    id: '2',
    type: 'pattern',
    title: 'Similar Modus Operandi',
    description: 'This case shows striking similarities to Case #2023/089 (Burglary in Kalkaji) - same entry method and target selection.',
    confidence: 76,
    evidence: ['Case Database', 'Crime Pattern Analysis'],
    severity: 'medium'
  },
  {
    id: '3',
    type: 'lead',
    title: 'Suggested Investigation Direction',
    description: 'Focus on phone number +91-98765-43210. Records show 5 calls to victim in past week. Owner identified as Rahul Verma.',
    confidence: 91,
    evidence: ['Phone Records', 'Subscriber Details'],
    severity: 'high'
  },
  {
    id: '4',
    type: 'legal',
    title: 'Applicable Legal Sections',
    description: 'Based on evidence, consider filing under IPC Section 380 (Theft in dwelling house), Section 454 ( lurking house-trespass).',
    confidence: 88,
    evidence: ['Evidence Summary', 'Legal Database']
  },
  {
    id: '5',
    type: 'lead',
    title: 'Missing Evidence Alert',
    description: 'No forensic report on fingerprints collected at scene. Recommended to expedite analysis for comparison with database.',
    confidence: 95,
    evidence: ['Evidence Log', 'Forensic Request Form'],
    severity: 'medium'
  }
];

const typeConfig = {
  inconsistency: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  lead: { icon: Search, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  pattern: { icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  legal: { icon: Scale, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
};

const severityColors = {
  low: 'bg-slate-600',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

export function AIInsights() {
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [backendResult, setBackendResult] = useState<any>(null); // ✅ NEW
  const filteredInsights = activeFilter === 'all' 
  ? sampleInsights 
  : sampleInsights.filter(i => i.type === activeFilter);

  // ✅ MOVE FUNCTION HERE
  const analyzeCase = async () => {
    setIsAnalyzing(true);
    try {
      const data = await analyzeStandaloneText("fraud transaction case");
      console.log(data);
      setBackendResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
    setIsAnalyzing(false);
  };


  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-100">AI Insights</h3>
            <p className="text-sm text-slate-400">Intelligent analysis & recommendations</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={analyzeCase}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Analyzing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['all', 'inconsistency', 'lead', 'pattern', 'legal'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeFilter === filter
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/50'
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>
{backendResult && (
  <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
    <p className="text-green-400 font-semibold">AI Result:</p>
    <p className="text-slate-200">{backendResult.insights}</p>
    <p className="text-sm text-slate-400">
      Confidence: {backendResult.confidence}
    </p>
  </div>
)}

      {/* Insights List */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {filteredInsights.map((insight, index) => {
            const config = typeConfig[insight.type];
            const Icon = config.icon;
            const isExpanded = expandedInsight === insight.id;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className={`glass rounded-lg border transition-all cursor-pointer ${config.border} ${config.bg}`}
                onClick={() => setExpandedInsight(isExpanded ? null : insight.id)}
              >
                <div className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-slate-200">{insight.title}</h4>
                        <div className="flex items-center space-x-2">
                          {insight.severity && (
                            <span className={`w-2 h-2 rounded-full ${severityColors[insight.severity]}`} />
                          )}
                          <span className="text-xs font-mono text-amber-400">{insight.confidence}%</span>
                          <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{insight.description}</p>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-slate-700/50"
                      >
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Supporting Evidence:</p>
                            <div className="flex flex-wrap gap-2">
                              {insight.evidence.map((ev, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-800/70 rounded text-xs text-slate-300 border border-slate-700/50">
                                  {ev}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                              <FileWarning className="w-4 h-4 text-amber-500/70" />
                              <span className="text-xs text-slate-500">AI-generated insight. Verify before action.</span>
                            </div>
                            <button className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1">
                              <MessageSquare className="w-3 h-3" />
                              <span>Discuss</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Confidence Legend */}
      <div className="mt-6 pt-4 border-t border-slate-700/50">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>AI Confidence Scale</span>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-slate-600" />
              <span>&lt; 70% Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>70-85% Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>&gt; 85% High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
