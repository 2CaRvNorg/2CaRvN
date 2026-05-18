import { motion } from 'motion/react';

interface NavItem {
  icon: JSX.Element;
  label: string;
  active?: boolean;
  onClick: () => void;
}

interface BottomNavProps {
  items: NavItem[];
}

export function BottomNav({ items }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e8e4dc] px-4 py-3 safe-area-inset-bottom md:hidden z-50">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            className="flex flex-col items-center gap-1 min-w-[60px]"
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-[12px] ${item.active ? 'bg-[#D4AF37] text-[#1a1a1a]' : 'text-[#757575]'}`}
            >
              {item.icon}
            </motion.div>
            <span className={`text-xs ${item.active ? 'text-[#D4AF37]' : 'text-[#757575]'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
