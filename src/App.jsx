import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import QueryBuilder from './components/QueryBuilder';
import QueryDock from './components/QueryDock';
import HeroCinematic from './components/HeroCinematic';
import MarketIntelligence from './components/MarketIntelligence';
import PropertyGrid from './components/PropertyGrid';
import ErrorToast from './components/ErrorToast';
import StreamingLoader from './components/StreamingLoader';
import { fetchMarketReport } from './utils/api';
import { heroImages } from './constants/heroImages';
import { useScrollProgress } from './hooks/useScrollProgress';

const UI_EXPERIENCE = import.meta.env.VITE_UI_EXPERIENCE || 'cinematic';

function createHeroStack(results) {
  const listingImages = (results?.properties || [])
    .map((property) => property.hero_image_url)
    .filter(Boolean);

  const uniqueImages = [...new Set([...listingImages, ...heroImages])];
  return uniqueImages.slice(0, 6);
}

function LegacyView({ loading, results, error, onSubmit, onCloseError }) {
  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar isScrolled />

      <main className="relative pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-gold-300 mb-3">
            AI-Powered Intelligence
          </p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Real Estate Market <span className="text-gradient-gold">Analysis</span>
          </h1>
          <p className="text-sm sm:text-base text-navy-200 max-w-2xl mx-auto leading-relaxed">
            Leverage advanced AI to analyze market trends, discover premium properties, and make
            data-driven investment decisions.
          </p>
        </div>

        <div className="mb-12">
          <QueryBuilder onSubmit={onSubmit} isLoading={loading} />
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <div className="mb-12">
              <StreamingLoader />
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {results && !loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {results.region_analysis && <MarketIntelligence data={results.region_analysis} />}
              {results.properties?.length > 0 && (
                <PropertyGrid properties={results.properties} featuredLayout={false} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative border-t border-navy-800/50 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">© 2026 Meridian Intelligence. All rights reserved.</p>
          <p className="text-xs text-navy-500">Powered by Toolhouse AI</p>
        </div>
      </footer>

      <ErrorToast message={error} onClose={onCloseError} />
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  const { progress, isScrolled } = useScrollProgress(16);

  const handleSubmit = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    setLastMessage(message);

    try {
      const { data } = await fetchMarketReport(message);
      setResults(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An unexpected error occurred while fetching market data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (!lastMessage || loading) return;
    handleSubmit(lastMessage);
  }, [handleSubmit, lastMessage, loading]);

  if (UI_EXPERIENCE === 'legacy') {
    return (
      <LegacyView
        loading={loading}
        results={results}
        error={error}
        onSubmit={handleSubmit}
        onCloseError={() => setError(null)}
      />
    );
  }

  const locationLabel = results?.region_analysis?.location_name || 'United States Prime Markets';
  const heroHeadline = results
    ? `${locationLabel} Investment Narrative`
    : 'Cinematic Intelligence for Real Estate Capital';
  const heroSubcopy = results
    ? 'Explore live trend movement, validated listings, and structured acquisition intelligence crafted for rapid, confident decisions.'
    : 'Fuse macro market momentum with deeply scraped listings in a single premium command center built for serious buyers and investors.';
  const images = createHeroStack(results);

  return (
    <div className="min-h-screen bg-navy-950 text-white relative overflow-x-clip">
      <Navbar isScrolled={isScrolled} />

      <div className="ambient-bg fixed inset-0 pointer-events-none" />
      <div className="ambient-vignette fixed inset-0 pointer-events-none" />

      <main className="relative z-10">
        <HeroCinematic
          locationLabel={locationLabel}
          headline={heroHeadline}
          subcopy={heroSubcopy}
          images={images}
          isLoading={loading}
          scrollProgress={progress}
        />

        <div className="relative z-20 -mt-[16rem] sm:-mt-[18rem] lg:-mt-[20rem] px-4 sm:px-8">
          <QueryDock onSubmit={handleSubmit} isLoading={loading} error={error} onRetry={handleRetry} />
        </div>

        <section className="relative pt-10 sm:pt-14 pb-24 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {results && !loading ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  {results.region_analysis && <MarketIntelligence data={results.region_analysis} />}
                  {results.properties?.length > 0 && (
                    <PropertyGrid properties={results.properties} featuredLayout />
                  )}
                </motion.div>
              ) : (
                !loading && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="surface-glass-soft rounded-3xl p-8 sm:p-12 border border-white/10 text-center max-w-5xl mx-auto"
                  >
                    <p className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                      Build a market brief to start.
                    </p>
                    <p className="text-base sm:text-lg text-navy-200 max-w-3xl mx-auto">
                      Your report will include macro trend context, mapped listings, normalized
                      pricing, and source-linked evidence in one response.
                    </p>
                  </motion.div>
                )
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="relative border-t border-white/10 py-7 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-300/80">© 2026 Meridian Intelligence. All rights reserved.</p>
          <p className="text-xs text-navy-300/70">Powered by Toolhouse AI</p>
        </div>
      </footer>
    </div>
  );
}
