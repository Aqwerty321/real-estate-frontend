import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Brain, BarChart3, Globe, FileSearch, Cpu } from 'lucide-react';

const STEPS = [
    { text: 'Analyzing Macro Trends...', icon: BarChart3 },
    { text: 'Scraping Active Listings...', icon: Globe },
    { text: 'Evaluating Property Data...', icon: FileSearch },
    { text: 'Synthesizing Financial Data...', icon: Cpu },
    { text: 'Building Intelligence Report...', icon: Brain },
];

export default function StreamingLoader() {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep((prev) => (prev + 1) % STEPS.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    const progress = ((currentStep + 1) / STEPS.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-2xl p-10 text-center max-w-lg mx-auto"
        >
            {/* Animated orb */}
            <div className="relative w-20 h-20 mx-auto mb-8">
                <motion.div
                    className="absolute inset-0 rounded-full bg-gold-500/20"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute inset-2 rounded-full bg-gold-500/30"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
                />
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ scale: 0.5, opacity: 0, rotate: -90 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.5, opacity: 0, rotate: 90 }}
                            transition={{ duration: 0.3 }}
                        >
                            {(() => {
                                const IconComponent = STEPS[currentStep].icon;
                                return <IconComponent className="w-5 h-5 text-navy-950" />;
                            })()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Step text */}
            <AnimatePresence mode="wait">
                <motion.p
                    key={currentStep}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-semibold text-white mb-2"
                >
                    {STEPS[currentStep].text}
                </motion.p>
            </AnimatePresence>

            <p className="text-xs text-navy-400 mb-6">
                Step {currentStep + 1} of {STEPS.length}
            </p>

            {/* Progress bar */}
            <div className="w-full h-1 bg-navy-800 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            </div>
        </motion.div>
    );
}
