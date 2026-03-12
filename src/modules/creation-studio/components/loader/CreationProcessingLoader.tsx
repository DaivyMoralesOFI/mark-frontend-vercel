import React, { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface CreationProcessingLoaderProps {
  className?: string;
}

const MESSAGES = [
  "Creating your image...",
  "Applying style guides...",
  "Refining details...",
  "Optimizing colors...",
  "Finalizing your masterpiece...",
];

export const CreationProcessingLoader: React.FC<CreationProcessingLoaderProps> = ({ className }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "relative flex items-center gap-4 px-6 py-4 overflow-hidden",
      "bg-surface-container-lowest/95 dark:bg-[#1C1C1C]/95 backdrop-blur-2xl",
      "border border-outline-variant/60 dark:border-outline/10",
      "rounded-[1.25rem] shadow-2xl shadow-black/10",
      className
    )}>
      {/* Animated Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-pulse pointer-events-none" />

      {/* Icon Section */}
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
        <div className="relative bg-primary/10 p-2 rounded-xl border border-primary/20">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
        </div>
      </div>

      {/* Text Section */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold bg-gradient-to-r from-on-surface to-on-surface/70 bg-clip-text text-transparent dark:from-white dark:to-white/70">
            {MESSAGES[messageIndex]}
          </span>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary/60" />
        </div>
        <p className="text-[11px] text-on-surface-variant/50 font-medium uppercase tracking-wider">
          Processing with Mark AI
        </p>
      </div>

      {/* Simulated Progress Line at the bottom */}
      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent w-full">
        <div className="h-full bg-primary animate-shimmer w-full" 
             style={{ 
               background: 'linear-gradient(90deg, transparent 0%, var(--primary) 50%, transparent 100%)',
               backgroundSize: '200% 100%',
               animation: 'shimmer 2s infinite linear'
             }} 
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};
