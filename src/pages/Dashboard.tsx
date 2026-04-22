import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp,
  TrendingDown, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  FileText,
  Users,
  Search,
  Filter,
  Calendar,
  Brain,
  Plus
} from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { EvidenceGraph } from '../components/EvidenceGraph';
import { AIInsights } from '../components/AIInsights';
import { ConfidenceScore } from '../components/ConfidenceScore';
import { useAuth } from '../context/AuthContext';
import { getCases } from '../services/api';



export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [cases, setCases] = useState<any[]>([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getCases()
      .then(data => setCases(data))
      .catch(() => {})
      .finally(() => setLoadingCases(false));
  }, []);

  const totalCases = cases.length;
  const completedCases = cases.filter(c => c.status === 'completed').length;
  const pendingCases = cases.filter(c => c.status === 'pending').length;
  const aiAnalyzed = cases.filter(c => c.analysis).length;

  const statsCards = [
    { title: 'Total Cases', value: String(totalCases), change: '', trend: 'up' as const, icon: FileText, color: 'text-blue-400' },
    { title: 'AI Analyzed', value: String(aiAnalyzed), change: '', trend: 'up' as const, icon: Brain, color: 'text-purple-400' },
    { title: 'Completed', value: String(completedCases), change: '', trend: 'up' as const, icon: CheckCircle2, color: 'text-emerald-400' },
    { title: 'Pending', value: String(pendingCases), change: '', trend: 'down' as const, icon: Clock, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 mt-1">Here's your case overview powered by Gemini AI</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-colors flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>Last 30 Days</span>
            </button>
            <Link to="/upload" className="btn-gold px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Case</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-slate-100 mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-slate-800/70 flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center mt-4">
                  <TrendIcon className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`} />
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-slate-500 ml-2">vs last month</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 mb-6 bg-slate-800/30 rounded-lg p-1 w-fit">
          {['overview', 'timeline', 'evidence', 'insights'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-slate-700 text-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'overview' && (
              <>
                {/* Recent Cases */}
                <div className="glass-card rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-100">Recent Cases</h3>
                    <Link to="/cases" className="text-sm text-amber-400 hover:text-amber-300 flex items-center space-x-1">
                      <span>View All</span>
                      <TrendingUp className="w-4 h-4" />
                    </Link>
                  </div>
                  {loadingCases ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                    </div>
                  ) : cases.length === 0 ? (
                    <div className="text-center py-10">
                      <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400 mb-4">No cases yet. Upload your first case!</p>
                      <Link to="/upload" className="btn-gold inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium">
                        <Plus className="w-4 h-4" /><span>Upload Case</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cases.slice(0, 5).map((c) => (
                        <Link key={c._id} to={`/report/${c._id}`} state={{ caseData: c }}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 hover:border-amber-500/20 transition-all group">
                          <div className="flex items-center space-x-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-200 truncate">{c.title}</p>
                              <p className="text-xs text-slate-500 capitalize">{c.caseType} • {c.status}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {c.analysis && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center space-x-1">
                                <Brain className="w-3 h-3" /><span>AI</span>
                              </span>
                            )}
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${
                              c.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                              c.status === 'analyzing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}>{c.status}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-lg font-bold text-slate-100 mb-6">Case Analytics</h3>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#d4a853"
                            strokeWidth="3"
                            strokeDasharray="75, 100"
                            className="-rotate-90 origin-center"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-slate-100">75%</p>
                      <p className="text-sm text-slate-500">Case Resolution Rate</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            strokeDasharray="60, 100"
                            className="-rotate-90 origin-center"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-slate-100">60%</p>
                      <p className="text-sm text-slate-500">AI Insight Adoption</p>
                    </div>
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-3">
                        <svg viewBox="0 0 36 36" className="w-full h-full">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="3"
                            strokeDasharray="85, 100"
                            className="-rotate-90 origin-center"
                          />
                        </svg>
                      </div>
                      <p className="text-2xl font-bold text-slate-100">85%</p>
                      <p className="text-sm text-slate-500">Evidence Chain Integrity</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'timeline' && <Timeline />}
            {activeTab === 'evidence' && <EvidenceGraph />}
            {activeTab === 'insights' && <AIInsights />}
          </div>

          {/* Right Column - 1/3 width */}
      <div className="space-y-6">
            {/* AI Assistant Card */}
            <div className="glass-card rounded-xl p-6 border border-amber-500/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center animate-pulse-gold">
                  <LayoutDashboard className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">AI Assistant</h3>
                  <p className="text-xs text-slate-400">Always learning</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 mb-4">
                I have analyzed 3 new cases today and generated 12 potential leads. 
                2 cases require immediate attention.
              </p>
              <button className="w-full py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-colors">
                Ask AI Assistant
              </button>
            </div>

            {/* Priority Alerts */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold text-slate-100 mb-4">Priority Alerts</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Urgent: Timeline Discrepancy</p>
                    <p className="text-xs text-slate-400 mt-1">Case #2024/001 - Witness statements conflict with evidence</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Case Approaching Deadline</p>
                    <p className="text-xs text-slate-400 mt-1">Case #2024/002 - 3 days remaining for chargesheet</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">Evidence Verified</p>
                    <p className="text-xs text-slate-400 mt-1">Fingerprint analysis completed for Case #2024/001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Activity */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold text-slate-100 mb-4">Team Activity</h3>
              <div className="space-y-4">
                {[
                  { user: 'SI Rajesh Kumar', action: 'Updated Case #2024/001', time: '10 min ago', color: 'bg-blue-500' },
                  { user: 'Ins. Priya Sharma', action: 'Added new evidence', time: '1 hour ago', color: 'bg-purple-500' },
                  { user: 'Adv. Vikram Singh', action: 'Reviewed AI insights', time: '2 hours ago', color: 'bg-emerald-500' },
                  { user: 'SI Rajesh Kumar', action: 'Uploaded witness statement', time: '3 hours ago', color: 'bg-blue-500' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full ${activity.color} flex items-center justify-center text-xs font-bold text-white`}>
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{activity.action}</p>
                      <p className="text-xs text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-bold text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full py-2 px-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm text-left transition-colors flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>New Case File</span>
                </button>
                <button className="w-full py-2 px-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm text-left transition-colors flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Advanced Search</span>
                </button>
                <button className="w-full py-2 px-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm text-left transition-colors flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Team Management</span>
                </button>
                <button className="w-full py-2 px-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm text-left transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Custom Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
