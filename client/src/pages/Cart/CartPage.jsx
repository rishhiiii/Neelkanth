import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { productPlaceholder } from '../../lib/imageFallback'
import toast from 'react-hot-toast'
import './CartPage.css'

const formatPrice = (v) =>
  `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function CartPage() {
  const { cart, loading, updateQuantity, removeItem, clearAll } = useCart()

  async function handleQty(productId, qty) {
    try { await updateQuantity(productId, qty) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to update') }
  }

  async function handleRemove(productId) {
    try { await removeItem(productId) }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to remove') }
  }

  if (loading) return <div className="cart-page"><div className="cart-page__wrap"><p className="cart-page__empty">Loading...</p></div></div>

  return (
    <div className="cart-page">
      <div className="cart-page__wrap">
        <h1>Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="cart-page__empty">
            <ShoppingBag size={48} strokeWidth={1.2} />
            <p>Your cart is empty</p>
            <Link to="/products" className="cart-page__btn">Browse Products</Link>
          </div>
        ) : (
          <div className="cart-page__layout">
            <div className="cart-page__items">
              {cart.items.map((item) => (
                <div key={item.product?._id || Math.random()} className={`cart-item ${item.flag ? 'cart-item--flagged' : ''}`}>
                  {item.flag && (
                    <span className="cart-item__flag">{item.flagReason}</span>
                  )}
                  <div className="cart-item__img">
                    <img
                      src={item.product?.images?.[0]?.url || productPlaceholder(item.product?.name || '')}
                      alt={item.product?.name || 'Product'}
                    />
                  </div>
                  <div className="cart-item__info">
                    <Link to={`/products/${item.product?.slug}`} className="cart-item__name">
                      {item.product?.name || 'Unavailable product'}
                    </Link>
                    {item.product?.packSize && (
                      <span className="cart-item__meta">{item.product.packSize}</span>
                    )}
                    <span className="cart-item__price">{formatPrice(item.product?.price || 0)}</span>
                  </div>
                  <div className="cart-item__qty">
                    <button onClick={() => handleQty(item.product?._id, item.quantity - 1)} disabled={item.quantity <= 1}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQty(item.product?._id, item.quantity + 1)} disabled={item.quantity >= 10}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="cart-item__total">{formatPrice(item.lineTotal)}</span>
                  <button className="cart-item__remove" onClick={() => handleRemove(item.product?._id)} aria-label="Remove">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button className="cart-page__clear" onClick={clearAll}>Clear Cart</button>
            </div>

            <div className="cart-page__summary">
              <h3>Order Summary</h3>
              <div className="cart-page__row">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="cart-page__row">
                <span>Shipping</span>
                <span>{cart.shippingFee === 0 ? 'FREE' : formatPrice(cart.shippingFee)}</span>
              </div>
              {cart.shippingFee > 0 && (
                <p className="cart-page__ship-note">
                  Add {formatPrice(cart.freeShippingThreshold - cart.subtotal)} more for free shipping
                </p>
              )}
              <div className="cart-page__row cart-page__row--total">
                <span>Grand Total</span>
                <span>{formatPrice(cart.grandTotal)}</span>
              </div>
              <button className="cart-page__checkout" disabled>
                Proceed to Checkout
              </button>
              <p className="cart-page__secure">Secure checkout coming soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartPage
