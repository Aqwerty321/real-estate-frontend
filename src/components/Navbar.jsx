import { Building2, TrendingUp, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { navVariants } from '../motion/variants';

export default function Navbar({ isScrolled = false }) {
  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={navVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'surface-glass-strong border-b border-white/10 shadow-xl shadow-navy-950/35'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/30">
            <Building2 className="w-5 h-5 text-navy-950" />
          </div>
          <div>
            <h1 className="font-display text-lg tracking-tight text-white leading-none">Meridian</h1>
            <p className="text-[10px] font-semibold tracking-[0.22em] text-gold-300 uppercase">
              Intelligence
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-7">
          <a href="#" className="nav-link-luxury">
            Dashboard
          </a>
          <a href="#" className="nav-link-luxury">
            Portfolio
          </a>
          <a href="#" className="nav-link-luxury">
            Analytics
          </a>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
            <span className="text-xs font-medium text-emerald-200 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Live
            </span>
          </div>

          <button
            type="button"
            className="md:hidden w-9 h-9 rounded-lg border border-white/20 bg-white/5 text-white flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
