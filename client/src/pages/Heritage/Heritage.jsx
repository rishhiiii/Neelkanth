import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Sprout, BookOpen, FlaskConical, Mountain, Leaf,
  Timer, ShieldCheck, Droplets, Sun, Heart
} from 'lucide-react'
import { stagger, fadeUp, slideRight, viewport } from '../../lib/motion'
import './Heritage.css'

const principles = [
  { icon: Sprout, title: 'Vata', desc: 'The energy of movement — governs breathing, circulation, and nervous system functions.' },
  { icon: Droplets, title: 'Pitta', desc: 'The energy of transformation — governs digestion, metabolism, and body temperature.' },
  { icon: Mountain, title: 'Kapha', desc: 'The energy of structure — governs growth, immunity, and bodily fluids.' },
]

const timeline = [
  { era: '5000+ Years Ago', title: 'Origins in the Vedas', text: 'Ayurveda emerged from the Rigveda and Atharvaveda — the oldest scriptures of human civilization — as a holistic system of medicine and wellness.' },
  { era: 'Classical Period', title: 'The Great Texts', text: 'Charaka Samhita, Sushruta Samhita, and Ashtanga Hridaya established the pharmacological, surgical, and clinical foundations still followed today.' },
  { era: 'Medieval Era', title: 'Regional Traditions', text: 'Ayurveda branched into regional schools — Kerala, Benaras, Siddha — each refining specialized therapies, formulations, and rasayana practices.' },
  { era: 'Modern Revival', title: 'AYUSH Recognition', text: 'The Government of India established the Ministry of AYUSH, formalizing quality standards, GMP certification, and institutional support for Ayurvedic pharmacies.' },
  { era: 'Today', title: 'Science Meets Tradition', text: 'Modern Ayurvedic companies like Neelkanth bridge classical formulations with contemporary quality testing, standardized dosing, and evidence-informed practices.' },
]

const practices = [
  { icon: Leaf, title: 'Herb Sourcing', desc: 'Raw herbs sourced from their traditional growing regions — Himalayan foothills, Western Ghats, and central Indian forests — for optimal potency.' },
  { icon: FlaskConical, title: 'Classical Processing', desc: 'Formulations prepared following Shastriya methods — bhasma, asava, arishta, churna, vati — preserving the synergy of multi-herb compositions.' },
  { icon: Timer, title: 'Time-Honoured Ratios', desc: 'Ingredient ratios follow classical texts precisely. No shortcuts, no substitutions — the same proportions validated over millennia.' },
  { icon: ShieldCheck, title: 'Modern Quality Control', desc: 'Every batch tested for heavy metals, microbial load, and active marker compounds using HPLC and GC-MS in certified laboratories.' },
  { icon: Sun, title: 'Seasonal Harvesting', desc: 'Herbs harvested at their peak potency windows aligned with Ritucharya (seasonal) guidelines for maximum therapeutic benefit.' },
  { icon: Heart, title: 'Holistic Wellness', desc: 'Products designed not just to address symptoms but to restore balance across body, mind, and spirit — the core promise of Ayurveda.' },
]

const texts = [
  { name: 'Charaka Samhita', focus: 'Internal Medicine & Therapeutics', detail: 'The foundational text of Kayachikitsa (internal medicine), covering diagnosis, treatment, and prevention of disease through herbal formulations, diet, and lifestyle.' },
  { name: 'Sushruta Samhita', focus: 'Surgery & Pharmacology', detail: 'Pioneered surgical techniques and detailed the properties, preparation, and application of hundreds of medicinal plants and minerals.' },
  { name: 'Ashtanga Hridaya', focus: 'Comprehensive Practice', detail: 'A synthesis of both Charaka and Sushruta traditions, serving as the primary reference for Ayurvedic practitioners across all eight branches of the discipline.' },
]

function Heritage() {
  return (
    <div className="heritage">
      {/* Hero */}
      <section className="heritage__hero">
        <div className="heritage__hero-inner">
          <div className="heritage__breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Heritage</span>
          </div>
          <h1>The Living Heritage of Ayurveda</h1>
          <p>A 5,000-year tradition of holistic healing — and how Neelkanth carries it forward</p>
        </div>
      </section>

      {/* Intro */}
      <section className="heritage__section">
        <motion.div
          className="heritage__wrap heritage__intro-grid"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="heritage__intro-text" variants={fadeUp}>
            <span className="heritage__eyebrow">Ancient Wisdom</span>
            <h2>What is Ayurveda?</h2>
            <p>
              Ayurveda — "the science of life" — is the world's oldest continuously
              practiced system of medicine. Originating in the Indian subcontinent over
              5,000 years ago, it offers a comprehensive framework for understanding
              health through the balance of body, mind, and consciousness.
            </p>
            <p>
              Unlike symptom-focused approaches, Ayurveda addresses the root cause of
              imbalance through personalized combinations of herbal medicines, dietary
              guidance, and lifestyle practices tailored to an individual's unique
              constitution (Prakriti).
            </p>
          </motion.div>
          <motion.div className="heritage__intro-img" variants={slideRight}>
            <img src="https://picsum.photos/seed/nkher1/600/500" alt="Ayurvedic herbs and preparation" loading="lazy" />
          </motion.div>
        </motion.div>
      </section>

      {/* Three Doshas */}
      <section className="heritage__section heritage__section--alt">
        <motion.div
          className="heritage__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="heritage__section-head" variants={fadeUp}>
            <h2>The Three Doshas</h2>
            <p>Ayurveda recognizes three fundamental bio-energies that govern all physiological and psychological functions</p>
          </motion.div>
          <div className="heritage__doshas">
            {principles.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div key={i} className="heritage__dosha" variants={fadeUp}>
                  <div className="heritage__dosha-icon"><Icon size={28} strokeWidth={1.4} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* Timeline */}
      <section className="heritage__section">
        <motion.div
          className="heritage__wrap"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="heritage__section-head" variants={fadeUp}>
            <h2>A Timeless Tradition</h2>
            <p>From the Vedic age to modern pharmacies — the evolution of Ayurvedic medicine</p>
          </motion.div>
          <div className="heritage__timeline">
            {timeline.map((item, i) => (
              <motion.div key={i} className="heritage__tl-item" variants={fadeUp}>
                <span className="heritage__tl-era">{item.era}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Classical Texts */}
      <section className="heritage__section heritage__section--alt">
        <motion.div
          className="heritage__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="heritage__section-head" variants={fadeUp}>
            <BookOpen size={28} strokeWidth={1.3} className="heritage__section-icon" />
            <h2>Classical Texts We Follow</h2>
            <p>Every Neelkanth formulation traces its roots to these foundational pharmacological texts</p>
          </motion.div>
          <div className="heritage__texts-grid">
            {texts.map((t, i) => (
              <motion.div key={i} className="heritage__text-card" variants={fadeUp}>
                <BookOpen size={24} strokeWidth={1.4} className="heritage__text-icon" />
                <h3>{t.name}</h3>
                <span className="heritage__text-focus">{t.focus}</span>
                <p>{t.detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Practices */}
      <section className="heritage__section">
        <motion.div
          className="heritage__wrap"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="heritage__section-head" variants={fadeUp}>
            <h2>How We Honour This Heritage</h2>
            <p>Classical integrity meets modern quality standards in every product we make</p>
          </motion.div>
          <div className="heritage__practices">
            {practices.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div key={i} className="heritage__practice" variants={fadeUp}>
                  <div className="heritage__practice-icon"><Icon size={22} strokeWidth={1.5} /></div>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="heritage__section heritage__section--alt">
        <motion.div
          className="heritage__wrap heritage__cta-block"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div variants={fadeUp}>
            <h2>Experience the Heritage</h2>
            <p>Explore our range of classical Ayurvedic formulations — each one a bridge between ancient wisdom and your modern wellness needs.</p>
            <Link to="/products" className="heritage__cta-btn">Shop All Products</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  )
}

export default Heritage
