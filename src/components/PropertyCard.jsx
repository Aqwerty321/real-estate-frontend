import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize, ExternalLink, MapPin, Tag } from 'lucide-react';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop&q=80';

function formatPrice(price) {
    if (!price && price !== 0) return '';
    const str = String(price);
    // If already formatted with $ or currency symbol
    if (str.includes('$') || str.includes('€') || str.includes('£')) return str;
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return str;
    return `$${num.toLocaleString()}`;
}

export default function PropertyCard({ property, index }) {
    const [imgError, setImgError] = useState(false);

    const {
        title,
        type,
        price_local_currency,
        price_usd,
        hero_image_url,
        beds,
        baths,
        area,
        features = [],
        source_url,
    } = property;

    const imageUrl = imgError || !hero_image_url ? FALLBACK_IMAGE : hero_image_url;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
            className="glass-card-light rounded-2xl overflow-hidden group hover:border-navy-500/30 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative h-52 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={title || 'Property'}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

                {/* Type badge */}
                {type && (
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-navy-950/70 backdrop-blur-sm text-[11px] font-semibold text-white border border-white/10">
                        {type}
                    </span>
                )}

                {/* Price overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                        <p className="text-lg font-bold text-white drop-shadow-lg">
                            {formatPrice(price_usd || price_local_currency)}
                        </p>
                        {price_local_currency && price_usd && (
                            <p className="text-[11px] text-navy-200/80">
                                {formatPrice(price_local_currency)} local
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Title */}
                <h3 className="text-sm font-bold text-white mb-3 leading-snug line-clamp-2 group-hover:text-gold-400 transition-colors">
                    {title || 'Luxury Property'}
                </h3>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-navy-300">
                    {beds != null && (
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                            <Bed className="w-3.5 h-3.5" />
                            {beds}
                        </span>
                    )}
                    {baths != null && (
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                            <Bath className="w-3.5 h-3.5" />
                            {baths}
                        </span>
                    )}
                    {area && (
                        <span className="flex items-center gap-1.5 text-xs font-medium">
                            <Maximize className="w-3.5 h-3.5" />
                            {area}
                        </span>
                    )}
                </div>

                {/* Feature pills */}
                {features.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {features.slice(0, 4).map((feat, i) => (
                            <span
                                key={i}
                                className="px-2 py-0.5 rounded-md bg-navy-700/50 text-[10px] font-medium text-navy-300 border border-navy-600/30"
                            >
                                {feat}
                            </span>
                        ))}
                        {features.length > 4 && (
                            <span className="px-2 py-0.5 rounded-md bg-navy-700/50 text-[10px] font-medium text-navy-400 border border-navy-600/30">
                                +{features.length - 4}
                            </span>
                        )}
                    </div>
                )}

                {/* Source link */}
                {source_url && (
                    <a
                        href={source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
                    >
                        View Source Listing
                        <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>
        </motion.div>
    );
}
