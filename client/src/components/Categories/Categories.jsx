import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { categories as staticCategories } from '../../data/products'
import * as productsApi from '../../api/products'
import { stagger, blurUp, headingReveal, viewport, springHover } from '../../lib/motion'
import { handleImageError } from '../../lib/imageFallback'
import './Categories.css'

function Categories() {
  const [categories, setCategories] = useState(staticCategories)

  useEffect(() => {
    productsApi.getCategories()
      .then(({ data }) => {
        if (data.data.length > 0) {
          // Map API categories, keeping static images as fallback
          const mapped = data.data.map((cat, i) => ({
            ...cat,
            id: cat._id,
            image: cat.image || staticCategories[i % staticCategories.length]?.image,
            count: cat.count || staticCategories[i % staticCategories.length]?.count || 0,
          }))
          setCategories(mapped)
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="categories" className="categories">
      <div className="categories__wrap">
        <motion.div
          className="section-head"
          variants={headingReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <span className="section-head__sub">Shop by concern</span>
          <h2 className="section-head__title">Browse Categories</h2>
        </motion.div>

        <motion.div
          className="categories__grid"
          variants={stagger(0.09)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat._id || cat.id}
              variants={blurUp}
              whileHover={{ y: -8, transition: springHover }}
            >
              <Link
                to={cat._id ? `/products?category=${cat._id}` : '#products'}
                className="category"
              >
                <img className="category__img" src={cat.image} alt={cat.name} onError={handleImageError} />
                <span className="category__scrim" />
                <div className="category__content">
                  <div className="category__text">
                    <h3>{cat.name}</h3>
                    {cat.count > 0 && <span>{cat.count} products</span>}
                  </div>
                  <span className="category__arrow">
                    <ArrowUpRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Categories
