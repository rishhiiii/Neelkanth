import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import * as homepageApi from '../../api/homepage'
import './Hero.css'

const fallbackSlides = [
  {
    _id: 'static-1',
    title: 'Authentic Ayurveda for\nModern Ailments',
    subtitle: 'Time-tested remedies crafted with botanical precision and clinical integrity.',
    image: { url: 'https://picsum.photos/seed/nkh1/1600/900' },
    ctaText: 'Shop All Medicines',
    ctaLink: '/products',
  },
  {
    _id: 'static-2',
    title: 'Pure Herbal\nFormulations',
    subtitle: 'GMP-certified manufacturing with sustainably sourced ingredients from trusted growers.',
    image: { url: 'https://picsum.photos/seed/nkh2/1600/900' },
    ctaText: 'Explore Products',
    ctaLink: '/products',
  },
  {
    _id: 'static-3',
    title: 'Immunity &\nDaily Wellness',
    subtitle: 'Strengthen your natural defenses with traditionally trusted Ayurvedic formulations.',
    image: { url: 'https://picsum.photos/seed/nkh3/1600/900' },
    ctaText: 'Shop Immunity',
    ctaLink: '/products',
  },
]

function Hero() {
  const [slides, setSlides] = useState(fallbackSlides)
  const [current, setCurrent] = useState(0)
  const pausedRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    homepageApi.getHeroBanners()
      .then((res) => {
        if (res.data.data?.length > 1) {
          setSlides(res.data.data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image()
      img.src = s.image?.url || s.image
    })
  }, [slides])

  useEffect(() => {
    if (slides.length <= 1) return

    function tick() {
      timerRef.current = setTimeout(() => {
        if (!pausedRef.current) {
          setCurrent((prev) => (prev + 1) % slides.length)
        }
        tick()
      }, 3000)
    }

    tick()
    return () => clearTimeout(timerRef.current)
  }, [slides.length])

  function goTo(i) {
    setCurrent(i)
  }

  const slide = slides[current] || slides[0]

  return (
    <section
      className="hero"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      aria-roledescription="carousel"
      aria-label="Hero banners"
    >
      {slides.map((s, i) => (
        <div
          key={s._id || i}
          className={`hero__bg ${i === current ? 'hero__bg--active' : ''}`}
        >
          <img src={s.image?.url || s.image} alt="" />
        </div>
      ))}

      <div className="hero__overlay" />

      <div className="hero__content">
        <span className="hero__eyebrow">Medicinal Grade Heritage</span>
        <h1 className="hero__title">
          {(slide.title || '').split('\n').map((line, i) => (
            <span key={i}>{line}<br /></span>
          ))}
        </h1>
        {slide.subtitle && <p className="hero__desc">{slide.subtitle}</p>}
        <Link to={slide.ctaLink || '/products'} className="hero__cta">
          {slide.ctaText || 'Shop Now'}
        </Link>
      </div>

      {slides.length > 1 && (
        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Hero
