import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, AlertTriangle } from 'lucide-react';
import QueryBuilder from './QueryBuilder';
import StreamingLoader from './StreamingLoader';
import { dockVariants } from '../motion/variants';

export default function QueryDock({ onSubmit, isLoading, error, onRetry }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={dockVariants}
      className="relative max-w-6xl mx-auto"
    >
      <div className="surface-glass-strong rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-navy-950/40 border border-white/10">
        <QueryBuilder onSubmit={onSubmit} isLoading={isLoading} variant="overlay" compact />
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-4"
          >
            <StreamingLoader compact />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 rounded-2xl border border-crimson-400/35 bg-crimson-500/10 px-4 py-3 text-sm text-crimson-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <p className="flex items-center gap-2 leading-snug">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
