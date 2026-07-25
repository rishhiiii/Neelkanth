import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { formulationTypes } from '../../data/products'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './FormulationTypes.css'

function FormulationTypes() {
  return (
    <section className="formulations">
      <div className="formulations__wrap">
        <div className="formulations__header">
          <div>
            <h2 className="section-head__title">Heritage Categories</h2>
            <p className="section-head__sub" style={{ textAlign: 'left' }}>
              Traditional preparations following ancient pharmacological texts.
            </p>
          </div>
          <Link to="/products" className="formulations__view-all">
            View Catalog <ArrowRight size={14} />
          </Link>
        </div>

        <motion.div
          className="formulations__grid"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {formulationTypes.map((f) => (
            <motion.div key={f.id} variants={fadeUp}>
              <Link to="/products" className="formulation-card">
                <div className="formulation-card__img">
                  <img src={f.image} alt={f.name} loading="lazy" />
                  <div className="formulation-card__overlay">
                    <h3>{f.name}</h3>
                    <span>{f.sub}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default FormulationTypes
