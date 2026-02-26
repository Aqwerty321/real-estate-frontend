import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MapPin, Sparkles } from 'lucide-react';
import { heroContentVariants } from '../motion/variants';

export default function HeroCinematic({
  locationLabel,
  headline,
  subcopy,
  images,
  isLoading,
  scrollProgress = 0,
}) {
  const prefersReducedMotion = useReducedMotion();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const safeImages = useMemo(
    () => (Array.isArray(images) ? images.filter(Boolean) : []),
    [images]
  );

  useEffect(() => {
    if (safeImages.length < 2 || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % safeImages.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, [safeImages, prefersReducedMotion]);

  useEffect(() => {
    if (!safeImages[0]) return;

    const firstImage = new Image();
    firstImage.src = safeImages[0];

    if (safeImages[1]) {
      const secondImage = new Image();
      secondImage.src = safeImages[1];
    }
  }, [safeImages]);

  const parallaxY = prefersReducedMotion ? 0 : scrollProgress * 42;
  const resolvedActiveIndex = safeImages.length > 0 ? activeImageIndex % safeImages.length : 0;

  return (
    <section className="hero-cinematic relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        {safeImages.map((image, index) => {
          const isActive = index === resolvedActiveIndex;

          return (
            <motion.div
              key={`${image}-${index}`}
              className="absolute inset-0 hero-image-layer"
              style={{ backgroundImage: `url(${image})` }}
              initial={false}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? (prefersReducedMotion ? 1.04 : 1.1) : 1.04,
                y: isActive ? -parallaxY : 0,
              }}
              transition={{
                opacity: { duration: 1.05, ease: 'easeOut' },
                scale: { duration: 8.2, ease: 'linear' },
                y: { duration: 0.25, ease: 'linear' },
              }}
            />
          );
        })}
      </div>

      <div className="hero-overlay" />
      <div className="ambient-grain absolute inset-0 opacity-50" />
      <div className="hero-vignette" />

      <div className="relative z-10 h-full px-4 sm:px-8">
        <div className="max-w-7xl mx-auto min-h-screen flex flex-col justify-center items-center pt-28 pb-60 sm:pb-72">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={heroContentVariants}
            className="max-w-6xl text-center"
          >
            <p className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.2em] text-gold-200 border border-gold-300/25 bg-navy-950/45 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Cinematic Intelligence Layer
            </p>

            <h1 className="font-display mt-8 text-[clamp(3.25rem,8.5vw,9rem)] leading-[0.9] text-white text-balance">
              {headline}
            </h1>

            <p className="mt-7 text-[clamp(1.05rem,2.1vw,1.55rem)] text-navy-100/92 leading-relaxed max-w-4xl mx-auto">
              {subcopy}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-gold-300" />
                {locationLabel}
              </span>

              {isLoading && (
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-400/35 px-4 py-2 text-xs font-semibold text-emerald-200">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                  Synthesizing live market data
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
