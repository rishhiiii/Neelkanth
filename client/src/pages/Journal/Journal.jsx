import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Tag } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Journal.css'

const pl = (n) => `https://picsum.photos/seed/nkblog${n}/800/500`

const categories = ['All', 'Wellness', 'Ingredients', 'Lifestyle', 'Remedies', 'Nutrition']

const posts = [
  {
    id: 1,
    title: 'The Complete Guide to Ashwagandha: Benefits, Dosage & Science',
    excerpt: 'Ashwagandha (Withania somnifera) is one of the most powerful adaptogens in Ayurveda. Discover how this ancient herb supports stress management, sleep quality, and overall vitality.',
    image: pl(1),
    category: 'Ingredients',
    date: 'July 18, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    id: 2,
    title: 'Your Daily Ayurvedic Morning Routine (Dinacharya)',
    excerpt: 'Transform your mornings with oil pulling, tongue scraping, warm water, and other classical Dinacharya practices that set the foundation for daily wellness.',
    image: pl(2),
    category: 'Lifestyle',
    date: 'July 14, 2026',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Understanding Triphala: The Three-Fruit Formula',
    excerpt: 'Triphala — a synergistic blend of Amalaki, Bibhitaki, and Haritaki — has been used for centuries to support digestion, detoxification, and immune health.',
    image: pl(3),
    category: 'Ingredients',
    date: 'July 10, 2026',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Seasonal Eating: An Ayurvedic Approach to Nutrition',
    excerpt: 'Ritucharya, the Ayurvedic science of seasonal living, teaches us to align our diet with nature\'s cycles for optimal digestion and immunity.',
    image: pl(4),
    category: 'Nutrition',
    date: 'July 06, 2026',
    readTime: '9 min read',
  },
  {
    id: 5,
    title: 'Joint Health in Ayurveda: Natural Support for Mobility',
    excerpt: 'Explore traditional Ayurvedic approaches to joint comfort, including herbal formulations like Yograj Guggulu and Mahanarayan Oil, plus dietary and lifestyle guidance.',
    image: pl(5),
    category: 'Remedies',
    date: 'July 02, 2026',
    readTime: '7 min read',
  },
  {
    id: 6,
    title: 'Immunity Building with Chyawanprash: Ancient Wisdom for Modern Health',
    excerpt: 'This 2,000-year-old herbal jam contains over 40 ingredients working synergistically. Learn how Chyawanprash supports respiratory health and natural immunity.',
    image: pl(6),
    category: 'Wellness',
    date: 'June 28, 2026',
    readTime: '6 min read',
  },
  {
    id: 7,
    title: 'The Ayurvedic Approach to Hair Care: Herbs That Nourish',
    excerpt: 'Bhringraj, Amla, Brahmi — discover the classical herbs used for centuries to promote hair strength, thickness, and natural lustre without harsh chemicals.',
    image: pl(7),
    category: 'Remedies',
    date: 'June 24, 2026',
    readTime: '5 min read',
  },
  {
    id: 8,
    title: 'Panchakarma at Home: Gentle Seasonal Detox Practices',
    excerpt: 'While full Panchakarma requires clinical supervision, several preparatory and supportive practices can be safely incorporated into your seasonal wellness routine.',
    image: pl(8),
    category: 'Lifestyle',
    date: 'June 20, 2026',
    readTime: '10 min read',
  },
  {
    id: 9,
    title: 'Digestive Health: Why Ayurveda Considers Agni the Root of Wellness',
    excerpt: 'In Ayurveda, strong digestive fire (Agni) is the foundation of health. Learn how herbs like Trikatu and Hingwashtak support optimal digestion and nutrient absorption.',
    image: pl(9),
    category: 'Wellness',
    date: 'June 16, 2026',
    readTime: '7 min read',
  },
]

function Journal() {
  const [activeCategory, setActiveCategory] = useState('All')

  const featured = posts.find((p) => p.featured)
  const filtered = activeCategory === 'All'
    ? posts.filter((p) => !p.featured)
    : posts.filter((p) => p.category === activeCategory && !p.featured)

  return (
    <div className="journal">
      {/* Hero */}
      <section className="journal__hero">
        <div className="journal__hero-inner">
          <div className="journal__breadcrumb">
            <Link to="/">Home</Link> <span>/</span> <span>Journal</span>
          </div>
          <h1>The Neelkanth Journal</h1>
          <p>Insights on Ayurvedic wellness, herbal ingredients, and traditional health practices</p>
        </div>
      </section>

      <div className="journal__wrap">
        {/* Featured Post */}
        {featured && activeCategory === 'All' && (
          <motion.article
            className="journal__featured"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            <div className="journal__featured-img">
              <img src={featured.image} alt={featured.title} loading="lazy" />
              <span className="journal__featured-badge">Featured</span>
            </div>
            <div className="journal__featured-body">
              <div className="journal__meta">
                <span className="journal__cat-tag">{featured.category}</span>
                <span className="journal__date">{featured.date}</span>
                <span className="journal__read"><Clock size={13} /> {featured.readTime}</span>
              </div>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              <Link to="#" className="journal__read-more">
                Read Article <ArrowRight size={16} />
              </Link>
            </div>
          </motion.article>
        )}

        {/* Category Filter */}
        <div className="journal__filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`journal__filter-btn ${activeCategory === cat ? 'journal__filter-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        <motion.div
          className="journal__grid"
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          key={activeCategory}
        >
          {filtered.map((post) => (
            <motion.article key={post.id} className="journal__card" variants={fadeUp}>
              <Link to="#" className="journal__card-link">
                <div className="journal__card-img">
                  <img src={post.image} alt={post.title} loading="lazy" />
                </div>
                <div className="journal__card-body">
                  <div className="journal__meta">
                    <span className="journal__cat-tag">{post.category}</span>
                    <span className="journal__date">{post.date}</span>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="journal__card-footer">
                    <Clock size={13} /> {post.readTime}
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="journal__empty">
            <Tag size={40} strokeWidth={1.2} />
            <p>No articles in this category yet</p>
            <span>Check back soon or browse all articles</span>
          </div>
        )}

        {/* Newsletter CTA */}
        <motion.div
          className="journal__newsletter"
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          <h3>Stay Informed</h3>
          <p>Subscribe to receive new articles on Ayurvedic wellness, seasonal health tips, and product updates.</p>
          <form className="journal__nl-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address" />
            <button type="submit">Subscribe</button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default Journal
