import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  User, 
  Shield, 
  AlertCircle,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { ConfidenceScore } from './ConfidenceScore';

interface CaseCardProps {
  caseData: {
    id: string;
    title: string;
    firNumber: string;
    status: 'open' | 'investigating' | 'closed' | 'pending';
    priority: 'low' | 'medium' | 'high';
    assignedTo: string;
    createdAt: string;
    lastUpdated: string;
    aiConfidence: number;
    evidenceCount: number;
    witnessCount: number;
  };
}

const statusConfig = {
  open: { icon: AlertCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
  investigating: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  closed: { icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  pending: { icon: Clock, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
};

const priorityColors = {
  low: 'bg-slate-600',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
};

export function CaseCard({ caseData }: CaseCardProps) {
  const status = statusConfig[caseData.status];
  const StatusIcon = status.icon;

  return (
    <Link to={`/report/${caseData.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        className="glass-card rounded-xl p-5 border border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/70 flex items-center justify-center border border-slate-700/50 group-hover:border-amber-500/30 transition-colors">
              <FileText className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                {caseData.title}
              </h4>
              <p className="text-xs font-mono text-slate-500 mt-0.5">{caseData.firNumber}</p>
            </div>
          </div>
          <ConfidenceScore score={caseData.aiConfidence} size="sm" showLabel={false} />
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <span className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${status.bg} ${status.color} ${status.border}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">{caseData.status}</span>
          </span>
          <span className={`w-2 h-2 rounded-full ${priorityColors[caseData.priority]}`} />
          <span className="text-xs text-slate-500 capitalize">{caseData.priority} Priority</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-200">{caseData.evidenceCount}</p>
            <p className="text-xs text-slate-500">Evidence</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-200">{caseData.witnessCount}</p>
            <p className="text-xs text-slate-500">Witnesses</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <p className="text-lg font-bold text-slate-200">{caseData.aiConfidence}%</p>
            <p className="text-xs text-slate-500">AI Score</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700/50">
          <div className="flex items-center space-x-1">
            <User className="w-3 h-3" />
            <span>{caseData.assignedTo}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{caseData.lastUpdated}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
