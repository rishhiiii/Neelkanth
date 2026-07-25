import { motion } from 'framer-motion'
import { Leaf, ShieldCheck, Truck, FlaskConical, BadgeCheck, Handshake } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './WhyChoose.css'

const reasons = [
  { icon: Leaf, title: 'Pure Herbal Ingredients', desc: 'Sustainably sourced herbs from certified growers, free of pesticides and adulterants.' },
  { icon: FlaskConical, title: 'GMP Certified Manufacturing', desc: 'Produced in government-approved facilities following strict quality protocols.' },
  { icon: ShieldCheck, title: 'AYUSH Approved', desc: 'All products are licensed and approved by the Ministry of AYUSH, Government of India.' },
  { icon: Truck, title: 'Pan-India Delivery', desc: 'Fast shipping across India. Free delivery on orders above ₹1000.' },
  { icon: BadgeCheck, title: 'Lab Tested & Verified', desc: 'Each batch undergoes rigorous testing for purity, potency, and heavy metals.' },
  { icon: Handshake, title: 'Practitioner Trusted', desc: 'Recommended by Ayurvedic doctors and wellness practitioners nationwide.' },
]

function WhyChoose() {
  return (
    <section className="why">
      <div className="why__wrap">
        <div className="section-head">
          <h2 className="section-head__title">Why Choose Neelkanth Global Wellness</h2>
          <p className="section-head__sub">Quality and trust in every formulation</p>
        </div>

        <motion.div
          className="why__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {reasons.map((r, i) => {
            const Icon = r.icon
            return (
              <motion.div key={i} className="why__card" variants={fadeUp}>
                <div className="why__icon">
                  <Icon size={24} strokeWidth={1.4} />
                </div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default WhyChoose
