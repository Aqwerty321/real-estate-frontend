import { motion } from 'framer-motion';
import { Grid3x3, Crown } from 'lucide-react';
import PropertyCard from './PropertyCard';
import { sectionVariants, staggerContainer } from '../motion/variants';

export default function PropertyGrid({ properties, featuredLayout = true }) {
  if (!properties || properties.length === 0) return null;

  const [featuredProperty, ...otherProperties] = properties;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={sectionVariants}
      className="pb-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-7">
        <div className="inline-flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-gold-300" />
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
            Property Portfolio
          </span>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-semibold text-navy-100">
          {properties.length} listings
        </span>
      </div>

      {featuredLayout && featuredProperty ? (
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gold-300/45 bg-gold-400/15 text-gold-100 text-[11px] font-semibold uppercase tracking-[0.12em] mb-3">
              <Crown className="w-3.5 h-3.5" />
              Featured Asset
            </div>
            <PropertyCard property={featuredProperty} index={0} featured />
          </div>

          {otherProperties.length > 0 && (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.12 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {otherProperties.map((property, index) => (
                <PropertyCard
                  key={property.id || property.source_url || `${property.title}-${index + 1}`}
                  property={property}
                  index={index + 1}
                />
              ))}
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {properties.map((property, index) => (
            <PropertyCard
              key={property.id || property.source_url || `${property.title}-${index}`}
              property={property}
              index={index}
            />
          ))}
        </motion.div>
      )}
    </motion.section>
  );
}
