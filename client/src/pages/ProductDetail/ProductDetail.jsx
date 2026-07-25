import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingBag, Heart, ChevronRight, Minus, Plus, Play } from 'lucide-react'
import * as productsApi from '../../api/products'
import { productPlaceholder } from '../../lib/imageFallback'
import { useCart } from '../../contexts/CartContext'
import { useWishlist } from '../../contexts/WishlistContext'
import { useAuth } from '../../contexts/AuthContext'
import ProductCard from '../../components/Products/ProductCard'
import toast from 'react-hot-toast'
import './ProductDetail.css'

const formatPrice = (value) =>
  `₹${Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const BRAND_VIDEO_ID = '8-5pynsGLSU'

function ProductDetail() {
  const { slug } = useParams()
  const { addItem: addToCart } = useCart()
  const { addItem: addToWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    setLoading(true)
    setQty(1)
    setActiveImg(0)

    productsApi.getBySlug(slug)
      .then(({ data }) => setProduct(data.data || null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    productsApi.getRelated(slug)
      .then(({ data }) => setRelated(data.data || []))
      .catch(() => setRelated([]))
  }, [slug])

  if (loading) return (
    <section className="pd">
      <div className="pd__wrap">
        <div className="pd__skeleton-breadcrumb skeleton" style={{ width: 200, height: 16, marginBottom: '2rem' }} />
        <div className="pd__main">
          <div>
            <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 16 }} />
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ width: 64, height: 64, borderRadius: 10 }} />)}
            </div>
          </div>
          <div>
            <div className="skeleton" style={{ width: 100, height: 14, marginBottom: '0.75rem' }} />
            <div className="skeleton" style={{ width: '80%', height: 28, marginBottom: '0.75rem' }} />
            <div className="skeleton" style={{ width: 120, height: 24, marginBottom: '1rem' }} />
            <div className="skeleton" style={{ width: '100%', height: 14, marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '90%', height: 14, marginBottom: '1.5rem' }} />
            <div className="skeleton" style={{ width: 200, height: 42, borderRadius: 10 }} />
          </div>
        </div>
      </div>
    </section>
  )
  if (!product) return (
    <div className="pd__loading">
      <h2>Product not found</h2>
      <p>The product you're looking for doesn't exist or has been removed.</p>
      <Link to="/products" style={{ color: 'var(--accent)', fontWeight: 600 }}>Browse all products</Link>
    </div>
  )

  const inWish = isAuthenticated && product._id && isInWishlist(product._id)

  async function handleAddToCart() {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    if (!product._id) return
    try { await addToCart(product._id, qty) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to add') }
  }

  async function handleWishlist() {
    if (!isAuthenticated) { toast.error('Please login first'); return }
    if (!product._id) return
    try { await addToWishlist(product._id) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed') }
  }

  const images = product.images?.length > 0
    ? product.images
    : [{ url: productPlaceholder(product.name), alt: product.name }]

  return (
    <section className="pd">
      <div className="pd__wrap">
        {/* Breadcrumb */}
        <nav className="pd__breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/products">Products</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </nav>

        <div className="pd__main">
          {/* Images */}
          <div className="pd__gallery">
            <div className="pd__img-main">
              <img src={images[activeImg]?.url} alt={images[activeImg]?.alt || product.name} />
            </div>
            {images.length > 1 && (
              <div className="pd__thumbs">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`pd__thumb ${i === activeImg ? 'pd__thumb--active' : ''}`}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1} of ${images.length}`}
                  >
                    <img src={img.url} alt={img.alt || ''} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd__info">
            {product.category && (
              <span className="pd__cat">
                {product.category.name}
              </span>
            )}
            <h1 className="pd__title">{product.name}</h1>
            <p className="pd__price">{formatPrice(product.price)}</p>

            {product.shortDescription && (
              <p className="pd__desc">{product.shortDescription}</p>
            )}

            <div className="pd__meta">
              {product.packSize && <span>Pack: {product.packSize}</span>}
              {product.form && <span>Form: {product.form}</span>}
            </div>

            <div className="pd__stock">
              {product.inStock !== false
                ? <span className="pd__stock--in">In Stock</span>
                : <span className="pd__stock--out">Out of Stock</span>
              }
            </div>

            {product.inStock !== false && (
              <div className="pd__actions">
                <div className="pd__qty">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                    <Minus size={16} />
                  </button>
                  <span>{qty}</span>
                  <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase">
                    <Plus size={16} />
                  </button>
                </div>
                <button className="pd__add-cart" onClick={handleAddToCart}>
                  <ShoppingBag size={18} /> Add to Cart
                </button>
                <button
                  className={`pd__wish ${inWish ? 'pd__wish--active' : ''}`}
                  onClick={handleWishlist}
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} fill={inWish ? 'currentColor' : 'none'} />
                </button>
              </div>
            )}

            {/* Tags */}
            {product.healthTags?.length > 0 && (
              <div className="pd__tags">
                {product.healthTags.map((tag, i) => (
                  <span key={tag._id || i} className="pd__tag">{tag.name || tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="pd__details">
          {product.description && (
            <div className="pd__detail-block">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}
          {product.ingredients?.length > 0 && (
            <div className="pd__detail-block">
              <h3>Ingredients</h3>
              <ul>
                {product.ingredients.map((ing, i) => (
                  <li key={i}>{ing.name}{ing.quantity ? ` — ${ing.quantity}` : ''}</li>
                ))}
              </ul>
            </div>
          )}
          {product.benefits?.length > 0 && (
            <div className="pd__detail-block">
              <h3>Benefits</h3>
              <ul>{product.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
            </div>
          )}
          {product.dosage && (
            <div className="pd__detail-block">
              <h3>Dosage</h3>
              <p>{product.dosage}</p>
            </div>
          )}
          {product.directions && (
            <div className="pd__detail-block">
              <h3>Directions</h3>
              <p>{product.directions}</p>
            </div>
          )}
          {product.precautions && (
            <div className="pd__detail-block">
              <h3>Precautions</h3>
              <p>{product.precautions}</p>
            </div>
          )}
        </div>

        {/* Brand Video */}
        <div className="pd__video">
          <h2>Watch Product Video</h2>
          <div className="pd__video-player">
            {videoPlaying ? (
              <iframe
                src={`https://www.youtube.com/embed/${BRAND_VIDEO_ID}?autoplay=1`}
                title="Neelkanth Global Wellness"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button className="pd__video-cover" onClick={() => setVideoPlaying(true)}>
                <img src={`https://img.youtube.com/vi/${BRAND_VIDEO_ID}/hqdefault.jpg`} alt="Watch video" />
                <div className="pd__video-play-btn">
                  <Play size={28} fill="#fff" color="#fff" />
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pd__related">
            <h2>Related Products</h2>
            <div className="products__grid">
              {related.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductDetail
