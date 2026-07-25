import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import { blogs } from '../../data/products'
import { stagger, blurUp, headingReveal, viewport, springHover } from '../../lib/motion'
import { handleImageError } from '../../lib/imageFallback'
import './Blog.css'

function Blog() {
  return (
    <section id="blog" className="blog">
      <div className="blog__wrap">
        <motion.div
          className="section-head"
          variants={headingReveal}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <span className="section-head__sub">From the journal</span>
          <h2 className="section-head__title">Latest Stories</h2>
        </motion.div>

        <motion.div
          className="blog__grid"
          variants={stagger(0.14)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.id}
              className="blog-card"
              variants={blurUp}
              whileHover={{ y: -8, transition: springHover }}
            >
              <div className="blog-card__media">
                <img src={blog.image} alt={blog.title} onError={handleImageError} />
              </div>
              <div className="blog-card__body">
                <div className="blog-card__meta">
                  <span className="blog-card__date">
                    <Calendar size={13} /> {blog.date}
                  </span>
                  {blog.readTime && <span className="blog-card__read">{blog.readTime}</span>}
                </div>
                <h3>{blog.title}</h3>
                <p>{blog.desc}</p>
                <a href="#blog" className="blog-card__link">
                  Read More <ArrowRight size={15} />
                </a>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Blog
