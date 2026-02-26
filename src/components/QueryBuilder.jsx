import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

const LOCATIONS = [
  'Miami',
  'New York City',
  'Austin',
  'Los Angeles',
  'San Francisco',
  'Chicago',
  'Seattle',
  'Denver',
  'Boston',
  'Nashville',
];

const PROPERTY_TYPES = [
  'Luxury Condo',
  'Single Family Home',
  'Penthouse',
  'Townhouse',
  'Waterfront Villa',
  'Modern Loft',
];

const BUDGET_RANGES = [
  { label: '$500K - $1M', value: 'under $1M' },
  { label: '$1M - $3M', value: 'between $1M and $3M' },
  { label: '$3M - $5M', value: 'between $3M and $5M' },
  { label: '$5M - $10M', value: 'between $5M and $10M' },
  { label: '$10M+', value: 'over $10M' },
];

const FEATURES = [
  'Waterfront',
  'Pool',
  'City View',
  'Smart Home',
  'Garage',
  'Rooftop Terrace',
  'Wine Cellar',
  'Home Theater',
  'Gym',
  'Concierge',
];

function SelectField({ label, value, onChange, options, isOverlay, compact }) {
  return (
    <div className="relative group">
      <label
        className={`block font-semibold uppercase tracking-[0.1em] mb-2 ${
          compact ? 'text-xs' : 'text-sm'
        } ${
          isOverlay ? 'text-navy-200/85' : 'text-navy-400'
        }`}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-xl pr-10 font-semibold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70 ${
            compact ? 'px-4 py-3 text-base' : 'px-5 py-4.5 text-lg'
          } ${
            isOverlay
              ? 'bg-navy-950/65 border border-white/15 text-white hover:border-gold-300/30'
              : 'bg-navy-800/80 border border-navy-600/50 text-white hover:border-navy-500/70'
          }`}
        >
          <option value="">Select {label}</option>
          {options.map((option) => {
            const key = typeof option === 'string' ? option : option.value;
            const valueToUse = typeof option === 'string' ? option : option.value;
            const labelToUse = typeof option === 'string' ? option : option.label;

            return (
              <option key={key} value={valueToUse}>
                {labelToUse}
              </option>
            );
          })}
        </select>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
            isOverlay ? 'text-navy-300 group-hover:text-navy-200' : 'text-navy-400 group-hover:text-navy-300'
          }`}
        />
      </div>
    </div>
  );
}

function MultiSelectField({ selected, onChange, options, isOverlay, compact }) {
  const toggleFeature = (feature) => {
    if (selected.includes(feature)) {
      onChange(selected.filter((item) => item !== feature));
      return;
    }
    onChange([...selected, feature]);
  };

  return (
    <div>
      <label
        className={`block font-semibold uppercase tracking-[0.1em] mb-2 ${
          compact ? 'text-xs' : 'text-sm'
        } ${
          isOverlay ? 'text-navy-200/85' : 'text-navy-400'
        }`}
      >
        Desired Features
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((feature) => {
          const isActive = selected.includes(feature);

          return (
            <button
              key={feature}
              type="button"
              onClick={() => toggleFeature(feature)}
              className={`rounded-lg font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-300/70 ${
                compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-base'
              } ${
                isActive
                  ? 'bg-gold-400/20 border border-gold-300/50 text-gold-200'
                  : isOverlay
                    ? 'bg-white/5 border border-white/15 text-navy-100 hover:border-white/25'
                    : 'bg-navy-800/60 border border-navy-600/30 text-navy-300 hover:border-navy-500/50'
              }`}
            >
              {feature}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function QueryBuilder({
  onSubmit,
  isLoading,
  variant = 'default',
  compact = false,
}) {
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [features, setFeatures] = useState([]);

  const isOverlay = variant === 'overlay';
  const canSubmit = Boolean(location && propertyType && budget && !isLoading);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    let message = `Find me ${propertyType.toLowerCase()} properties in ${location} ${budget}`;
    if (features.length > 0) {
      message += ` with ${features.join(', ').toLowerCase()}`;
    }
    message += '.';

    onSubmit(message);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={isOverlay ? false : { y: 16, opacity: 0 }}
      animate={isOverlay ? undefined : { y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: 'easeOut' }}
      className={isOverlay ? '' : `surface-glass-soft rounded-2xl border border-white/10 ${compact ? 'p-5 sm:p-6' : 'p-7 sm:p-9'}`}
    >
      <div className={`flex items-center gap-3 ${compact ? 'mb-5' : 'mb-8'}`}>
        <div className={`rounded-xl bg-gradient-to-br from-gold-400/25 to-gold-500/15 border border-gold-300/30 flex items-center justify-center ${compact ? 'w-10 h-10' : 'w-12 h-12'}`}>
          <Search className={`text-gold-300 ${compact ? 'w-5 h-5' : 'w-6 h-6'}`} />
        </div>
        <div>
          <h2 className={`font-semibold text-white ${compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'}`}>Build Your Search Brief</h2>
          <p className={`${isOverlay ? 'text-navy-200/75' : 'text-navy-400'} ${compact ? 'text-sm' : 'text-base'}`}>
            Configure market, asset type, and investment envelope
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-3 ${compact ? 'gap-4' : 'gap-6'} ${compact ? 'mb-5' : 'mb-7'}`}>
        <SelectField
          label="Location"
          value={location}
          onChange={setLocation}
          options={LOCATIONS}
          isOverlay={isOverlay}
          compact={compact}
        />
        <SelectField
          label="Property Type"
          value={propertyType}
          onChange={setPropertyType}
          options={PROPERTY_TYPES}
          isOverlay={isOverlay}
          compact={compact}
        />
        <SelectField
          label="Budget Range"
          value={budget}
          onChange={setBudget}
          options={BUDGET_RANGES}
          isOverlay={isOverlay}
          compact={compact}
        />
      </div>

      <div className={compact ? 'mb-5' : 'mb-8'}>
        <MultiSelectField
          selected={features}
          onChange={setFeatures}
          options={FEATURES}
          isOverlay={isOverlay}
          compact={compact}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileTap={canSubmit ? { scale: 0.99 } : undefined}
        className={`w-full rounded-xl font-semibold uppercase tracking-[0.12em] transition-all flex items-center justify-center gap-2 ${
          compact ? 'py-4 text-sm' : 'py-[1.35rem] text-lg'
        } ${
          canSubmit
            ? 'bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 text-navy-950 shadow-lg shadow-gold-500/25 hover:brightness-105'
            : 'bg-navy-700/55 text-navy-400 cursor-not-allowed'
        }`}
      >
        <Sparkles className="w-4 h-4" />
        {isLoading ? 'Generating Report...' : 'Generate Market Report'}
      </motion.button>
    </motion.form>
  );
}
