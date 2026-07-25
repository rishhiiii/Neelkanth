import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, MapPin, Package, LogOut } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import * as profileApi from '../../api/profile'
import { INDIAN_STATES } from '../../data/states'
import toast from 'react-hot-toast'
import './ProfilePage.css'

function ProfilePage() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('profile')
  const [profile, setProfile] = useState({ name: '', phone: '' })
  const [address, setAddress] = useState(null)
  const [orders, setOrders] = useState([])
  const [orderMeta, setOrderMeta] = useState(null)
  const [passwords, setPasswords] = useState({ current: '', new: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    profileApi.getProfile().then(({ data }) => {
      setProfile({ name: data.data.name, phone: data.data.phone || '' })
    }).catch(() => {})
    profileApi.getAddress().then(({ data }) => setAddress(data.data)).catch(() => {})
    profileApi.listOrders().then(({ data }) => {
      setOrders(data.data)
      setOrderMeta(data.meta)
    }).catch(() => {})
  }, [])

  async function handleProfile(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await profileApi.updateProfile(profile)
      setUser(data.data)
      localStorage.setItem('user', JSON.stringify(data.data))
      toast.success('Profile updated')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  async function handlePassword(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await profileApi.changePassword(passwords.current, passwords.new)
      toast.success('Password changed')
      setPasswords({ current: '', new: '' })
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  async function handleAddress(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await profileApi.updateAddress(address)
      setAddress(data.data)
      toast.success('Address saved')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed') }
    finally { setLoading(false) }
  }

  async function handleLogout() {
    await logout()
    toast.success('Logged out')
    navigate('/')
  }

  const formatPrice = (v) => `₹${Number(v).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`

  return (
    <div className="profile">
      <div className="profile__wrap">
        <div className="profile__sidebar">
          <div className="profile__user">
            <div className="profile__avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <strong>{user?.name}</strong>
              <span>{user?.email}</span>
            </div>
          </div>
          <nav>
            <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
              <User size={16} /> Profile
            </button>
            <button className={tab === 'address' ? 'active' : ''} onClick={() => setTab('address')}>
              <MapPin size={16} /> Address
            </button>
            <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
              <Package size={16} /> Orders
            </button>
            <button onClick={handleLogout} className="profile__logout">
              <LogOut size={16} /> Logout
            </button>
          </nav>
        </div>

        <div className="profile__content">
          {tab === 'profile' && (
            <>
              <h2>Profile Settings</h2>
              <form onSubmit={handleProfile} className="profile__form">
                <label>Name <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required /></label>
                <label>Email <input type="email" value={user?.email || ''} disabled /></label>
                <label>Phone <input type="text" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} pattern="\d{10}" placeholder="10-digit number" /></label>
                <button type="submit" disabled={loading} className="profile__btn">{loading ? 'Saving...' : 'Save Changes'}</button>
              </form>

              <h3 style={{ marginTop: '2rem' }}>Change Password</h3>
              <form onSubmit={handlePassword} className="profile__form">
                <label>Current Password <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required /></label>
                <label>New Password <input type="password" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} required minLength={8} /></label>
                <button type="submit" disabled={loading} className="profile__btn">{loading ? 'Changing...' : 'Change Password'}</button>
              </form>
            </>
          )}

          {tab === 'address' && (
            <>
              <h2>Delivery Address</h2>
              <form onSubmit={handleAddress} className="profile__form">
                <label>Recipient Name <input type="text" value={address?.name || ''} onChange={(e) => setAddress({ ...address, name: e.target.value })} required /></label>
                <label>Phone <input type="text" value={address?.phone || ''} onChange={(e) => setAddress({ ...address, phone: e.target.value })} pattern="\d{10}" placeholder="10-digit number" /></label>
                <label>Address Line 1 <input type="text" value={address?.line1 || ''} onChange={(e) => setAddress({ ...address, line1: e.target.value })} required /></label>
                <label>Address Line 2 <input type="text" value={address?.line2 || ''} onChange={(e) => setAddress({ ...address, line2: e.target.value })} /></label>
                <label>City <input type="text" value={address?.city || ''} onChange={(e) => setAddress({ ...address, city: e.target.value })} required /></label>
                <label>State
                  <select value={address?.state || ''} onChange={(e) => setAddress({ ...address, state: e.target.value })} required>
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </label>
                <label>Pincode <input type="text" value={address?.pincode || ''} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} pattern="\d{6}" required placeholder="6-digit pincode" /></label>
                <button type="submit" disabled={loading} className="profile__btn">{loading ? 'Saving...' : 'Save Address'}</button>
              </form>
            </>
          )}

          {tab === 'orders' && (
            <>
              <h2>My Orders</h2>
              {orders.length === 0 ? (
                <p className="profile__empty">No orders yet. <Link to="/products">Start shopping</Link></p>
              ) : (
                <div className="profile__orders">
                  {orders.map((order) => (
                    <div key={order.orderNumber} className="order-card">
                      <div className="order-card__header">
                        <span className="order-card__num">#{order.orderNumber}</span>
                        <span className={`order-card__status order-card__status--${order.status}`}>{order.status}</span>
                      </div>
                      <div className="order-card__body">
                        <span>{order.itemCount} item{order.itemCount > 1 ? 's' : ''}</span>
                        <span>{formatPrice(order.grandTotal)}</span>
                        <span>{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="order-card__footer">
                        <span className="order-card__payment">{order.paymentMethod.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
