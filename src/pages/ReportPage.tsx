import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, Download, Printer, Share2, Shield, Scale, AlertTriangle,
  CheckCircle2, Lightbulb, Search, Clock, User, ChevronLeft, Brain
} from 'lucide-react';
import { Timeline } from '../components/Timeline';
import { EvidenceGraph } from '../components/EvidenceGraph';
import { AIInsights } from '../components/AIInsights';
import { ConfidenceScore } from '../components/ConfidenceScore';
import { AIAnalysisPanel } from '../components/AIAnalysisPanel';
import { getCaseById, analyzeCase } from '../services/api';

const reportSections = [
  { id: 'ai-analysis', title: 'AI Analysis', icon: Brain },
  { id: 'summary', title: 'Case Summary', icon: FileText },
  { id: 'findings', title: 'Key Findings', icon: Search },
  { id: 'timeline', title: 'Event Timeline', icon: Clock },
  { id: 'evidence', title: 'Evidence Analysis', icon: Shield },
  { id: 'leads', title: 'Investigation Leads', icon: Lightbulb },
  { id: 'legal', title: 'Legal References', icon: Scale },
];

const keyFindings = [
  { id: 1, type: 'evidence', title: 'CCTV Footage Analysis', description: 'High-definition footage from nearby shop camera captures individual matching suspect description at 09:02 AM.', confidence: 91, verified: true },
  { id: 2, type: 'witness', title: 'Witness Testimony', description: 'Neighbor reports observing suspicious activity near the premises at approximately 08:45 AM.', confidence: 72, verified: false },
  { id: 3, type: 'forensic', title: 'Fingerprint Evidence', description: 'Three distinct fingerprint sets recovered from point of entry. One set matches known database entries.', confidence: 88, verified: true },
  { id: 4, type: 'digital', title: 'Phone Records', description: 'Victim received call from traced subscriber at 08:30 AM. Five calls in past week.', confidence: 95, verified: true }
];

const investigationLeads = [
  { id: 1, priority: 'high', title: 'Immediate Action Required', description: 'Interview suspect regarding their presence near crime scene and relationship with victim.', deadline: 'Within 24 hours' },
  { id: 2, priority: 'high', title: 'Forensic Expedite', description: 'Complete fingerprint analysis and compare with crime scene samples. Current status: Pending at FSL.', deadline: '48 hours' },
  { id: 3, priority: 'medium', title: 'Witness Corroboration', description: 'Interview additional witnesses in the vicinity.', deadline: '1 week' },
  { id: 4, priority: 'medium', title: 'Pattern Analysis', description: 'Cross-reference with similar cases in the area (last 6 months).', deadline: '1 week' }
];

const legalReferences = [
  { section: 'IPC Section 380', title: 'Theft in Dwelling House', description: 'Punishment for theft in any building used as a human dwelling.', applicability: 'High - Evidence supports forced entry and theft', punishment: 'Imprisonment up to 7 years + fine' },
  { section: 'IPC Section 454', title: 'Lurking House-Trespass', description: 'Whoever commits lurking house-trespass in order to commit an offence.', applicability: 'High - Premises entered without permission', punishment: 'Imprisonment up to 2 years + fine' },
  { section: 'IPC Section 411', title: 'Dishonestly Receiving Stolen Property', description: 'Whoever dishonestly receives or retains stolen property.', applicability: 'Medium - If stolen goods recovered from suspect', punishment: 'Imprisonment up to 3 years + fine' }
];

export function ReportPage() {
  const { caseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('ai-analysis');
  const [expandedFindings, setExpandedFindings] = useState<number[]>([1]);
  const [caseData, setCaseData] = useState<any>(location.state?.caseData || null);
  const [loadingCase, setLoadingCase] = useState(!location.state?.caseData);
  const [analyzingAI, setAnalyzingAI] = useState(false);

  useEffect(() => {
    if (!caseData && caseId) {
      getCaseById(caseId)
        .then(data => setCaseData(data))
        .catch(() => {})
        .finally(() => setLoadingCase(false));
    }
  }, [caseId]);

  const handleReanalyze = async () => {
    if (!caseId) return;
    setAnalyzingAI(true);
    try {
      const updated = await analyzeCase(caseId);
      setCaseData(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzingAI(false);
    }
  };

  const toggleFinding = (id: number) => {
    setExpandedFindings(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (loadingCase) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400">Loading case report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button onClick={() => navigate('/cases')}
          className="flex items-center space-x-2 text-slate-400 hover:text-amber-400 transition-colors mb-6 group">
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to Cases</span>
        </button>

        {/* Report Header */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-100">
                    {caseData?.title || 'AI Investigation Report'}
                  </h1>
                  <p className="text-sm text-slate-400">Case ID: {caseId}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-4 flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                  {caseData?.caseType?.toUpperCase() || 'CASE'}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  caseData?.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  caseData?.status === 'analyzing' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                  'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {caseData?.status?.toUpperCase() || 'PENDING'}
                </span>
                <span className="text-xs text-slate-500">
                  Generated: {new Date().toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <button className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-colors flex items-center space-x-2">
                <Printer className="w-4 h-4" /><span>Print</span>
              </button>
              <button className="px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 text-sm font-medium transition-colors flex items-center space-x-2">
                <Share2 className="w-4 h-4" /><span>Share</span>
              </button>
              <button className="px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-sm font-medium transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" /><span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-xl p-4 sticky top-24">
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Report Sections</h3>
              <nav className="space-y-1">
                {reportSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button key={section.id} onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                      }`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">AI Confidence</h3>
                <div className="flex justify-center">
                  <ConfidenceScore score={caseData?.analysis ? 87 : 0} size="lg" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* AI Analysis Section — real Gemini data */}
            {activeSection === 'ai-analysis' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {caseData?.analysis ? (
                  <AIAnalysisPanel
                    analysis={caseData.analysis}
                    onReanalyze={handleReanalyze}
                    isLoading={analyzingAI}
                  />
                ) : (
                  <div className="glass-card rounded-xl p-10 text-center">
                    <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-300 mb-2">No AI Analysis Yet</h3>
                    <p className="text-slate-500 mb-6">Click below to run Gemini AI analysis on this case.</p>
                    <button onClick={handleReanalyze} disabled={analyzingAI}
                      className="btn-gold px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto disabled:opacity-50">
                      {analyzingAI ? (
                        <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                      ) : <><Brain className="w-5 h-5" /><span>Analyze with Gemini AI</span></>}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Case Summary */}
            {activeSection === 'summary' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-slate-100 mb-4">Case Summary</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  {caseData?.description || 'No description available.'}
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">Case Status</p>
                    <p className="text-lg font-semibold text-amber-400 capitalize">{caseData?.status || 'Pending'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">Risk Level</p>
                    <p className={`text-lg font-semibold capitalize ${
                      caseData?.analysis?.riskLevel === 'high' ? 'text-red-400' :
                      caseData?.analysis?.riskLevel === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>{caseData?.analysis?.riskLevel || 'Unknown'}</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <p className="text-sm text-slate-500">Case Type</p>
                    <p className="text-lg font-semibold text-slate-200 capitalize">{caseData?.caseType || 'Other'}</p>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-slate-200">AI Disclaimer</p>
                      <p className="text-xs text-slate-400 mt-1">
                        This report provides AI-generated insights based on available evidence and does not
                        constitute legal judgment. All findings must be verified by qualified investigators
                        and legal professionals before use in proceedings.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Key Findings */}
            {activeSection === 'findings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {keyFindings.map((finding) => (
                  <div key={finding.id} className="glass-card rounded-xl p-6 cursor-pointer hover:border-amber-500/30 transition-all"
                    onClick={() => toggleFinding(finding.id)}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          finding.type === 'evidence' ? 'bg-amber-500/10 text-amber-400' :
                          finding.type === 'witness' ? 'bg-blue-500/10 text-blue-400' :
                          finding.type === 'forensic' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                        }`}>
                          {finding.type === 'evidence' && <Shield className="w-6 h-6" />}
                          {finding.type === 'witness' && <User className="w-6 h-6" />}
                          {finding.type === 'forensic' && <Search className="w-6 h-6" />}
                          {finding.type === 'digital' && <Clock className="w-6 h-6" />}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-slate-200">{finding.title}</h3>
                            {finding.verified && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${
                            finding.type === 'evidence' ? 'bg-amber-500/10 text-amber-400' :
                            finding.type === 'witness' ? 'bg-blue-500/10 text-blue-400' :
                            finding.type === 'forensic' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                          }`}>{finding.type.charAt(0).toUpperCase() + finding.type.slice(1)}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <span className="text-sm font-bold text-amber-400">{finding.confidence}%</span>
                        </div>
                        <span className="text-xs text-slate-500">Confidence</span>
                      </div>
                    </div>
                    <p className="text-slate-400 mt-4">{finding.description}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeSection === 'timeline' && <Timeline />}
            {activeSection === 'evidence' && <EvidenceGraph />}

            {activeSection === 'leads' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {investigationLeads.map((lead) => (
                  <div key={lead.id} className={`glass-card rounded-xl p-6 border-l-4 ${lead.priority === 'high' ? 'border-l-red-500' : 'border-l-amber-500'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${lead.priority === 'high' ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'}`}>
                            {lead.priority.toUpperCase()} PRIORITY
                          </span>
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span className="text-xs text-slate-500">{lead.deadline}</span>
                        </div>
                        <h3 className="font-semibold text-slate-200">{lead.title}</h3>
                        <p className="text-slate-400 mt-2">{lead.description}</p>
                      </div>
                      <Lightbulb className={`w-6 h-6 ${lead.priority === 'high' ? 'text-red-400' : 'text-amber-400'}`} />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeSection === 'legal' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {legalReferences.map((ref, index) => (
                  <div key={index} className="glass-card rounded-xl p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                        <Scale className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-blue-400">{ref.section}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${ref.applicability.includes('High') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {ref.applicability.split(' - ')[0]} Applicability
                          </span>
                        </div>
                        <h4 className="text-lg font-medium text-slate-200 mt-1">{ref.title}</h4>
                        <p className="text-slate-400 mt-2">{ref.description}</p>
                        <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                          <p className="text-xs text-slate-500 uppercase tracking-wider">Punishment</p>
                          <p className="text-sm text-slate-300 mt-1">{ref.punishment}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
