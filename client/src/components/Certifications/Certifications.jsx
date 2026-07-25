import { motion } from 'framer-motion'
import { certifications } from '../../data/products'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Certifications.css'

const logos = {
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

function Certifications() {
  return (
    <section className="certs">
      <motion.div
        className="certs__row"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {certifications.map((c) => (
          <motion.div key={c.id} className="cert" variants={fadeUp}>
            <div className="cert__logo">
              {logos[c.short]}
            </div>
            <span className="cert__name">{c.name}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Certifications
