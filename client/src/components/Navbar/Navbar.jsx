import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, User, ShoppingBag, Menu, X, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { cart } = useCart()
  const { wishlist } = useWishlist()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
      setSearchOpen(false)
      setMobileOpen(false)
    }
  }

  function go(path) { setMobileOpen(false); navigate(path) }

  const cartCount = cart.itemCount || 0
  const wishCount = wishlist.itemCount || 0

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      {/* Announcement */}
      <div className="nav__announce">
        <span>FREE SHIPPING ON ORDERS ABOVE ₹1000</span>
      </div>

      {/* Main bar */}
      <nav className="nav__bar">
        <Link to="/" className="nav__logo">
          NEELKANTH
        </Link>

        <ul className="nav__links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/heritage">Heritage</Link></li>
          <li><Link to="/journal">Journal</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>

        <div className="nav__actions">
          {searchOpen ? (
            <form onSubmit={handleSearch} className="nav__search-form">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                autoFocus
                onBlur={() => { if (!query) setSearchOpen(false) }}
              />
              <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={16} />
              </button>
            </form>
          ) : (
            <button className="nav__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={18} />
              <span className="nav__icon-label">Search products...</span>
            </button>
          )}

          <Link to="/wishlist" className="nav__icon-btn nav__hide-mobile" aria-label="Wishlist">
            <Heart size={18} />
            {wishCount > 0 && <span className="nav__badge">{wishCount}</span>}
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className="nav__icon-btn" aria-label="Account">
              <User size={18} />
            </Link>
          ) : (
            <Link to="/login" className="nav__icon-btn" aria-label="Sign in">
              <User size={18} />
            </Link>
          )}

          <Link to="/cart" className="nav__icon-btn" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span className="nav__badge">{cartCount}</span>}
          </Link>

          <button
            className="nav__burger"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="nav__mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul>
              <li><button onClick={() => go('/')}>Home</button></li>
              <li><button onClick={() => go('/products')}>Products</button></li>
              <li><button onClick={() => go('/about')}>About</button></li>
              <li><button onClick={() => go('/heritage')}>Heritage</button></li>
              <li><button onClick={() => go('/journal')}>Journal</button></li>
              <li><button onClick={() => go('/contact')}>Contact</button></li>
              <li><button onClick={() => go('/wishlist')}>Wishlist {wishCount > 0 && `(${wishCount})`}</button></li>
              <li><button onClick={() => go('/cart')}>Cart {cartCount > 0 && `(${cartCount})`}</button></li>
              {isAuthenticated
                ? <li><button onClick={() => go('/profile')}>My Account</button></li>
                : <li><button onClick={() => go('/login')}>Sign In</button></li>
              }
            </ul>
            <form onSubmit={handleSearch} className="nav__mobile-search">
              <Search size={16} />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
