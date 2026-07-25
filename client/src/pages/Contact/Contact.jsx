import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MapPin, Phone, Mail, Clock, ArrowRight, ChevronDown,
  Truck, MessageSquare, Building2, ShieldCheck, Send
} from 'lucide-react'
import toast from 'react-hot-toast'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Contact.css'

const faqs = [
  { q: 'How can I track my order?', a: 'Once dispatched, you will receive a tracking link via email. You can also check order status from the My Orders section in your account dashboard.' },
  { q: 'What is your return policy?', a: 'We accept returns within 7 days of delivery for eligible products. Initiate a return request from your order detail page and our team will guide you through the process.' },
  { q: 'Are your products safe to use?', a: 'All products are manufactured in a GMP-certified, AYUSH-approved facility. We recommend consulting an Ayurvedic practitioner if you have specific health conditions.' },
  { q: 'Do you ship across India?', a: 'Yes, we deliver pan-India. Orders above ₹1,000 qualify for free shipping. Standard delivery takes 5–7 business days depending on your location.' },
  { q: 'Can I cancel my order?', a: 'Orders can be cancelled before dispatch. Once shipped, you can initiate a return after delivery. Contact our support team for urgent cancellation requests.' },
  { q: 'How do I become a distributor?', a: 'For business and distributor enquiries, reach out to us at business@ngwellness.in or use the contact form with "Business / Partnership" as the subject.' },
]

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error('Please fill in all required fields')
      return
    }
    setSending(true)
    setTimeout(() => {
      setSending(false)
      toast.success('Message sent! We will get back to you shortly.')
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    }, 1200)
  }

  return (
    <div className="ct">
      {/* Hero */}
      <section className="ct-hero">
        <div className="ct-hero__inner">
          <div className="ct-hero__crumb">
            <Link to="/">Home</Link> <span>/</span> <span>Contact Us</span>
          </div>
          <h1>Contact Us</h1>
          <p>Have a question, feedback, or need help with an order? We're here for you.</p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="ct-info">
        <motion.div
          className="ct-info__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="ct-info__card" variants={fadeUp}>
            <div className="ct-info__icon"><Phone size={20} /></div>
            <h3>Call Us</h3>
            <p>Mon – Sat, 9 AM – 6 PM IST</p>
            <span>Phone number coming soon</span>
          </motion.div>

          <motion.a href="mailto:info@ngwellness.in" className="ct-info__card" variants={fadeUp}>
            <div className="ct-info__icon"><Mail size={20} /></div>
            <h3>Email Us</h3>
            <p>info@ngwellness.in</p>
            <span>We respond within 24 hours</span>
          </motion.a>

          <motion.div className="ct-info__card" variants={fadeUp}>
            <div className="ct-info__icon"><MapPin size={20} /></div>
            <h3>Visit Us</h3>
            <p>Haridwar, Uttarakhand</p>
            <span>India</span>
          </motion.div>

          <motion.div className="ct-info__card" variants={fadeUp}>
            <div className="ct-info__icon"><Clock size={20} /></div>
            <h3>Business Hours</h3>
            <p>Mon – Sat, 9 AM – 6 PM</p>
            <span>Closed on Sundays & holidays</span>
          </motion.div>
        </motion.div>
      </section>

      {/* Form + Sidebar */}
      <section className="ct-body">
        <motion.div
          className="ct-body__layout"
          variants={stagger(0.12)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {/* Form */}
          <motion.div className="ct-form" variants={fadeUp}>
            <div className="ct-form__head">
              <Send size={18} />
              <h2>Send Us a Message</h2>
            </div>
            <p className="ct-form__sub">Fill in the details below and our team will get back to you within 24 hours.</p>

            <form onSubmit={handleSubmit}>
              <div className="ct-form__row">
                <div className="ct-form__field">
                  <label htmlFor="ct-name">Full Name <span>*</span></label>
                  <input id="ct-name" name="name" type="text" value={form.name} onChange={handleChange} placeholder="Your full name" required />
                </div>
                <div className="ct-form__field">
                  <label htmlFor="ct-email">Email Address <span>*</span></label>
                  <input id="ct-email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="ct-form__row">
                <div className="ct-form__field">
                  <label htmlFor="ct-phone">Phone Number</label>
                  <input id="ct-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                </div>
                <div className="ct-form__field">
                  <label htmlFor="ct-subject">Subject</label>
                  <select id="ct-subject" name="subject" value={form.subject} onChange={handleChange}>
                    <option value="">Select a topic</option>
                    <option value="order">Order & Shipping</option>
                    <option value="product">Product Enquiry</option>
                    <option value="return">Returns & Refunds</option>
                    <option value="business">Business / Partnership</option>
                    <option value="quality">Quality / Compliance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="ct-form__field">
                <label htmlFor="ct-msg">Message <span>*</span></label>
                <textarea id="ct-msg" name="message" value={form.message} onChange={handleChange} placeholder="How can we help you?" rows={6} required />
              </div>

              <button type="submit" className="ct-form__btn" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
                {!sending && <ArrowRight size={16} />}
              </button>
            </form>
          </motion.div>

          {/* Sidebar */}
          <motion.aside className="ct-side" variants={fadeUp}>
            <div className="ct-side__block">
              <h3>Reach the Right Team</h3>
              <ul className="ct-side__depts">
                <li>
                  <Truck size={16} />
                  <div><strong>Orders & Shipping</strong><span>orders@ngwellness.in</span></div>
                </li>
                <li>
                  <MessageSquare size={16} />
                  <div><strong>Product Enquiries</strong><span>info@ngwellness.in</span></div>
                </li>
                <li>
                  <Building2 size={16} />
                  <div><strong>Business & Partnerships</strong><span>business@ngwellness.in</span></div>
                </li>
                <li>
                  <ShieldCheck size={16} />
                  <div><strong>Quality & Compliance</strong><span>quality@ngwellness.in</span></div>
                </li>
              </ul>
            </div>

            <a href="mailto:info@ngwellness.in" className="ct-side__wa">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              <div>
                <strong>Email Us Directly</strong>
                <span>We respond within 24 hours</span>
              </div>
              <ArrowRight size={14} />
            </a>

            <div className="ct-side__map">
              <MapPin size={20} strokeWidth={1.5} />
              <div>
                <p>Haridwar, Uttarakhand, India</p>
                <span>Map will load with actual location</span>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="ct-faq">
        <motion.div
          className="ct-faq__inner"
          variants={stagger(0.06)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <motion.div className="ct-faq__head" variants={fadeUp}>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to the most common queries</p>
          </motion.div>

          <div className="ct-faq__list">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`ct-faq__item ${openFaq === i ? 'ct-faq__item--open' : ''}`}
                variants={fadeUp}
              >
                <button className="ct-faq__q" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="ct-faq__chev" />
                </button>
                <div className="ct-faq__a"><p>{faq.a}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Bottom CTA */}
      <section className="ct-cta">
        <motion.div className="ct-cta__inner" variants={fadeUp} initial="hidden" whileInView="show" viewport={viewport}>
          <h2>Still need help?</h2>
          <p>Our support team is available Monday to Saturday, 9 AM – 6 PM IST.</p>
          <div className="ct-cta__btns">
            <a href="mailto:support@ngwellness.in" className="ct-cta__btn ct-cta__btn--fill"><Mail size={16} /> Email Support</a>
            <a href="mailto:info@ngwellness.in" className="ct-cta__btn ct-cta__btn--ghost"><Mail size={16} /> Email Us</a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}

export default Contact
