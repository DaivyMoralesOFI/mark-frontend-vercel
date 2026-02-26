import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface ShineBorderButtonProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  borderWidth?: number;
  onClick?: () => void;
}

const ShineBorderButton: React.FC<ShineBorderButtonProps> = ({
  children,
  className = '',
  duration = 14,
  borderWidth = 1,
  onClick,
}) => {
  const colors = ["#FF0080", "#7928CA", "#0070F3", "#38bdf8"];
  
  return (
    <div className="relative inline-block">
      <div className="absolute inset-0 overflow-hidden rounded-lg">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(90deg, ${colors.join(', ')})`,
            backgroundSize: '400% 100%',
            padding: borderWidth,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '200% 0%'],
          }}
          transition={{
            duration,
            ease: 'linear',
            repeat: Infinity,
          }}
        />
      </div>
      <Button
        variant="default"
        onClick={onClick}
        className={`relative z-10 px-2 py-2 ${className}`}
        style={{ margin: borderWidth }}
      >
        {children}
      </Button>
    </div>
  );
};

export default ShineBorderButton;