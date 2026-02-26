import { motion } from 'framer-motion';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import { sectionVariants } from '../motion/variants';

function getTrendConfig(trend) {
  const normalized = (trend || '').toLowerCase();
  if (normalized.includes('rising') || normalized.includes('up')) {
    return {
      icon: TrendingUp,
      label: 'Rising',
      badgeClass: 'text-emerald-200 bg-emerald-500/20 border-emerald-300/45',
      glowClass: 'trend-glow-rising',
    };
  }
  if (normalized.includes('declining') || normalized.includes('down') || normalized.includes('fall')) {
    return {
      icon: TrendingDown,
      label: 'Declining',
      badgeClass: 'text-crimson-100 bg-crimson-500/20 border-crimson-300/45',
      glowClass: 'trend-glow-declining',
    };
  }
  return {
    icon: Minus,
    label: 'Stable',
    badgeClass: 'text-navy-100 bg-navy-500/25 border-navy-300/40',
    glowClass: 'trend-glow-stable',
  };
}

function formatPrice(price) {
  if (!price && price !== 0) return 'N/A';

  const numeric =
    typeof price === 'string' ? Number.parseFloat(price.replace(/[^0-9.]/g, '')) : Number(price);

  if (Number.isNaN(numeric)) return String(price);
  if (numeric >= 1_000_000) return `$${(numeric / 1_000_000).toFixed(1)}M`;
  if (numeric >= 1_000) return `$${Math.round(numeric / 1_000)}K`;
  return `$${numeric.toLocaleString()}`;
}

export default function MarketIntelligence({ data }) {
  if (!data) return null;

  const { location_name, market_trend, average_price_usd, trend_summary } = data;
  const trend = getTrendConfig(market_trend);
  const TrendIcon = trend.icon;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      className={`surface-glass-soft rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 mb-10 relative overflow-hidden ${trend.glowClass}`}
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
          <div className="inline-flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-gold-300" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
              Market Intelligence
            </span>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${trend.badgeClass}`}>
            <TrendIcon className="w-3.5 h-3.5" />
            {trend.label}
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-navy-300">
              <MapPin className="w-3.5 h-3.5" />
              {location_name || 'Market Region'}
            </p>

            <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white leading-tight mt-3">
              Strategic market pulse for modern acquisition.
            </h3>

            <p className="mt-4 text-sm sm:text-base text-navy-100/90 leading-relaxed max-w-2xl">
              {trend_summary || 'No trend summary available.'}
            </p>
          </div>

          <div className="lg:col-span-5 grid sm:grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="surface-solid rounded-2xl border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-navy-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Average Price
              </p>
              <p className="mt-3 text-3xl font-semibold text-white">{formatPrice(average_price_usd)}</p>
            </div>

            <div className="surface-solid rounded-2xl border border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-navy-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Positioning
              </p>
              <p className="mt-3 text-sm text-navy-100 leading-relaxed">
                Prioritize assets with pricing power, resilient neighborhood demand, and differentiated amenity packages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
