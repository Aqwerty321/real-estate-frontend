import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ErrorToast({ message, onClose }) {
    useEffect(() => {
        if (message) {
            const timer = setTimeout(onClose, 8000);
            return () => clearTimeout(timer);
        }
    }, [message, onClose]);

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 50, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-6 right-6 z-50 max-w-md"
                >
                    <div className="bg-crimson-500/10 border border-crimson-500/30 backdrop-blur-xl rounded-xl p-4 shadow-2xl shadow-crimson-500/10">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-crimson-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <AlertTriangle className="w-4 h-4 text-crimson-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white mb-1">Error</p>
                                <p className="text-xs text-navy-200 leading-relaxed line-clamp-3">
                                    {message}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex-shrink-0 w-6 h-6 rounded-md hover:bg-white/5 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5 text-navy-400" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
