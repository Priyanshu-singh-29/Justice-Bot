import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  MapPin, 
  User, 
  FileText, 
  Camera, 
  Phone,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: string;
  time: string;
  title: string;
  description: string;
  type: 'incident' | 'witness' | 'evidence' | 'communication' | 'location';
  confidence: number;
  verified: boolean;
}

const sampleEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: '2024-01-15T09:30:00',
    time: '09:30 AM',
    title: 'Initial Report Filed',
    description: 'FIR #2024/001 filed at Lajpat Nagar Police Station regarding theft at residence.',
    type: 'incident',
    confidence: 95,
    verified: true
  },
  {
    id: '2',
    timestamp: '2024-01-15T10:15:00',
    time: '10:15 AM',
    title: 'Crime Scene Investigation',
    description: 'Forensic team arrived. Identified forced entry through rear window. Collected fingerprints.',
    type: 'evidence',
    confidence: 88,
    verified: true
  },
  {
    id: '3',
    timestamp: '2024-01-15T14:30:00',
    time: '02:30 PM',
    title: 'Witness Interview - Mrs. Sharma',
    description: 'Neighbor reported seeing suspicious individual near premises at 08:45 AM.',
    type: 'witness',
    confidence: 72,
    verified: false
  },
  {
    id: '4',
    timestamp: '2024-01-15T16:00:00',
    time: '04:00 PM',
    title: 'CCTV Footage Retrieved',
    description: 'Obtained footage from nearby shop camera. Shows individual matching description.',
    type: 'evidence',
    confidence: 91,
    verified: true
  },
  {
    id: '5',
    timestamp: '2024-01-16T09:00:00',
    time: '09:00 AM',
    title: 'Phone Records Analysis',
    description: 'Victim received call from unknown number at 08:30 AM. Duration: 2 minutes.',
    type: 'communication',
    confidence: 85,
    verified: true
  }
];

const typeIcons = {
  incident: Clock,
  witness: User,
  evidence: Camera,
  communication: Phone,
  location: MapPin
};

const typeColors = {
  incident: 'bg-red-500/20 text-red-400 border-red-500/30',
  witness: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  evidence: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  communication: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  location: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
};

export function Timeline() {
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<string>('all');

  const toggleEvent = (id: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedEvents(newExpanded);
  };

  const filteredEvents = filter === 'all' 
    ? sampleEvents 
    : sampleEvents.filter(e => e.type === filter);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Case Timeline</h3>
          <p className="text-sm text-slate-400 mt-1">Chronological reconstruction of events</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-amber-500/50 focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="incident">Incidents</option>
            <option value="witness">Witnesses</option>
            <option value="evidence">Evidence</option>
            <option value="communication">Communications</option>
          </select>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 timeline-line rounded-full" />

        <div className="space-y-4">
          {filteredEvents.map((event, index) => {
            const Icon = typeIcons[event.type];
            const isExpanded = expandedEvents.has(event.id);
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative pl-16"
              >
                {/* Timeline Node */}
                <div className={`absolute left-0 w-12 h-12 rounded-full border-2 flex items-center justify-center ${typeColors[event.type]}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Event Card */}
                <div 
                  className="glass rounded-lg p-4 border border-slate-700/50 hover:border-amber-500/30 transition-all cursor-pointer"
                  onClick={() => toggleEvent(event.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-sm font-mono text-amber-400">{event.time}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${typeColors[event.type]}`}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        {event.verified && (
                          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Verified
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-slate-200">{event.title}</h4>
                      <p className="text-sm text-slate-400 mt-1">{event.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-center">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                          <span className="text-xs font-bold text-amber-400">{event.confidence}%</span>
                        </div>
                        <span className="text-xs text-slate-500">Confidence</span>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-slate-700/50"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Evidence ID</p>
                          <p className="text-sm font-mono text-slate-300">EVD-{event.id.padStart(4, '0')}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Recorded By</p>
                          <p className="text-sm text-slate-300">SI Rajesh Kumar</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Location</p>
                          <p className="text-sm text-slate-300 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 text-amber-500" />
                            Lajpat Nagar, Delhi
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Related Documents</p>
                          <p className="text-sm text-slate-300 flex items-center">
                            <FileText className="w-3 h-3 mr-1 text-blue-400" />
                            2 files attached
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
