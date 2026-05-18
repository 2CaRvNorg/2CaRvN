import { motion } from 'motion/react';

interface BadgeProps {
  icon: string;
  title: string;
  earned?: boolean;
}

export function Badge({ icon, title, earned = false }: BadgeProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-[20px]
        ${earned ? 'bg-gradient-to-br from-[#D4AF37] to-[#f0d875]' : 'bg-[#e8e4dc]'}
      `}
    >
      <div className={`text-3xl ${earned ? 'grayscale-0' : 'grayscale opacity-40'}`}>
        {icon}
      </div>
      <span className={`text-sm ${earned ? 'text-[#1a1a1a]' : 'text-[#757575]'}`}>
        {title}
      </span>
    </motion.div>
  );
}
