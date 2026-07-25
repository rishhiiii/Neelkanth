import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Tag, ArrowRight } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Offers.css'

const promos = [
  {
    id: 1,
    title: 'Free Shipping on Orders Above ₹1000',
    desc: 'Stock up on your daily wellness essentials and enjoy free delivery across India.',
    cta: 'Shop Now',
    link: '/products',
    accent: 'var(--primary)',
  },
  {
    id: 2,
    title: 'Immunity Combo Packs Available',
    desc: 'Curated combinations of our best immunity-boosting formulations at special pack pricing.',
    cta: 'View Packs',
    link: '/products',
    accent: 'var(--primary-dark)',
  },
]

function Offers() {
  return (
    <section className="offers">
      <div className="offers__wrap">
        <div className="section-head">
          <h2 className="section-head__title">Latest Offers</h2>
          <p className="section-head__sub">Special deals on authentic Ayurvedic products</p>
        </div>

        <motion.div
          className="offers__grid"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {promos.map((p) => (
            <motion.div key={p.id} className="offers__card" variants={fadeUp}>
              <div className="offers__icon">
                <Tag size={22} strokeWidth={1.4} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <Link to={p.link} className="offers__cta">
                {p.cta} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Offers
