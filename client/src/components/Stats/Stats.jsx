import { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'
import { stats } from '../../data/products'
import { stagger, scaleIn, viewport } from '../../lib/motion'
import './Stats.css'

// Ticks a numeric prefix up to its target; keeps any suffix (K+, %, +).
function CountUp({ value }) {
  const match = String(value).match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : 0
  const suffix = match ? match[2] : ''
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, target, {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(v)
    })
    return () => controls.stop()
  }, [inView, target])

  return <span ref={ref}>{Math.round(n)}{suffix}</span>
}

function Stats() {
  return (
    <section className="stats">
      <motion.div
        className="stats__grid"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        {stats.map((s) => (
          <motion.div key={s.id} className="stat" variants={scaleIn}>
            <span className="stat__value"><CountUp value={s.value} /></span>
            <span className="stat__label">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Stats
