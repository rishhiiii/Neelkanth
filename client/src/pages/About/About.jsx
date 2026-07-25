import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, Award, Factory, FlaskConical, Eye, Target,
  Leaf, BadgeCheck, Handshake, Clock, Users, Building2, Quote
} from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './About.css'

const timeline = [
  { label: 'Foundation', text: 'Neelkanth Global Wellness was established with a singular vision — to bring authentic, time-tested Ayurvedic formulations to every Indian household.' },
  { label: 'GMP Certification', text: 'Achieved GMP certification for our manufacturing facility, ensuring every product meets the highest pharmaceutical quality standards.' },
  { label: 'AYUSH Recognition', text: 'Received certification from the Ministry of AYUSH, Government of India, validating our commitment to authentic Ayurvedic practices.' },
  { label: 'Product Expansion', text: 'Grew our product portfolio to over 100 classical and proprietary formulations across 13 therapeutic categories.' },
  { label: 'Digital Launch', text: 'Launched pan-India online operations through ngwellness.in, making genuine Ayurvedic healthcare accessible to customers nationwide.' },
]

const infrastructure = [
  { icon: Factory, title: 'Manufacturing Facility', desc: 'State-of-the-art GMP-certified manufacturing unit equipped with modern machinery for tablets, syrups, powders, oils, and capsules.' },
  { icon: FlaskConical, title: 'Quality Control Lab', desc: 'In-house testing laboratory for raw material verification, in-process checks, and finished product analysis to ensure purity and potency.' },
  { icon: Building2, title: 'Storage & Warehousing', desc: 'Climate-controlled warehousing with batch-wise segregation, FIFO management, and proper environmental monitoring systems.' },
  { icon: Users, title: 'Team & Expertise', desc: 'A dedicated team of qualified Ayurvedic pharmacists, quality control experts, and wellness professionals driving our operations.' },
]

const certLogos = {
  AYUSH: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <path d="M40 12 C28 28, 20 38, 20 48 C20 58, 29 66, 40 66 C51 66, 60 58, 60 48 C60 38, 52 28, 40 12Z" fill="currentColor" opacity="0.15"/>
      <path d="M40 20 C32 32, 28 40, 28 47 C28 54, 33 59, 40 59 C47 59, 52 54, 52 47 C52 40, 48 32, 40 20Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
      <path d="M40 30 L40 52" stroke="currentColor" strokeWidth="1.2"/>
      <path d="M34 42 L46 42" stroke="currentColor" strokeWidth="1.2"/>
      <text x="40" y="76" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="600">AYUSH</text>
    </svg>
  ),
  GMP: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="64" height="64" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <path d="M24 52 L24 32 L32 32 C36 32, 38 34, 38 37 C38 40, 36 42, 32 42 L24 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="40" cy="40" r="16" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <path d="M32 56 L40 28 L48 56" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M34 48 L46 48" stroke="currentColor" strokeWidth="1.5" opacity="0.4"/>
      <text x="40" y="76" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="600">GMP</text>
    </svg>
  ),
  ISO: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
      <circle cx="40" cy="40" r="22" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <path d="M30 36 L30 50" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
      <path d="M36 44 C36 40, 38 36, 42 36 C46 36, 48 40, 48 44 C48 48, 46 50, 42 50 C38 50, 36 48, 36 44Z" stroke="currentColor" strokeWidth="2.5" fill="none"/>
      <path d="M52 36 C52 36, 56 36, 56 40 C56 44, 52 44, 52 44 C52 44, 56 44, 56 48 C56 52, 52 50, 52 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7"/>
      <text x="40" y="76" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="600">ISO 9001</text>
    </svg>
  ),
}

const certs = [
  { name: 'Ministry of AYUSH', short: 'AYUSH' },
  { name: 'GMP Certified', short: 'GMP' },
  { name: 'ISO 9001:2015', short: 'ISO' },
]

const awards = []

function About() {
  return (
    <div className="about">
      {/* 1. Page Hero */}
      <section className="about__hero">
        <div className="about__hero-inner">
          <div className="about__breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>About Us</span>
          </div>
          <h1>About Neelkanth Global Wellness</h1>
          <p>Authentic Ayurvedic healthcare rooted in tradition, validated by science</p>
        </div>
      </section>

      {/* 2. Company History */}
      <section className="about__section">
        <motion.div
          className="about__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__section-head" variants={fadeUp}>
            <Clock size={28} strokeWidth={1.3} className="about__section-icon" />
            <h2>Our Journey</h2>
            <p>
              From a humble beginning driven by passion for Ayurveda, Neelkanth Global Wellness
              has grown into a trusted name in herbal healthcare. Our journey is defined by an
              unwavering commitment to authenticity, quality, and the well-being of every customer we serve.
            </p>
          </motion.div>

          <div className="about__timeline">
            {timeline.map((item, i) => (
              <motion.div key={i} className="about__tl-item" variants={fadeUp}>
                <span className="about__tl-year">{item.label}</span>
                <div className="about__tl-line" />
                <p>{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. Vision & Mission */}
      <section className="about__section about__section--alt">
        <motion.div
          className="about__wrap"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <div className="about__vm-grid">
            <motion.div className="about__vm-card" variants={fadeUp}>
              <Eye size={28} strokeWidth={1.3} />
              <h3>Our Vision</h3>
              <p>
                To be India's most trusted Ayurvedic wellness brand — making authentic,
                high-quality herbal healthcare accessible and affordable for every household
                across the nation.
              </p>
            </motion.div>
            <motion.div className="about__vm-card" variants={fadeUp}>
              <Target size={28} strokeWidth={1.3} />
              <h3>Our Mission</h3>
              <p>
                To deliver safe, effective, and scientifically validated Ayurvedic medicines
                through ethical sourcing, rigorous quality control, and a deep commitment to
                classical pharmacological integrity and customer well-being.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* 4. Manufacturer / Sourcing Information */}
      <section className="about__section">
        <motion.div
          className="about__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__section-head" variants={fadeUp}>
            <Leaf size={28} strokeWidth={1.3} className="about__section-icon" />
            <h2>Our Products & Sourcing</h2>
            <p>
              Every Neelkanth product begins with carefully sourced raw herbs from trusted
              cultivators across India's most pristine growing regions. Our formulations are
              rooted in classical Ayurvedic texts and developed under the guidance of experienced
              Ayurvedic practitioners, ensuring authenticity at every step from farm to finished product.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5. Manufacturing Unit / Facility */}
      <section className="about__section about__section--alt">
        <motion.div
          className="about__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__section-head" variants={fadeUp}>
            <Factory size={28} strokeWidth={1.3} className="about__section-icon" />
            <h2>Manufacturing & Quality</h2>
            <p>
              Our GMP-certified manufacturing facility is equipped with modern pharmaceutical machinery
              while honouring traditional Ayurvedic preparation methods. Every batch undergoes rigorous
              quality checks — from raw material testing to final product analysis — ensuring safety,
              potency, and consistency in every formulation we produce.
            </p>
          </motion.div>

          {/* Facility photo: replace with real image when available */}
        </motion.div>
      </section>

      {/* 6. Director's Message */}
      <section className="about__section">
        <motion.div
          className="about__wrap"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__director" variants={fadeUp}>
            <div className="about__director-content">
              <Quote size={32} className="about__director-quote" />
              <blockquote>
                At Neelkanth Global Wellness, we carry forward the rich legacy of Ayurveda with
                deep respect for tradition and an unwavering commitment to quality. Every product
                we create is a promise — what reaches your hands is pure, authentic, and prepared
                with the same care as if it were for our own family.
              </blockquote>
              <div className="about__director-sig">
                <span>Founder &amp; Director, Neelkanth Global Wellness</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 7. Infrastructure */}
      <section className="about__section about__section--alt">
        <motion.div
          className="about__wrap"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__section-head" variants={fadeUp}>
            <Building2 size={28} strokeWidth={1.3} className="about__section-icon" />
            <h2>Our Infrastructure</h2>
          </motion.div>

          <div className="about__infra-grid">
            {infrastructure.map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div key={i} className="about__infra-card" variants={fadeUp}>
                  <div className="about__infra-icon">
                    <Icon size={24} strokeWidth={1.4} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </section>

      {/* 8. Certifications */}
      <section className="about__section">
        <motion.div
          className="about__wrap"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="about__section-head" variants={fadeUp}>
            <ShieldCheck size={28} strokeWidth={1.3} className="about__section-icon" />
            <h2>Certifications & Compliance</h2>
            <p>All products are manufactured under strict regulatory compliance</p>
          </motion.div>

          <div className="about__certs-row">
            {certs.map((c, i) => (
              <motion.div key={i} className="about__cert" variants={fadeUp}>
                <div className="about__cert-logo">{certLogos[c.short]}</div>
                <span>{c.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 9. Awards — hidden until real data is supplied by the client */}
      {awards.length > 0 && (
        <section className="about__section about__section--alt">
          <motion.div
            className="about__wrap"
            variants={stagger(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <motion.div className="about__section-head" variants={fadeUp}>
              <Award size={28} strokeWidth={1.3} className="about__section-icon" />
              <h2>Awards &amp; Achievements</h2>
            </motion.div>
            <div className="about__awards-grid">
              {awards.map((a, i) => (
                <motion.div key={i} className="about__award-card" variants={fadeUp}>
                  <Award size={28} className="about__award-icon" />
                  <h3>{a.title}</h3>
                  <span className="about__award-year">{a.year}</span>
                  <p>{a.body}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
      )}

    </div>
  )
}

export default About
