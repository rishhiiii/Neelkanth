import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Heart } from 'lucide-react'
import { useWishlist } from '../../contexts/WishlistContext'
import { productPlaceholder } from '../../lib/imageFallback'
import toast from 'react-hot-toast'
import './WishlistPage.css'

const formatPrice = (v) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function WishlistPage() {
  const { wishlist, loading, removeItem, moveToCart } = useWishlist()

  async function handleRemove(productId) {
    try { await removeItem(productId) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  async function handleMove(productId) {
    try { await moveToCart(productId) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to move') }
  }

  if (loading) return <div className="wish-page"><div className="wish-page__wrap"><p>Loading...</p></div></div>

  return (
    <div className="wish-page">
      <div className="wish-page__wrap">
        <h1>My Wishlist ({wishlist.itemCount})</h1>

        {wishlist.items.length === 0 ? (
          <div className="wish-page__empty">
            <Heart size={48} strokeWidth={1.2} />
            <p>Your wishlist is empty</p>
            <Link to="/products" className="wish-page__btn">Browse Products</Link>
          </div>
        ) : (
          <div className="wish-page__grid">
            {wishlist.items.map((item) => (
              <div key={item.product?._id} className="wish-card">
                <div className="wish-card__img">
                  <img
                    src={item.product?.images?.[0]?.url || productPlaceholder(item.product?.name || '')}
                    alt={item.product?.name}
                  />
                  {!item.product?.isAvailable && (
                    <span className="wish-card__unavailable">Unavailable</span>
                  )}
                </div>
                <div className="wish-card__info">
                  <Link to={`/products/${item.product?.slug}`} className="wish-card__name">
                    {item.product?.name}
                  </Link>
                  <span className="wish-card__price">{formatPrice(item.product?.price || 0)}</span>
                  <span className={`wish-card__stock ${item.product?.inStock ? '' : 'wish-card__stock--out'}`}>
                    {item.product?.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="wish-card__actions">
                  {item.product?.inStock && item.product?.isAvailable && (
                    <button className="wish-card__move" onClick={() => handleMove(item.product._id)}>
                      <ShoppingBag size={15} /> Move to Cart
                    </button>
                  )}
                  <button className="wish-card__remove" onClick={() => handleRemove(item.product?._id)} aria-label="Remove">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
