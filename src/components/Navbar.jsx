import { Building2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-navy-700/50"
        >
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-navy-950" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                            Meridian
                        </h1>
                        <p className="text-[10px] font-medium tracking-[0.2em] text-gold-400 uppercase">
                            Intelligence
                        </p>
                    </div>
                </div>

                {/* Navigation links */}
                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-medium text-navy-300 hover:text-white transition-colors">
                        Dashboard
                    </a>
                    <a href="#" className="text-sm font-medium text-navy-300 hover:text-white transition-colors">
                        Portfolio
                    </a>
                    <a href="#" className="text-sm font-medium text-navy-300 hover:text-white transition-colors">
                        Analytics
                    </a>
                </div>

                {/* Status pill */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Live
                    </span>
                </div>
            </div>
        </motion.nav>
    );
}
