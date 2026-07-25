import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from './ProductCard'
import { stagger, headingReveal, viewport } from '../../lib/motion'
import './Products.css'

function Products({
  id = 'products',
  sub = 'Handpicked for you',
  title = 'Best Sellers',
  items = [],
  tabs = null,
  band = false,
  showArrows = false
}) {
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)
  const grid = tabs ? tabs[active].items : items

  function scroll(dir) {
    if (!trackRef.current) return
    const amount = trackRef.current.offsetWidth * 0.55
    trackRef.current.scrollBy({ left: dir === 'next' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section id={id} className={`products ${band ? 'products--band' : ''}`}>
      <div className="products__wrap">
        <div className="products__header">
          <motion.div
            className="section-head"
            style={{ marginBottom: 0, textAlign: 'left' }}
            variants={headingReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <span className="section-head__sub">{sub}</span>
            <h2 className="section-head__title">{title}</h2>
          </motion.div>

          {showArrows && (
            <div className="products__arrows">
              <button className="products__arrow" onClick={() => scroll('prev')} aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <button className="products__arrow" onClick={() => scroll('next')} aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {tabs && (
          <div className="products__tabs">
            {tabs.map((tab, idx) => (
              <button
                key={tab.label}
                className={`products__tab ${idx === active ? 'is-active' : ''}`}
                onClick={() => setActive(idx)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={tabs ? active : 'static'}
            className={showArrows ? 'products__slider' : 'products__grid'}
            ref={trackRef}
            variants={stagger(0.07)}
            initial="hidden"
            animate="show"
            whileInView={tabs ? undefined : 'show'}
            viewport={viewport}
          >
            {grid.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </motion.div>
        </AnimatePresence>

        {!showArrows && (
          <div className="products__view-all">
            <Link to="/products" className="products__view-btn">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Products
