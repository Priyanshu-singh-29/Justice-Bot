import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Brain, 
  Search, 
  FileSearch, 
  Scale, 
  Clock, 
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Lock,
  Users,
  BarChart3
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced algorithms detect patterns, inconsistencies, and generate intelligent leads from case data.'
  },
  {
    icon: Search,
    title: 'Smart Investigation',
    description: 'Get suggested next steps, witness questions, and missing evidence alerts to accelerate case resolution.'
  },
  {
    icon: FileSearch,
    title: 'Evidence Mapping',
    description: 'Visual relationship graphs connecting suspects, victims, locations, and evidence with confidence scores.'
  },
  {
    icon: Scale,
    title: 'Legal Context',
    description: 'Automatic identification of applicable IPC, CrPC sections based on case facts and evidence.'
  },
  {
    icon: Clock,
    title: 'Timeline Reconstruction',
    description: 'Interactive chronological visualization of events with verification status and source tracking.'
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    description: 'Enterprise-grade encryption with role-based access control for lawyers, police, and investigators.'
  }
];

const stats = [
  { value: '10K+', label: 'Cases Analyzed' },
  { value: '85%', label: 'Accuracy Rate' },
  { value: '50+', label: 'Police Stations' },
  { value: '24/7', label: 'AI Assistant' }
];

export function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">Trusted by 50+ Law Enforcement Agencies</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
                <span className="text-slate-100">AI-Powered</span>
                <br />
                <span className="text-gold-gradient">Legal Investigation</span>
                <br />
                <span className="text-slate-100">Assistant</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                Revolutionize your case investigations with intelligent AI analysis, 
                automated lead generation, and comprehensive evidence mapping. 
                Built for lawyers, police, and legal investigators.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/upload"
                  className="btn-gold px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <Shield className="w-5 h-5" />
                  <span>Analyze a Case</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-outline-gold px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2 w-full sm:w-auto justify-center"
                >
                  <BarChart3 className="w-5 h-5" />
                  <span>View Dashboard</span>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl sm:text-4xl font-bold text-gold-gradient">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Streamline your investigation process with our AI-powered platform in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Case', desc: 'Submit FIR, evidence, and witness statements' },
              { step: '02', title: 'AI Analysis', desc: 'Our algorithms analyze patterns and inconsistencies' },
              { step: '03', title: 'Get Insights', desc: 'Receive intelligent leads and recommendations' },
              { step: '04', title: 'Solve Faster', desc: 'Accelerate case resolution with data-driven insights' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="glass-card rounded-xl p-6 text-center h-full">
                  <span className="text-5xl font-bold text-amber-500/20">{item.step}</span>
                  <h3 className="text-lg font-semibold text-slate-200 mt-4 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="w-8 h-8 text-amber-500/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">Powerful Features</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive tools designed specifically for legal investigations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card rounded-xl p-6 hover:border-amber-500/30 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-200 mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-100 mb-6">
                  Trusted by Legal Professionals
                </h2>
                <div className="space-y-4">
                  {[
                    'End-to-end encryption for sensitive case data',
                    'Compliance with IT Act and data protection laws',
                    'Role-based access control for secure collaboration',
                    'Audit logs for complete transparency'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-6 text-center">
                  <Users className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-100">500+</p>
                  <p className="text-sm text-slate-500">Active Users</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-100">100%</p>
                  <p className="text-sm text-slate-500">Secure</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-100">60%</p>
                  <p className="text-sm text-slate-500">Time Saved</p>
                </div>
                <div className="glass rounded-xl p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                  <p className="text-2xl font-bold text-slate-100">95%</p>
                  <p className="text-sm text-slate-500">Accuracy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6">
            Ready to Transform Your Investigations?
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Join hundreds of legal professionals using JusticeBot to solve cases faster 
            and with greater accuracy. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upload"
              className="btn-gold px-8 py-4 rounded-xl font-semibold text-lg flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Free Trial</span>
            </Link>
            <Link
              to="/dashboard"
              className="btn-outline-gold px-8 py-4 rounded-xl font-semibold text-lg"
            >
              View Demo
            </Link>
          </div>
          
          {/* Disclaimer */}
          <div className="mt-12 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <p className="text-xs text-slate-500">
              <strong className="text-slate-400">Disclaimer:</strong> This tool provides AI-generated insights and does not replace legal judgment. 
              All outputs should be verified by qualified legal professionals before use in proceedings.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Shield className="w-4 h-4 text-slate-950" />
              </div>
              <span className="font-bold text-slate-200">JusticeBot</span>
            </div>
            <p className="text-sm text-slate-500">
              © 2024 JusticeBot. Built for Indian Legal System.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
