import { motion } from 'framer-motion';

interface ConfidenceScoreProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ConfidenceScore({ score, size = 'md', showLabel = true }: ConfidenceScoreProps) {
  const circumference = 2 * Math.PI * 26;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const sizeClasses = {
    sm: { container: 'w-12 h-12', text: 'text-xs' },
    md: { container: 'w-16 h-16', text: 'text-sm' },
    lg: { container: 'w-20 h-20', text: 'text-base' },
  };

  const getColor = (score: number) => {
    if (score >= 85) return '#10b981';
    if (score >= 70) return '#d4a853';
    return '#ef4444';
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className={`relative ${sizeClasses[size].container}`}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 60 60">
          <defs>
            <linearGradient id={`scoreGradient-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={color} stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Background circle */}
          <circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke="#1e293b"
            strokeWidth="4"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="30"
            cy="30"
            r="26"
            fill="none"
            stroke={`url(#scoreGradient-${score})`}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        
        {/* Score text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`font-bold ${sizeClasses[size].text}`}
            style={{ color }}
          >
            {score}%
          </motion.span>
        </div>
      </div>
      
      {showLabel && (
        <span className="text-xs text-slate-500 mt-1">Confidence</span>
      )}
    </div>
  );
}
