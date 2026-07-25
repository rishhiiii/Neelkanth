import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Leaf, Mail } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import * as authApi from '../../api/auth'
import toast from 'react-hot-toast'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [step, setStep] = useState('register')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('OTP sent to your email!')
      setStep('verify')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await authApi.verifyEmail(email, otp)
      toast.success('Email verified! Please login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await authApi.resendOtp(email)
      toast.success('OTP resent!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend')
    }
  }

  return (
    <div className="auth">
      {step === 'register' ? (
        <div className="auth__card">
          <div className="auth__logo">
            <Leaf size={28} />
            <span>Neelkanth</span>
          </div>
          <h1>Create Account</h1>
          <p className="auth__sub">Join thousands of families choosing natural Ayurvedic wellness</p>

          <form onSubmit={handleRegister}>
            <div className="auth__field">
              <label className="auth__label">Full Name</label>
              <input
                type="text"
                className="auth__input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>

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
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>

            <button type="submit" disabled={loading} className="auth__btn">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth__switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      ) : (
        <div className="auth__card">
          <div className="auth__logo">
            <Leaf size={28} />
            <span>Neelkanth</span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(47,125,91,0.1)', display: 'inline-flex',
              alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
            }}>
              <Mail size={24} color="var(--accent)" />
            </div>
            <h1>Verify Email</h1>
            <p className="auth__sub" style={{ marginBottom: 0 }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ color: 'var(--dark)' }}>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleVerify}>
            <div className="auth__field">
              <input
                type="text"
                className="auth__otp-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                placeholder="------"
                required
              />
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className="auth__btn">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <button type="button" className="auth__link" onClick={handleResend}>
            Didn't receive the code? Resend OTP
          </button>
        </div>
      )}
    </div>
  )
}

export default Register
