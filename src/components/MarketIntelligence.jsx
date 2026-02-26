import { motion } from 'framer-motion';
import { MapPin, TrendingUp, TrendingDown, Minus, DollarSign, BarChart3 } from 'lucide-react';

function getTrendConfig(trend) {
    const t = (trend || '').toLowerCase();
    if (t.includes('rising') || t.includes('up')) {
        return { color: 'emerald', icon: TrendingUp, label: 'Rising' };
    }
    if (t.includes('declining') || t.includes('down') || t.includes('falling')) {
        return { color: 'crimson', icon: TrendingDown, label: 'Declining' };
    }
    return { color: 'navy', icon: Minus, label: 'Stable' };
}

function formatPrice(price) {
    if (!price && price !== 0) return 'N/A';
    const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.]/g, '')) : price;
    if (isNaN(num)) return price;
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
    return `$${num.toLocaleString()}`;
}

export default function MarketIntelligence({ data }) {
    if (!data) return null;

    const { location_name, market_trend, average_price_usd, trend_summary } = data;
    const trend = getTrendConfig(market_trend);
    const TrendIcon = trend.icon;

    const badgeColors = {
        emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        crimson: 'bg-crimson-500/15 text-crimson-400 border-crimson-500/30',
        navy: 'bg-navy-600/30 text-navy-300 border-navy-500/30',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass-card rounded-2xl p-8 mb-8"
        >
            {/* Section label */}
            <div className="flex items-center gap-2 mb-6">
                <BarChart3 className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                    Market Intelligence
                </span>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                {/* Left: Key metrics */}
                <div className="flex-1">
                    {/* Location */}
                    <div className="flex items-center gap-3 mb-4">
                        <MapPin className="w-5 h-5 text-navy-400" />
                        <h3 className="text-2xl font-bold text-white">{location_name || 'Market Region'}</h3>
                    </div>

                    {/* Metric cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {/* Average Price */}
                        <div className="bg-navy-800/50 rounded-xl p-5 border border-navy-700/40">
                            <div className="flex items-center gap-2 mb-2">
                                <DollarSign className="w-4 h-4 text-navy-400" />
                                <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Avg. Price</span>
                            </div>
                            <p className="text-2xl font-bold text-white">
                                {formatPrice(average_price_usd)}
                            </p>
                        </div>

                        {/* Market Trend */}
                        <div className="bg-navy-800/50 rounded-xl p-5 border border-navy-700/40">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendIcon className="w-4 h-4 text-navy-400" />
                                <span className="text-xs font-semibold text-navy-400 uppercase tracking-wider">Market Trend</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColors[trend.color]}`}>
                                    <TrendIcon className="w-3 h-3" />
                                    {trend.label}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Trend summary */}
                <div className="lg:max-w-sm">
                    <div className="bg-navy-800/30 rounded-xl p-5 border border-navy-700/30">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-400 mb-3">
                            Analysis Summary
                        </h4>
                        <p className="text-sm leading-relaxed text-navy-200">
                            {trend_summary || 'No trend summary available.'}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
