import { motion } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';
import PropertyCard from './PropertyCard';

export default function PropertyGrid({ properties }) {
    if (!properties || properties.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-6">
                <Grid3x3 className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
                    Property Portfolio
                </span>
                <span className="ml-2 px-2 py-0.5 rounded-full bg-navy-700/50 text-[11px] font-bold text-navy-300 border border-navy-600/30">
                    {properties.length} listings
                </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property, index) => (
                    <PropertyCard key={index} property={property} index={index} />
                ))}
            </div>
        </motion.div>
    );
}
