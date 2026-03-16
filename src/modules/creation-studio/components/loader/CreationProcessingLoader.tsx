import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
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

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  show:   { opacity: 1, y: 0,  filter: "blur(0px)", transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit:   { opacity: 0, y: -12, filter: "blur(6px)", transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] } },
};

export const CreationProcessingLoader: React.FC<CreationProcessingLoaderProps> = ({
  className,
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={cn("fixed inset-0 z-[9999] flex items-center justify-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-background/75 backdrop-blur-xl"
        initial={{ backdropFilter: "blur(0px)", opacity: 0 }}
        animate={{ backdropFilter: "blur(20px)", opacity: 1 }}
        exit={{ backdropFilter: "blur(0px)", opacity: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* Content */}
      <motion.div
        className="relative flex flex-col items-center gap-10"
        variants={stagger}
        initial="hidden"
        animate="show"
        exit="exit"
      >
        {/* Animated icon */}
        <motion.div
          className="relative flex items-center justify-center"
          variants={fadeUp}
        >
          {/* Pulsing rings */}
          <motion.div
            className="absolute w-28 h-28 rounded-full border border-primary/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-20 h-20 rounded-full border border-primary/20"
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.15, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Core icon */}
          <div className="relative w-14 h-14 rounded-2xl bg-primary/8 border border-primary/15 flex items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-primary/10 blur-2xl" />
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-6 h-6 text-primary relative z-10" />
            </motion.div>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          variants={fadeUp}
        >
          <span className="text-[13px] font-medium text-on-surface-variant/40 uppercase tracking-[0.12em]">
            Processing with Mark AI
          </span>

          <div className="h-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                className="text-[17px] font-semibold text-on-surface tracking-tight"
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
                exit={{   opacity: 0, y: -10, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                {MESSAGES[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Animated dots */}
        <motion.div className="flex items-center gap-2" variants={fadeUp}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary/50"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.18,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
