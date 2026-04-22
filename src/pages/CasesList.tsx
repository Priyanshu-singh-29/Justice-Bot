import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Plus, Search, Filter, Brain, Clock, Trash2,
  CheckCircle2, AlertTriangle, Loader2, ChevronRight
} from 'lucide-react';
import { getCases, deleteCase, analyzeCase } from '../services/api';

const STATUS_CONFIG: Record<string, { color: string; label: string; icon: any }> = {
  completed: { color: 'emerald', label: 'Completed', icon: CheckCircle2 },
  analyzing: { color: 'blue', label: 'Analyzing', icon: Loader2 },
  pending: { color: 'amber', label: 'Pending', icon: Clock },
  failed: { color: 'red', label: 'Failed', icon: AlertTriangle }
};

const RISK_CONFIG: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  high: 'text-red-400 bg-red-500/10 border-red-500/30'
};

export function CasesList() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const data = await getCases();
      setCases(data);
    } catch (e) {
      setError('Failed to load cases.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (id: string) => {
    setAnalyzingId(id);
    try {
      const updated = await analyzeCase(id);
      setCases(prev => prev.map(c => c._id === id ? updated : c));
    } catch (e) {
      setError('AI analysis failed.');
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case?')) return;
    setDeletingId(id);
    try {
      await deleteCase(id);
      setCases(prev => prev.filter(c => c._id !== id));
    } catch (e) {
      setError('Failed to delete case.');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = cases.filter(c =>
    c.title?.toLowerCase().includes(search.toLowerCase()) ||
    c.caseType?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">My Cases</h1>
            <p className="text-slate-400 mt-1">{cases.length} case{cases.length !== 1 ? 's' : ''} total</p>
          </div>
          <Link to="/upload" id="new-case-btn"
            className="btn-gold flex items-center space-x-2 px-5 py-3 rounded-xl font-semibold">
            <Plus className="w-5 h-5" />
            <span>New Case</span>
          </Link>
        </div>

        {error && (
          <div className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-300">✕</button>
          </div>
        )}

        {/* Search & Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-legal w-full pl-10 pr-4 py-2.5 rounded-lg"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-amber-500/30 transition-all text-sm">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>

        {/* Cases List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-16 text-center">
            <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              {search ? 'No matching cases' : 'No cases yet'}
            </h3>
            <p className="text-slate-500 mb-6">
              {search ? 'Try a different search term.' : 'Upload your first case to get started with AI analysis.'}
            </p>
            {!search && (
              <Link to="/upload" className="btn-gold inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold">
                <Plus className="w-4 h-4" />
                <span>Upload New Case</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((caseItem, index) => {
              const status = STATUS_CONFIG[caseItem.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;
              const risk = caseItem.analysis?.riskLevel;

              return (
                <motion.div
                  key={caseItem._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-xl p-6 hover:border-amber-500/20 transition-all group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2 flex-wrap gap-2">
                        <h3 className="font-bold text-slate-100 truncate">{caseItem.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border bg-${status.color}-500/10 text-${status.color}-400 border-${status.color}-500/30 flex items-center space-x-1`}>
                          <StatusIcon className={`w-3 h-3 ${caseItem.status === 'analyzing' ? 'animate-spin' : ''}`} />
                          <span>{status.label}</span>
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 capitalize">
                          {caseItem.caseType}
                        </span>
                        {risk && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${RISK_CONFIG[risk] || RISK_CONFIG.medium}`}>
                            {risk} risk
                          </span>
                        )}
                      </div>

                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{caseItem.description}</p>

                      {/* AI Summary preview */}
                      {caseItem.analysis?.summary && (
                        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20 mb-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Brain className="w-3 h-3 text-purple-400" />
                            <span className="text-xs font-medium text-purple-400">AI Summary</span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{caseItem.analysis.summary}</p>
                        </div>
                      )}

                      <p className="text-xs text-slate-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(caseItem.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                      {caseItem.status !== 'analyzing' && (
                        <button
                          id={`analyze-${caseItem._id}`}
                          onClick={() => handleAnalyze(caseItem._id)}
                          disabled={analyzingId === caseItem._id}
                          className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-xs font-medium transition-all disabled:opacity-50"
                          title="Analyze with Gemini AI"
                        >
                          {analyzingId === caseItem._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Brain className="w-4 h-4" />
                          )}
                          <span className="hidden sm:inline">{caseItem.analysis ? 'Re-analyze' : 'Analyze AI'}</span>
                        </button>
                      )}
                      <Link
                        to={`/report/${caseItem._id}`}
                        state={{ caseData: caseItem }}
                        className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-medium transition-all"
                        title="View Report"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Report</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleDelete(caseItem._id)}
                        disabled={deletingId === caseItem._id}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all disabled:opacity-50"
                        title="Delete Case"
                      >
                        {deletingId === caseItem._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
