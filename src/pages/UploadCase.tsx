import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileText, X, Mic, Camera, CheckCircle2, AlertCircle,
  FileUp, Shield, Sparkles, Brain
} from 'lucide-react';
import { createCase, analyzeCase } from '../services/api';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  type: string;
  progress: number;
}

export function UploadCase() {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState({
    firNumber: '',
    caseTitle: '',
    incidentDate: '',
    incidentLocation: '',
    complainantName: '',
    complainantContact: '',
    caseType: '',
    description: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    handleFiles(Array.from(e.dataTransfer.files));
  };

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      progress: 0
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) { progress = 100; clearInterval(interval); }
        setUploadedFiles(prev => prev.map(f => f.id === file.id ? { ...f, progress: Math.round(progress) } : f));
      }, 300);
    });
  };

  const removeFile = (id: string) => setUploadedFiles(prev => prev.filter(f => f.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.caseTitle || !formData.description || !formData.caseType) {
      setError('Please fill in Case Title, Case Type, and Description.');
      return;
    }
    setError('');
    setIsAnalyzing(true);
    try {
      // 1. Create case in DB
      const newCase = await createCase({
        title: formData.caseTitle,
        description: formData.description,
        caseType: formData.caseType
      });
      // 2. Trigger Gemini AI analysis
      const analyzed = await analyzeCase(newCase._id);
      // 3. Navigate to the report page
      navigate(`/report/${analyzed._id}`, { state: { caseData: analyzed } });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400 font-medium">AI-Powered Case Analysis</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Upload New Case</h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Upload FIR details and case information. Our AI (Gemini) will analyze the data and generate
              comprehensive legal insights and recommendations.
            </p>
          </motion.div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-center space-x-2 p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Case Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Case Information</h3>
                <p className="text-sm text-slate-400">Basic details about the case</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">FIR Number</label>
                <input type="text" value={formData.firNumber}
                  onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
                  placeholder="e.g., FIR/DEL/2024/001" className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Case Title *</label>
                <input type="text" required value={formData.caseTitle}
                  onChange={(e) => setFormData({ ...formData, caseTitle: e.target.value })}
                  placeholder="Brief case description" className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Incident Date</label>
                <input type="datetime-local" value={formData.incidentDate}
                  onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                  className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Incident Location</label>
                <input type="text" value={formData.incidentLocation}
                  onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                  placeholder="Full address" className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Complainant Name</label>
                <input type="text" value={formData.complainantName}
                  onChange={(e) => setFormData({ ...formData, complainantName: e.target.value })}
                  className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Complainant Contact</label>
                <input type="tel" value={formData.complainantContact}
                  onChange={(e) => setFormData({ ...formData, complainantContact: e.target.value })}
                  placeholder="+91-XXXXXXXXXX" className="input-legal w-full px-4 py-3 rounded-lg" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Case Type *</label>
                <select required value={formData.caseType}
                  onChange={(e) => setFormData({ ...formData, caseType: e.target.value })}
                  className="input-legal w-full px-4 py-3 rounded-lg">
                  <option value="">Select case type</option>
                  <option value="criminal">Criminal</option>
                  <option value="civil">Civil</option>
                  <option value="corporate">Corporate</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Case Description * <span className="text-slate-500">(The AI will analyze this)</span>
                </label>
                <textarea rows={5} required value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide a detailed description of the incident, facts, parties involved, and any relevant information..."
                  className="input-legal w-full px-4 py-3 rounded-lg resize-none" />
              </div>
            </div>
          </motion.div>

          {/* File Upload */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <FileUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Evidence & Documents</h3>
                <p className="text-sm text-slate-400">Upload FIR, photos, videos, and other evidence</p>
              </div>
            </div>
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging ? 'border-amber-500 bg-amber-500/10' : 'border-slate-700 hover:border-slate-600 bg-slate-800/30'
              }`}>
              <input ref={fileInputRef} type="file" multiple
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))} className="hidden" />
              <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-300 font-medium mb-2">Drag and drop files here, or click to browse</p>
              <p className="text-sm text-slate-500">Supports PDF, Images, Videos, Audio (Max 50MB each)</p>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <button type="button" onClick={() => setIsRecording(!isRecording)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  isRecording ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}>
                <Mic className={`w-4 h-4 ${isRecording ? 'animate-pulse' : ''}`} />
                <span className="text-sm">{isRecording ? 'Recording... Click to stop' : 'Record FIR Narration'}</span>
              </button>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                    <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center">
                      {file.type.startsWith('image/') ? <Camera className="w-5 h-5 text-amber-400" /> : <FileText className="w-5 h-5 text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 truncate">{file.name}</p>
                      <p className="text-xs text-slate-500">{file.size}</p>
                      {file.progress < 100 && (
                        <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 transition-all duration-300" style={{ width: `${file.progress}%` }} />
                        </div>
                      )}
                    </div>
                    {file.progress === 100 && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                    <button type="button" onClick={() => removeFile(file.id)}
                      className="p-1 rounded hover:bg-slate-700/50 text-slate-500 hover:text-red-400 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Security Notice */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex items-start space-x-3 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <Shield className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-300">Secure Data Handling</p>
              <p className="text-xs text-slate-500 mt-1">
                All uploaded files are encrypted and stored securely. Access is limited to authorized
                personnel only. AI analysis is powered by Google Gemini.
              </p>
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Please verify all information before submitting
            </p>
            <button id="analyze-submit" type="submit" disabled={isAnalyzing}
              className="btn-gold px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50">
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                  <span>AI Analyzing...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Analyze with Gemini AI</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
