import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Shield, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth__card">
        <div className="auth__logo">
          <Leaf size={28} />
          <span>Neelkanth</span>
        </div>
        <h1>Welcome Back</h1>
        <p className="auth__sub">Sign in to access your account, orders, and wishlist</p>

        <form onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">Email Address</label>
            <input
              type="email"
              className="auth__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth__field">
            <label className="auth__label">Password</label>
            <input
              type="password"
              className="auth__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              minLength={8}
            />
          </div>

          <Link to="/forgot-password" className="auth__forgot">Forgot password?</Link>

          <button type="submit" disabled={loading} className="auth__btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth__switch">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>

        <div className="auth__trust">
          <span className="auth__trust-item"><Shield size={14} /> Secure</span>
          <span className="auth__trust-item"><Lock size={14} /> Encrypted</span>
        </div>
      </div>
    </div>
  )
}

export default Login
