import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Brain, Bone, Apple, Activity, Sparkles, ArrowRight } from 'lucide-react'
import { healthConcerns } from '../../data/products'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './HealthConcerns.css'

const iconMap = {
  shield: Shield,
  brain: Brain,
  bone: Bone,
  apple: Apple,
  activity: Activity,
  sparkles: Sparkles,
}

function HealthConcerns() {
  return (
    <section className="concerns">
      <div className="concerns__wrap">
        <div className="section-head">
          <h2 className="section-head__title">Shop by Health Concern</h2>
          <p className="section-head__sub">Find natural support for your specific wellness needs</p>
        </div>

        <motion.div
          className="concerns__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {healthConcerns.map((c) => {
            const Icon = iconMap[c.icon] || Shield
            return (
              <motion.div
                key={c.id}
                className={`concerns__card ${c.description ? 'concerns__card--featured' : ''}`}
                variants={fadeUp}
              >
                <Icon size={28} strokeWidth={1.3} className="concerns__icon" />
                <h3>{c.name}</h3>
                {c.description && <p>{c.description}</p>}
                <Link to={`/products`} className="concerns__link">
                  Explore <ArrowRight size={14} />
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default HealthConcerns
