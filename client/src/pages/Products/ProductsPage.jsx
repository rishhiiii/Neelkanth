import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Search, PackageOpen } from 'lucide-react'
import * as productsApi from '../../api/products'
import ProductCard from '../../components/Products/ProductCard'
import { stagger, headingReveal, viewport } from '../../lib/motion'
import '../../components/Products/Products.css'
import './ProductsPage.css'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
]

function SkeletonGrid() {
  return (
    <div className="products__grid">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-card__img" />
          <div className="skeleton-card__info">
            <div className="skeleton-card__line skeleton-card__line--short" />
            <div className="skeleton-card__line skeleton-card__line--medium" />
            <div className="skeleton-card__line skeleton-card__line--short" />
            <div className="skeleton-card__line skeleton-card__line--price" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [meta, setMeta] = useState(null)
  const [filters, setFilters] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiAvailable, setApiAvailable] = useState(true)

  const page = parseInt(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'newest'
  const category = searchParams.get('category') || ''
  const q = searchParams.get('q') || ''

  useEffect(() => {
    productsApi.getFilters()
      .then(({ data }) => setFilters(data.data))
      .catch(() => setApiAvailable(false))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, sort, limit: 20 }
    if (category) params.category = category
    if (q) params.q = q

    const fetcher = q
      ? productsApi.searchProducts(q, params)
      : productsApi.listProducts(params)

    fetcher
      .then(({ data }) => {
        setProducts(data.data)
        setMeta(data.meta)
        setApiAvailable(true)
      })
      .catch(() => {
        setProducts([])
        setMeta(null)
        setApiAvailable(false)
      })
      .finally(() => setLoading(false))
  }, [page, sort, category, q])

  function updateParam(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    if (key !== 'page') next.delete('page')
    setSearchParams(next)
  }

  return (
    <section className="products-page">
      <div className="products-page__hero">
        <div className="products-page__hero-inner">
          <nav className="products-page__breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Products</span>
          </nav>
          <h1>{q ? `Results for "${q}"` : 'All Products'}</h1>
          <p>{q ? 'Showing matching products' : 'Explore our complete range of Ayurvedic medicines & wellness products'}</p>
        </div>
      </div>

      <div className="products__wrap">
        {/* Filters bar */}
        <div className="products__filters">
          {filters?.categories?.length > 0 && (
            <select
              value={category}
              onChange={(e) => updateParam('category', e.target.value)}
              className="products__filter-select"
            >
              <option value="">All Categories</option>
              {filters.categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          )}

          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="products__filter-select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {meta && (
            <span className="products__result-count">
              {meta.total} product{meta.total !== 1 ? 's' : ''} found
            </span>
          )}
        </div>

        {loading ? (
          <SkeletonGrid />
        ) : products.length === 0 ? (
          <div className="products__empty">
            <PackageOpen size={56} strokeWidth={1.2} />
            <p>No products found</p>
            <span>Try adjusting your filters or search terms</span>
          </div>
        ) : (
          <motion.div
            className="products__grid"
            variants={stagger(0.05)}
            initial="hidden"
            animate="show"
            viewport={viewport}
          >
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </motion.div>
        )}

        {/* Pagination */}
        {meta && meta.pages > 1 && (
          <div className="products__pagination">
            <button
              className="products__page-btn"
              onClick={() => updateParam('page', String(page - 1))}
              disabled={page <= 1}
            >
              <ChevronLeft size={18} />
            </button>
            {Array.from({ length: meta.pages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === meta.pages || Math.abs(p - page) <= 2)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`dots-${i}`} className="products__page-dots">...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => updateParam('page', String(p))}
                    className={`products__page-btn ${page === p ? 'products__page-btn--active' : ''}`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              className="products__page-btn"
              onClick={() => updateParam('page', String(page + 1))}
              disabled={page >= meta.pages}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsPage
