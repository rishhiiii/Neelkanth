import { motion } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'
import { brands } from '../../data/products'
import './Brands.css'

function Brands() {
  // Duplicate the list so the track can loop seamlessly.
  const loop = [...brands, ...brands]

  return (
    <section className="brands">
      <div className="brands__marquee">
        <motion.div
          className="brands__track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        >
          {loop.map((brand, i) => (
            <div className="brand" key={i}>
              <BadgeCheck size={20} />
              <span>{brand}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Brands
