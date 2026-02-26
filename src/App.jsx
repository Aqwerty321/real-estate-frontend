import { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import QueryBuilder from './components/QueryBuilder';
import StreamingLoader from './components/StreamingLoader';
import MarketIntelligence from './components/MarketIntelligence';
import PropertyGrid from './components/PropertyGrid';
import ErrorToast from './components/ErrorToast';
import { fetchMarketReport } from './utils/api';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [runId, setRunId] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (message) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const { data, runId: newRunId } = await fetchMarketReport(message, runId);
      setRunId(newRunId);
      setResults(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'An unexpected error occurred while fetching market data.');
    } finally {
      setLoading(false);
    }
  }, [runId]);

  return (
    <div className="min-h-screen bg-navy-950">
      <Navbar />

      {/* Background gradient accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gold-500/[0.03] blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-emerald-500/[0.03] blur-3xl" />
      </div>

      <main className="relative pt-24 pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold tracking-[0.25em] uppercase text-gold-400 mb-3">
            AI-Powered Intelligence
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Real Estate Market
            <span className="text-gradient-gold"> Analysis</span>
          </h1>
          <p className="text-sm sm:text-base text-navy-300 max-w-2xl mx-auto leading-relaxed">
            Leverage advanced AI to analyze market trends, discover premium properties,
            and make data-driven investment decisions.
          </p>
        </div>

        {/* Query Builder */}
        <div className="mb-12">
          <QueryBuilder onSubmit={handleSubmit} isLoading={loading} />
        </div>

        {/* Streaming Loader */}
        <AnimatePresence mode="wait">
          {loading && (
            <div className="mb-12">
              <StreamingLoader />
            </div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && !loading && (
            <div>
              {/* Market Intelligence Board */}
              {results.region_analysis && (
                <MarketIntelligence data={results.region_analysis} />
              )}

              {/* Property Grid */}
              {results.properties && results.properties.length > 0 && (
                <PropertyGrid properties={results.properties} />
              )}
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-navy-800/50 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-500">
            © 2026 Meridian Intelligence. All rights reserved.
          </p>
          <p className="text-xs text-navy-600">
            Powered by Toolhouse AI
          </p>
        </div>
      </footer>

      {/* Error Toast */}
      <ErrorToast message={error} onClose={() => setError(null)} />
    </div>
  );
}
