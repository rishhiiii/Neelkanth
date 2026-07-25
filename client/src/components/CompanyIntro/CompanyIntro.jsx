import { motion } from 'framer-motion'
import { Leaf, FlaskConical, HeartPulse, CheckCircle2 } from 'lucide-react'
import { stagger, fadeUp, slideRight, viewport } from '../../lib/motion'
import './CompanyIntro.css'

const highlights = [
  { icon: Leaf, label: '100% Natural Ingredients' },
  { icon: FlaskConical, label: 'Quality-Tested Formulations' },
  { icon: HeartPulse, label: 'Trusted by Health Practitioners' },
]

function CompanyIntro() {
  return (
    <section className="intro">
      <motion.div
        className="intro__wrap"
        variants={stagger(0.15)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div className="intro__content" variants={fadeUp}>
          <span className="intro__eyebrow">Who We Are</span>
          <h2 className="intro__title">Rooted in Tradition,<br />Driven by Science</h2>
          <p className="intro__desc">
            Neelkanth Global Wellness brings you authentic Ayurvedic products
            manufactured under strict GMP conditions. Every formulation is
            crafted from sustainably sourced herbs, following classical
            pharmacological texts and validated through modern quality testing.
          </p>
          <p className="intro__desc">
            We bridge the gap between ancient wellness wisdom and contemporary
            health needs — delivering safe, effective, and accessible herbal
            healthcare across India.
          </p>

          <div className="intro__highlights">
            {highlights.map((h, i) => {
              const Icon = h.icon
              return (
                <div key={i} className="intro__highlight">
                  <div className="intro__highlight-icon">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <span>{h.label}</span>
                </div>
              )
            })}
          </div>

          <a href="/products" className="intro__cta">
            Explore Our Products
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </a>
        </motion.div>

        <motion.div className="intro__visual" variants={slideRight}>
          <div className="intro__img-wrap">
            <img
              src="https://picsum.photos/seed/nkintro/700/850"
              alt="Ayurvedic herbs and formulations"
              loading="lazy"
            />
            <div className="intro__badge">
              <CheckCircle2 size={20} strokeWidth={2} />
              <div>
                <strong>GMP Certified</strong>
                <span>Quality Assured</span>
              </div>
            </div>
          </div>
          <div className="intro__stat-strip">
            <div className="intro__stat">
              <strong>25+</strong>
              <span>Herbal Products</span>
            </div>
            <div className="intro__stat">
              <strong>GMP</strong>
              <span>Certified Facility</span>
            </div>
            <div className="intro__stat">
              <strong>100%</strong>
              <span>Natural &amp; Pure</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default CompanyIntro
