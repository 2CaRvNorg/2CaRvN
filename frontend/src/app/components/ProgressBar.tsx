import { motion } from 'motion/react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({ progress, showLabel = true, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        {showLabel && (
          <span className="text-sm text-[#757575]">Progress</span>
        )}
        {showLabel && (
          <span className="text-sm text-[#D4AF37]">{progress}%</span>
        )}
      </div>
      <div className="h-3 bg-[#e8e4dc] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#f0d875] rounded-full shadow-[0_0_10px_rgba(212,175,55,0.3)]"
        />
      </div>
    </div>
  );
}
