import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { promoTiles } from '../../data/products'
import { stagger, blurUp, viewport, springHover } from '../../lib/motion'
import { handleImageError } from '../../lib/imageFallback'
import './Promo.css'

function Promo() {
  return (
    <section className="promo">
      <motion.div
        className="promo__wrap"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {promoTiles.map((tile) => (
          <motion.div
            key={tile.id}
            variants={blurUp}
            whileHover={{ y: -6, transition: springHover }}
          >
            <Link to="/products" className="promo__tile">
              <img src={tile.image} alt={tile.title} onError={handleImageError} />
              <span className="promo__scrim" />
              <div className="promo__content">
                <span className="promo__sub">{tile.eyebrow}</span>
                <h2>{tile.title}</h2>
                <p>{tile.text}</p>
                <span className="promo__cta">
                  {tile.cta || 'Shop Now'} <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Promo
