import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Contact.css'

const details = [
  { icon: MapPin, label: 'Address', value: 'Neelkanth Global Wellness, India' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: Mail, label: 'Email', value: 'info@ngwellness.in', href: 'mailto:info@ngwellness.in' },
  { icon: Clock, label: 'Working Hours', value: 'Mon – Sat: 9:00 AM – 7:00 PM' },
]

function Contact() {
  return (
    <section className="contact">
      <div className="contact__wrap">
        <div className="section-head">
          <h2 className="section-head__title">Get in Touch</h2>
          <p className="section-head__sub">We are here to help with your wellness journey</p>
        </div>

        <motion.div
          className="contact__grid"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {details.map((d, i) => {
            const Icon = d.icon
            return (
              <motion.div key={i} className="contact__item" variants={fadeUp}>
                <div className="contact__icon">
                  <Icon size={20} strokeWidth={1.4} />
                </div>
                <div>
                  <span className="contact__label">{d.label}</span>
                  {d.href ? (
                    <a href={d.href} className="contact__value">{d.value}</a>
                  ) : (
                    <span className="contact__value">{d.value}</span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
