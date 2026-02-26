import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, BarChart3, Globe, FileSearch, Cpu } from 'lucide-react';

const STEPS = [
  { text: 'Analyzing macro trend signals', icon: BarChart3 },
  { text: 'Discovering active premium listings', icon: Globe },
  { text: 'Extracting listing intelligence', icon: FileSearch },
  { text: 'Normalizing financial metrics', icon: Cpu },
  { text: 'Building final portfolio payload', icon: Brain },
];

export default function StreamingLoader({ compact = false }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % STEPS.length);
    }, 2300);
    return () => window.clearInterval(interval);
  }, []);

  const progress = ((currentStep + 1) / STEPS.length) * 100;
  const IconComponent = STEPS[currentStep].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`surface-glass-soft rounded-2xl border border-white/10 ${
        compact ? 'p-4 sm:p-5' : 'p-8 sm:p-10'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative w-11 h-11 rounded-xl bg-navy-950/70 border border-white/15 flex items-center justify-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-gold-300/30 via-gold-500/10 to-transparent"
            animate={{ opacity: [0.4, 0.85, 0.4] }}
            transition={{ duration: 1.7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ scale: 0.6, opacity: 0, rotate: -80 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.6, opacity: 0, rotate: 80 }}
              transition={{ duration: 0.28 }}
              className="relative z-10"
            >
              <IconComponent className="w-5 h-5 text-gold-200" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -8, opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="text-sm font-semibold text-white"
            >
              {STEPS[currentStep].text}
            </motion.p>
          </AnimatePresence>
          <p className="text-xs text-navy-300 mt-1">
            Step {currentStep + 1} of {STEPS.length}
          </p>
        </div>
      </div>

      <div className="mt-4 h-1.5 bg-navy-900/75 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 rounded-full"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}
