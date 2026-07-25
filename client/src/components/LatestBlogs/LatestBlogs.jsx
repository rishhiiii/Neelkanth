import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import * as homepageApi from '../../api/homepage'
import './LatestBlogs.css'

function LatestBlogs() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    homepageApi.getLatestBlogs(3)
      .then((res) => {
        if (res.data.data?.length > 0) setPosts(res.data.data)
      })
      .catch(() => {})
  }, [])

  if (posts.length === 0) return null

  return (
    <section className="blogs">
      <div className="blogs__wrap">
        <div className="section-head">
          <h2 className="section-head__title">From Our Journal</h2>
          <p className="section-head__sub">Insights on Ayurvedic wellness and healthy living</p>
        </div>

        <motion.div
          className="blogs__grid"
          variants={stagger(0.1)}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
        >
          {posts.map((post) => (
            <motion.article key={post._id} className="blog-card" variants={fadeUp}>
              {post.coverImage?.url && (
                <div className="blog-card__img">
                  <img src={post.coverImage.url} alt={post.title} loading="lazy" />
                </div>
              )}
              <div className="blog-card__body">
                {post.tags?.length > 0 && (
                  <span className="blog-card__tag">{post.tags[0]}</span>
                )}
                <h3>{post.title}</h3>
                {post.excerpt && <p>{post.excerpt}</p>}
                <div className="blog-card__meta">
                  <Calendar size={13} />
                  <time>{new Date(post.publishedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</time>
                </div>
                <Link to={`/blog/${post.slug}`} className="blog-card__link">
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default LatestBlogs
