import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import './NotFound.css'

function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__inner">
        <span className="notfound__code">404</span>
        <h1>Page Not Found</h1>
        <p>The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <div className="notfound__actions">
          <Link to="/" className="notfound__btn notfound__btn--primary">
            <Home size={18} /> Go Home
          </Link>
          <Link to="/products" className="notfound__btn">
            <ArrowLeft size={18} /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
