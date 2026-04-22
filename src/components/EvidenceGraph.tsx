import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, FileText, Link2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface Node {
  id: string;
  type: 'suspect' | 'victim' | 'witness' | 'location' | 'evidence';
  label: string;
  x: number;
  y: number;
  confidence: number;
}

interface Edge {
  source: string;
  target: string;
  label: string;
  strength: number;
}

const nodes: Node[] = [
  { id: 's1', type: 'suspect', label: 'Rahul Verma', x: 200, y: 150, confidence: 78 },
  { id: 'v1', type: 'victim', label: 'Mrs. Gupta', x: 500, y: 150, confidence: 100 },
  { id: 'w1', type: 'witness', label: 'Mrs. Sharma', x: 350, y: 50, confidence: 85 },
  { id: 'w2', type: 'witness', label: 'Mr. Patel', x: 100, y: 250, confidence: 72 },
  { id: 'l1', type: 'location', label: 'Lajpat Nagar', x: 400, y: 250, confidence: 95 },
  { id: 'l2', type: 'location', label: 'Crime Scene', x: 450, y: 200, confidence: 98 },
  { id: 'e1', type: 'evidence', label: 'CCTV Footage', x: 300, y: 180, confidence: 91 },
  { id: 'e2', type: 'evidence', label: 'Fingerprints', x: 380, y: 120, confidence: 88 },
  { id: 'e3', type: 'evidence', label: 'Phone Records', x: 250, y: 220, confidence: 85 },
];

const edges: Edge[] = [
  { source: 's1', target: 'l1', label: 'Seen near', strength: 0.7 },
  { source: 's1', target: 'e3', label: 'Contact', strength: 0.8 },
  { source: 'v1', target: 'l2', label: 'Residence', strength: 1.0 },
  { source: 'v1', target: 'e2', label: 'Evidence found', strength: 0.9 },
  { source: 'w1', target: 's1', label: 'Identified', strength: 0.7 },
  { source: 'w1', target: 'l1', label: 'Observed at', strength: 0.8 },
  { source: 'w2', target: 'l1', label: 'Present at', strength: 0.6 },
  { source: 'l2', target: 'e1', label: 'Recorded by', strength: 0.95 },
  { source: 'l2', target: 'e2', label: 'Collected at', strength: 0.9 },
  { source: 'e3', target: 's1', label: 'Links to', strength: 0.85 },
];

const nodeColors = {
  suspect: { bg: '#ef4444', border: '#dc2626' },
  victim: { bg: '#f59e0b', border: '#d97706' },
  witness: { bg: '#3b82f6', border: '#2563eb' },
  location: { bg: '#10b981', border: '#059669' },
  evidence: { bg: '#d4a853', border: '#b8941d' },
};

const nodeIcons = {
  suspect: User,
  victim: User,
  witness: User,
  location: MapPin,
  evidence: FileText,
};

export function EvidenceGraph() {
  const [scale, setScale] = useState(1);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setScale(s => Math.min(s + 0.2, 2));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const handleReset = () => setScale(1);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-100">Evidence Relationship Map</h3>
          <p className="text-sm text-slate-400 mt-1">Visual connections between entities</p>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={handleZoomOut} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-amber-400 transition-colors">
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm text-slate-400 w-12 text-center">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-amber-400 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
          <button onClick={handleReset} className="p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-amber-400 transition-colors">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Graph Canvas */}
        <div 
          ref={containerRef}
          className="flex-1 relative h-96 bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden"
        >
          <svg 
            viewBox="0 0 600 350" 
            className="w-full h-full"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
          >
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#d4a853" />
                <stop offset="100%" stopColor="#f0d78c" />
              </linearGradient>
            </defs>

            {/* Edges */}
            {edges.map((edge, index) => {
              const sourceNode = nodes.find(n => n.id === edge.source);
              const targetNode = nodes.find(n => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isHighlighted = hoveredNode && (edge.source === hoveredNode || edge.target === hoveredNode);

              return (
                <g key={index}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={isHighlighted ? '#d4a853' : '#475569'}
                    strokeWidth={isHighlighted ? 3 : 2}
                    strokeOpacity={hoveredNode && !isHighlighted ? 0.2 : edge.strength}
                    markerEnd="url(#arrowhead)"
                    className="edge"
                  />
                  {/* Edge Label */}
                  <text
                    x={(sourceNode.x + targetNode.x) / 2}
                    y={(sourceNode.y + targetNode.y) / 2 - 5}
                    fill={isHighlighted ? '#d4a853' : '#94a3b8'}
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono"
                    opacity={hoveredNode && !isHighlighted ? 0.2 : 1}
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const Icon = nodeIcons[node.type];
              const colors = nodeColors[node.type];
              const isHovered = hoveredNode === node.id;
              const isDimmed = hoveredNode && hoveredNode !== node.id && 
                !edges.some(e => (e.source === hoveredNode && e.target === node.id) || 
                                (e.target === hoveredNode && e.source === node.id));

              return (
                <g
                  key={node.id}
                  className="node cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => setSelectedNode(node)}
                  opacity={isDimmed ? 0.3 : 1}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isHovered ? 28 : 25}
                    fill={`${colors.bg}20`}
                    stroke={isHovered ? '#d4a853' : colors.border}
                    strokeWidth={isHovered ? 3 : 2}
                    className="transition-all duration-300"
                  />
                  <foreignObject x={node.x - 10} y={node.y - 10} width={20} height={20}>
                    <div className="flex items-center justify-center w-full h-full">
                      <Icon className="w-5 h-5" style={{ color: colors.bg }} />
                    </div>
                  </foreignObject>
                  <text
                    x={node.x}
                    y={node.y + 40}
                    fill={isHovered ? '#d4a853' : '#e2e8f0'}
                    fontSize="11"
                    textAnchor="middle"
                    className="font-medium"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend & Details */}
        <div className="w-64 space-y-4">
          {/* Legend */}
          <div className="glass rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Legend</h4>
            <div className="space-y-2">
              {Object.entries(nodeColors).map(([type, colors]) => {
                const Icon = nodeIcons[type as keyof typeof nodeIcons];
                return (
                  <div key={type} className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${colors.bg}30`, border: `1px solid ${colors.border}` }}>
                      <Icon className="w-3 h-3" style={{ color: colors.bg }} />
                    </div>
                    <span className="text-xs text-slate-400 capitalize">{type}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-lg p-4 border border-amber-500/30"
            >
              <h4 className="text-sm font-semibold text-amber-400 mb-2">{selectedNode.label}</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Type:</span>
                  <span className="text-slate-300 capitalize">{selectedNode.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Confidence:</span>
                  <span className="text-amber-400 font-mono">{selectedNode.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Connections:</span>
                  <span className="text-slate-300">
                    {edges.filter(e => e.source === selectedNode.id || e.target === selectedNode.id).length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="glass rounded-lg p-4">
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Network Stats</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-lg font-bold text-amber-400">{nodes.length}</p>
                <p className="text-xs text-slate-500">Entities</p>
              </div>
              <div className="bg-slate-800/50 rounded p-2 text-center">
                <p className="text-lg font-bold text-blue-400">{edges.length}</p>
                <p className="text-xs text-slate-500">Connections</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
