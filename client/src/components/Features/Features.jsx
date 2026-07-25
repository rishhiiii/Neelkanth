import { motion } from 'framer-motion'
import { Truck, Headphones, RotateCcw, ShieldCheck } from 'lucide-react'
import { features } from '../../data/products'
import { stagger, scaleIn, viewport, springHover } from '../../lib/motion'
import './Features.css'

const icons = {
  truck: Truck,
  headphones: Headphones,
  rotate: RotateCcw,
  shield: ShieldCheck
}

function Features() {
  return (
    <motion.section
      className="features"
      variants={stagger(0.12)}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <div className="features__grid">
        {features.map((f) => {
          const Icon = icons[f.icon]
          return (
            <motion.div
              key={f.id}
              className="feature"
              variants={scaleIn}
              whileHover={{ y: -6, transition: springHover }}
            >
              <motion.div
                className="feature__icon"
                whileHover={{ rotate: -12, scale: 1.12, transition: springHover }}
              >
                <Icon size={26} strokeWidth={1.5} />
              </motion.div>
              <div className="feature__text">
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}

export default Features
