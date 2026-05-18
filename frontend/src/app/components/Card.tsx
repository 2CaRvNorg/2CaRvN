import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  locked?: boolean;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', locked, onClick, hover = true }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' } : undefined}
      onClick={onClick}
      className={`
        relative bg-white rounded-[24px] p-6 shadow-[0_4px_16px_rgba(0,0,0,0.04)]
        ${onClick ? 'cursor-pointer' : ''}
        ${locked ? 'opacity-60' : ''}
        ${className}
      `}
    >
      {locked && (
        <div className="absolute top-4 right-4 bg-[#2d2416] text-[#D4AF37] px-3 py-1 rounded-full text-sm flex items-center gap-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Locked
        </div>
      )}
      {children}
    </motion.div>
  );
}
