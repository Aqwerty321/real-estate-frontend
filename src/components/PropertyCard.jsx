import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize, ExternalLink, MapPin, Sparkles } from 'lucide-react';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&h=900&fit=crop&q=82&auto=format';

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function formatPrice(price) {
  if (!price && price !== 0) return '';
  const value = String(price);
  if (value.includes('$') || value.includes('€') || value.includes('£')) return value;

  const numeric = Number.parseFloat(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(numeric)) return value;
  return `$${numeric.toLocaleString()}`;
}

export default function PropertyCard({ property, index, featured = false }) {
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
    address,
    features = [],
    source_url,
  } = property;

  const imageUrl = imgError || !hero_image_url ? FALLBACK_IMAGE : hero_image_url;
  const shownFeatures = featured ? features.slice(0, 6) : features.slice(0, 4);

  return (
    <motion.article
      variants={itemVariants}
      custom={index}
      className={`card-luxury rounded-3xl overflow-hidden border border-white/12 ${
        featured ? 'lg:flex min-h-[360px]' : ''
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? 'lg:w-[56%] min-h-[280px]' : 'h-56'}`}>
        <img
          src={imageUrl}
          alt={title || 'Property'}
          onError={() => setImgError(true)}
          loading={index === 0 ? 'eager' : 'lazy'}
          className="card-luxury-image w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-transparent" />

        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          {type && (
            <span className="px-2.5 py-1 rounded-lg bg-navy-950/70 backdrop-blur-sm text-[11px] font-semibold text-white border border-white/15">
              {type}
            </span>
          )}
          {featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gold-400/20 text-gold-100 border border-gold-300/35 text-[11px] font-semibold">
              <Sparkles className="w-3 h-3" />
              Signature
            </span>
          )}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <p className={`font-semibold text-white drop-shadow-lg ${featured ? 'text-2xl' : 'text-lg'}`}>
            {formatPrice(price_usd || price_local_currency)}
          </p>
          {price_local_currency && price_usd && (
            <p className="text-[11px] text-navy-100/85 mt-1">{formatPrice(price_local_currency)} local</p>
          )}
        </div>
      </div>

      <div className={`p-5 sm:p-6 ${featured ? 'lg:w-[44%] lg:flex lg:flex-col lg:justify-between' : ''}`}>
        <div>
          <h3
            className={`font-semibold text-white leading-snug text-balance ${
              featured ? 'text-xl sm:text-2xl mb-3' : 'text-base mb-3'
            }`}
          >
            {title || 'Luxury Property'}
          </h3>

          {address && (
            <p className="flex items-center gap-1.5 text-xs text-navy-300 mb-4 line-clamp-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {address}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 mb-4 text-navy-100">
            {beds != null && (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Bed className="w-3.5 h-3.5" />
                {beds} Beds
              </span>
            )}
            {baths != null && (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Bath className="w-3.5 h-3.5" />
                {baths} Baths
              </span>
            )}
            {area && (
              <span className="flex items-center gap-1.5 text-xs font-semibold">
                <Maximize className="w-3.5 h-3.5" />
                {area}
              </span>
            )}
          </div>

          {shownFeatures.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {shownFeatures.map((feature, featureIndex) => (
                <span
                  key={`${feature}-${featureIndex}`}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/12 text-[11px] font-medium text-navy-100"
                >
                  {feature}
                </span>
              ))}
              {features.length > shownFeatures.length && (
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/12 text-[11px] font-medium text-navy-300">
                  +{features.length - shownFeatures.length}
                </span>
              )}
            </div>
          )}
        </div>

        {source_url && (
          <a
            href={source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-200 hover:text-gold-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70 rounded-md w-fit"
          >
            View Source Listing
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </motion.article>
  );
}
