import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { blurUp } from '../../lib/motion'
import { handleImageError, productPlaceholder } from '../../lib/imageFallback'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import toast from 'react-hot-toast'

function ProductCard({ product }) {
  const { isAuthenticated } = useAuth()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()

  const slug = product.slug || product.id
  const image = product.images?.[0]?.url || product.image || productPlaceholder(product.name)
  const inStock = product.inStock !== undefined ? product.inStock : true
  const inWish = isAuthenticated && product._id && isInWishlist(product._id)
  const tag = product.tag || product.healthTags?.[0]?.name || product.category?.name || ''

  async function handleAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    if (!product._id) return
    try { await addToCart(product._id, 1) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to add') }
  }

  async function handleWish(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login first'); return }
    if (!product._id) return
    try { await addToWishlist(product._id) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const price = `₹${Number(product.price).toLocaleString('en-IN')}`

  return (
    <motion.article className="pcard" variants={blurUp}>
      <Link to={`/products/${slug}`} className="pcard__link">
        <div className="pcard__media">
          <img src={image} alt={product.name} onError={handleImageError} loading="lazy" />
          <button
            className={`pcard__wish ${inWish ? 'pcard__wish--active' : ''}`}
            onClick={handleWish}
            aria-label="Add to wishlist"
          >
            <Heart size={16} fill={inWish ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="pcard__body">
          {tag && <span className="pcard__tag">{tag}</span>}
          <h3 className="pcard__name">{product.name}</h3>
          <div className="pcard__bottom">
            <span className="pcard__price">{price}</span>
            {inStock && (
              <button className="pcard__add" onClick={handleAdd} aria-label="Add to cart">
                <ShoppingBag size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default ProductCard
