import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Settings, BarChart3, Shield, Database, Activity, Search,
  CheckCircle2, XCircle, Clock, FileText, Lock, Globe, Bell,
  Brain, Trash2, Loader2, Crown, UserCheck
} from 'lucide-react';
import { getAdminStats, getAdminUsers, updateUserRole, deleteAdminUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

const adminTabs = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'system', label: 'System Health', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const systemMetrics = [
  { name: 'AI Processing (Gemini)', value: 92, status: 'healthy', color: 'emerald' },
  { name: 'MongoDB Database', value: 96, status: 'healthy', color: 'emerald' },
  { name: 'Storage', value: 68, status: 'warning', color: 'amber' },
  { name: 'API Uptime', value: 99, status: 'healthy', color: 'emerald' },
];

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    Promise.all([
      getAdminStats().then(setStats).catch(() => {}),
      getAdminUsers().then(setUsers).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    setUpdatingId(userId);
    try {
      const updated = await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? updated : u));
    } catch {}
    finally { setUpdatingId(null); }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    setDeletingId(userId);
    try {
      await deleteAdminUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch {}
    finally { setDeletingId(null); }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Admin Panel</h1>
            <p className="text-slate-400 mt-1">System administration • Logged in as <span className="text-amber-400">{currentUser?.name}</span></p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-emerald-400">System Operational</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 mb-8 bg-slate-800/30 rounded-xl p-1 w-fit">
          {adminTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}>
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3" />
                    <div className="h-8 bg-slate-700 rounded w-1/2" />
                  </div>
                ))
              ) : [
                { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: Users, color: 'text-blue-400' },
                { label: 'Total Cases', value: stats?.totalCases ?? 0, icon: FileText, color: 'text-amber-400' },
                { label: 'AI Analyzed', value: stats?.aiAnalyzed ?? 0, icon: Brain, color: 'text-purple-400' },
                { label: 'Completed', value: stats?.completedCases ?? 0, icon: CheckCircle2, color: 'text-emerald-400' },
                { label: 'Pending', value: stats?.pendingCases ?? 0, icon: Clock, color: 'text-red-400' },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="glass-card rounded-xl p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{stat.label}</p>
                        <p className="text-3xl font-bold text-slate-100 mt-1">{stat.value}</p>
                      </div>
                      <Icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* System Health */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-6">System Health</h3>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{metric.name}</span>
                        <span className={`text-sm font-medium ${metric.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full rounded-full ${metric.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Performance */}
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">AI Performance</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Gemini Model', value: 'gemini-1.5-flash', badge: 'active' },
                    { label: 'Cases Analyzed', value: String(stats?.aiAnalyzed ?? 0), badge: null },
                    { label: 'Analysis Success Rate', value: stats?.totalCases ? `${Math.round((stats.aiAnalyzed / stats.totalCases) * 100)}%` : '0%', badge: null },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <p className="text-sm text-slate-300">{item.label}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-semibold text-amber-400">{item.value}</p>
                        {item.badge && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <p className="text-sm text-slate-300">Server Status</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-sm text-emerald-400">Online :5000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-100">
                User Management <span className="text-slate-500 text-sm font-normal">({users.length} users)</span>
              </h3>
              <div className="mt-4 md:mt-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" placeholder="Search users..."
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-64 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-bold text-slate-950">
                                {u.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-slate-200">{u.name}</p>
                                {u._id === currentUser?.id && (
                                  <span className="text-xs px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">You</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${
                            u.role === 'admin'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                          }`}>
                            {u.role === 'admin' ? <Crown className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                            <span className="capitalize">{u.role}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-400">
                            {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRoleToggle(u._id, u.role)}
                              disabled={updatingId === u._id || u._id === currentUser?.id}
                              title={u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                              className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all disabled:opacity-40"
                            >
                              {updatingId === u._id
                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                : u.role === 'admin' ? <UserCheck className="w-3 h-3" /> : <Crown className="w-3 h-3" />}
                              <span>{u.role === 'admin' ? 'Demote' : 'Make Admin'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              disabled={deletingId === u._id || u._id === currentUser?.id}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-40"
                              title="Delete User"
                            >
                              {deletingId === u._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-slate-500">No users found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}

        {/* System Health Tab */}
        {activeTab === 'system' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">Service Status</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Express API Server', status: 'online', port: ':5000' },
                    { name: 'MongoDB Database', status: 'online', port: ':27017' },
                    { name: 'Google Gemini AI', status: 'online', port: 'v1beta' },
                    { name: 'React Frontend', status: 'online', port: ':5173' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-slate-300">{s.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-400">{s.status}</span>
                        <p className="text-xs text-slate-500">{s.port}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">System Metrics</h3>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => (
                    <div key={metric.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-slate-300">{metric.name}</span>
                        <span className={`text-sm font-medium ${metric.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {metric.value}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 1 }}
                          className={`h-full rounded-full ${metric.color === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-6">System Settings</h3>
            <div className="space-y-4">
              {[
                { icon: Shield, title: 'Security Settings', desc: 'Configure authentication and JWT expiry' },
                { icon: Bell, title: 'Notifications', desc: 'Manage alert preferences and email settings' },
                { icon: Globe, title: 'Regional Settings', desc: 'Language, timezone, and date format' },
                { icon: Database, title: 'Data Management', desc: 'Backup schedules and retention policies' },
                { icon: Lock, title: 'Privacy Controls', desc: 'Data privacy and compliance settings' },
                { icon: Brain, title: 'AI Configuration', desc: 'Gemini model selection and prompt tuning' },
              ].map((setting, index) => {
                const Icon = setting.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer group">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-700 group-hover:bg-amber-500/10 flex items-center justify-center transition-colors">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{setting.title}</p>
                        <p className="text-xs text-slate-500">{setting.desc}</p>
                      </div>
                    </div>
                    <button className="text-sm text-amber-400 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      Configure →
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
