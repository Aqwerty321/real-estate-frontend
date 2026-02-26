import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Sparkles } from 'lucide-react';

const LOCATIONS = ['Miami', 'New York City', 'Austin', 'Los Angeles', 'San Francisco', 'Chicago', 'Seattle', 'Denver', 'Boston', 'Nashville'];
const PROPERTY_TYPES = ['Luxury Condo', 'Single Family Home', 'Penthouse', 'Townhouse', 'Waterfront Villa', 'Modern Loft'];
const BUDGET_RANGES = [
    { label: '$500K – $1M', value: 'under $1M' },
    { label: '$1M – $3M', value: 'between $1M and $3M' },
    { label: '$3M – $5M', value: 'between $3M and $5M' },
    { label: '$5M – $10M', value: 'between $5M and $10M' },
    { label: '$10M+', value: 'over $10M' },
];
const FEATURES = ['Waterfront', 'Pool', 'City View', 'Smart Home', 'Garage', 'Rooftop Terrace', 'Wine Cellar', 'Home Theater', 'Gym', 'Concierge'];

function SelectField({ label, value, onChange, options, icon }) {
    return (
        <div className="relative group">
            <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                {label}
            </label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full appearance-none bg-navy-800/80 border border-navy-600/50 rounded-xl px-4 py-3.5 pr-10 text-sm font-medium text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-all cursor-pointer hover:border-navy-500/70"
                >
                    <option value="">Select {label}</option>
                    {options.map((opt) => (
                        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                            {typeof opt === 'string' ? opt : opt.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400 pointer-events-none group-hover:text-navy-300 transition-colors" />
            </div>
        </div>
    );
}

function MultiSelectField({ label, selected, onChange, options }) {
    const toggleFeature = (feature) => {
        if (selected.includes(feature)) {
            onChange(selected.filter((f) => f !== feature));
        } else {
            onChange([...selected, feature]);
        }
    };

    return (
        <div>
            <label className="block text-xs font-semibold text-navy-400 uppercase tracking-wider mb-2">
                {label}
            </label>
            <div className="flex flex-wrap gap-2">
                {options.map((feature) => {
                    const isActive = selected.includes(feature);
                    return (
                        <button
                            key={feature}
                            type="button"
                            onClick={() => toggleFeature(feature)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${isActive
                                    ? 'bg-gold-500/20 border border-gold-500/40 text-gold-400'
                                    : 'bg-navy-800/60 border border-navy-600/30 text-navy-300 hover:border-navy-500/50 hover:text-navy-200'
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

export default function QueryBuilder({ onSubmit, isLoading }) {
    const [location, setLocation] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const [budget, setBudget] = useState('');
    const [features, setFeatures] = useState([]);

    const canSubmit = location && propertyType && budget && !isLoading;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;

        let message = `Find me ${propertyType.toLowerCase()} properties in ${location} ${budget}`;
        if (features.length > 0) {
            message += ` with ${features.join(', ').toLowerCase()}`;
        }
        message += '.';

        onSubmit(message);
    };

    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center border border-gold-500/20">
                        <Search className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Query Builder</h2>
                        <p className="text-xs text-navy-400">Configure your market intelligence parameters</p>
                    </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <SelectField label="Location" value={location} onChange={setLocation} options={LOCATIONS} />
                    <SelectField label="Property Type" value={propertyType} onChange={setPropertyType} options={PROPERTY_TYPES} />
                    <SelectField label="Budget Range" value={budget} onChange={setBudget} options={BUDGET_RANGES} />
                </div>

                {/* Features */}
                <div className="mb-8">
                    <MultiSelectField label="Desired Features" selected={features} onChange={setFeatures} options={FEATURES} />
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={!canSubmit}
                    whileHover={canSubmit ? { scale: 1.01 } : {}}
                    whileTap={canSubmit ? { scale: 0.99 } : {}}
                    className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${canSubmit
                            ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 hover:from-gold-400 hover:to-gold-500 shadow-lg shadow-gold-500/20 cursor-pointer'
                            : 'bg-navy-700/50 text-navy-500 cursor-not-allowed'
                        }`}
                >
                    <Sparkles className="w-4 h-4" />
                    Generate Market Report
                </motion.button>
            </form>
        </motion.div>
    );
}
