import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { stagger, fadeUp, viewport } from '../../lib/motion'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <motion.div
        className="footer__inner"
        variants={stagger(0.12)}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
      >
        <motion.div className="footer__col footer__brand" variants={fadeUp}>
          <Link to="/" className="footer__logo">NEELKANTH</Link>
          <p>
            Authentic Ayurvedic healthcare rooted in tradition, validated by
            science. Bringing genuine herbal wellness to every Indian household.
          </p>
          <div className="footer__social">
            <a href="https://ngwellness.in/" target="_blank" rel="noopener noreferrer" aria-label="Website">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
            </a>
            <a href="https://www.youtube.com/@NGWPvtLtd" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" /><path d="m10 15 5-3-5-3z" /></svg>
            </a>
            <a href="https://www.facebook.com/NeelkanthGlobalWellness" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </a>
            <a href="https://www.instagram.com/neelkanthglobalwellness" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
            </a>
            <a href="https://x.com/GlobalNeel64680" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
          </div>
        </motion.div>

        <motion.div className="footer__col" variants={fadeUp}>
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/products">Joint Care</Link></li>
            <li><Link to="/products">Immunity</Link></li>
            <li><Link to="/products">Digestive Care</Link></li>
            <li><Link to="/products">Hair Care</Link></li>
          </ul>
        </motion.div>

        <motion.div className="footer__col" variants={fadeUp}>
          <h4>Company</h4>
          <ul>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/heritage">Heritage</Link></li>
            <li><Link to="/journal">Journal</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </motion.div>

        <motion.div className="footer__col" variants={fadeUp}>
          <h4>Stay Informed</h4>
          <p>Subscribe for wellness tips and new product updates.</p>
          <form className="footer__form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email Address" aria-label="Email" />
            <button type="submit" aria-label="Subscribe"><ArrowRight size={18} /></button>
          </form>
        </motion.div>
      </motion.div>

      <div className="footer__bottom">
        <p>&copy; {new Date().getFullYear()} Neelkanth Global Wellness Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
