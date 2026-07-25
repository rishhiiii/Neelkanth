export function productPlaceholder(name = '') {
  const initial = (name.replace(/^Neelkanth\s+/i, '').charAt(0) || 'N').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">
    <rect width="600" height="600" fill="#f5f0e8"/>
    <path d="M300 140c-30 20-90 80-90 160 0 70 40 120 90 140 50-20 90-70 90-140 0-80-60-140-90-160z" fill="none" stroke="#4a7c59" stroke-width="3" opacity=".25"/>
    <path d="M300 180c-20 15-60 55-60 110 0 50 28 85 60 100 32-15 60-50 60-100 0-55-40-95-60-110z" fill="#4a7c59" opacity=".12"/>
    <text x="300" y="340" text-anchor="middle" font-family="Georgia,serif" font-size="120" font-weight="700" fill="#4a7c59">${initial}</text>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

export function handleImageError(e) {
  const el = e.currentTarget
  if (el.dataset.fallbackApplied) return
  el.dataset.fallbackApplied = '1'
  el.src = productPlaceholder(el.getAttribute('alt') || '')
}
