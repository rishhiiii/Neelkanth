import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Quote, Star } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import * as homepageApi from '../../api/homepage'
import './Testimonials.css'

function Testimonials() {
  const [testimonials, setTestimonials] = useState([])

  useEffect(() => {
    homepageApi.getTestimonials()
      .then((res) => {
        if (res.data.data?.length > 0) setTestimonials(res.data.data)
      })
      .catch(() => {})
  }, [])

  if (testimonials.length === 0) return null

  return (
    <section className="testimonials">
      <div className="testimonials__wrap">
        <div className="section-head">
          <h2 className="section-head__title">What Our Customers Say</h2>
          <p className="section-head__sub">Real experiences from real people</p>
        </div>

        <motion.div
          className="testimonials__grid"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {testimonials.map((t) => (
            <motion.figure key={t._id} className="testimonial" variants={fadeUp}>
              <Quote className="testimonial__quote" size={28} />
              <div className="testimonial__stars">
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote>{t.text}</blockquote>
              <figcaption className="testimonial__author">
                {t.customerImage?.url && (
                  <img src={t.customerImage.url} alt={t.customerName} />
                )}
                <div>
                  <span className="testimonial__name">{t.customerName}</span>
                  {t.customerLocation && (
                    <span className="testimonial__role">{t.customerLocation}</span>
                  )}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials
