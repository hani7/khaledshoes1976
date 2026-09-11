import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import ProductCard from '../components/ProductCard'
import PageSEO from '../components/PageSEO'
import { getProductsByCategory, getCategories, getBanners } from '../api/products'
import mediaUrl from '../api/mediaUrl'
import './CategoryPage.css'

const SIZES = ['35','36','37','38','39','40','41','42','43','44','45']
const COLORS = ['Noir','Blanc','Beige','Marron','Camel','Gris','Rouge','Bleu','Rose','Vert']
const PRICE_RANGES = [
  { label: 'Moins de 10 000 DA', min: '', max: '10000' },
  { label: '10 000 – 20 000 DA',  min: '10000', max: '20000' },
  { label: '20 000 – 30 000 DA',  min: '20000', max: '30000' },
  { label: '30 000 – 50 000 DA',  min: '30000', max: '50000' },
  { label: 'Plus de 50 000 DA',   min: '50000', max: '' },
]

export default function CategoryPage() {
  const { slug } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [categoryBanners, setCategoryBanners] = useState([])
  const [filterOpen, setFilterOpen] = useState(false)

  const selectedSize  = searchParams.get('size') || ''
  const selectedColor = searchParams.get('color') || ''
  const selectedPriceMin = searchParams.get('price_min') || ''
  const selectedPriceMax = searchParams.get('price_max') || ''
  const activePriceRange = PRICE_RANGES.find(r => r.min === selectedPriceMin && r.max === selectedPriceMax) || null
  const activeCount = (selectedSize ? 1 : 0) + (selectedColor ? 1 : 0) + (activePriceRange ? 1 : 0)

  const updateFilter = (key, value) => {
    const p = new URLSearchParams(searchParams)
    if (value) p.set(key, value)
    else p.delete(key)
    setSearchParams(p)
    setPage(1)
  }

  useEffect(() => {
    if (!category || category.slug !== slug) setLoading(true)
    setIsFetching(true)
    const params = { page }
    if (selectedSize) params['variant__name__icontains'] = selectedSize
    if (selectedColor) params['variant__color_hex__icontains'] = selectedColor
    if (selectedPriceMin) params['price__gte'] = selectedPriceMin
    if (selectedPriceMax) params['price__lte'] = selectedPriceMax
    Promise.all([
      getProductsByCategory(slug, params),
      getCategories(),
      getBanners()
    ]).then(([prods, cats, bans]) => {
      setProducts(prods.data.results || prods.data)
      setTotalCount(prods.data.count || prods.data.length || 0)
      const catList = cats.data.results || cats.data
      const currentCat = catList.find((c) => c.slug === slug)
      setCategory(currentCat)
      const allBanners = bans.data.results || bans.data
      const validBanners = allBanners.filter(b => {
        if (b.placement !== 'category_banner' || b.is_active === false) return false
        if (!b.category) return true
        return currentCat && b.category === currentCat.id
      })
      setCategoryBanners(validBanners)
    }).finally(() => { setLoading(false); setIsFetching(false) })
  }, [slug, page, selectedSize, selectedColor])

  useEffect(() => { setPage(1) }, [slug])

  return (
    <main className="category-page page-enter">
      <PageSEO
        title={category?.name || slug}
        description={`Découvrez notre collection ${category?.name || ''} chez Khaled Shoes. Chaussures de qualité — livraison dans toute l'Algérie.`}
        url={`/${slug}`}
      />

      {/* Hero Banner */}
      <div
        className="category-page__hero"
        style={{ backgroundImage: categoryBanners.length > 0 ? `url(${mediaUrl(categoryBanners[0].image)})` : 'none' }}
      >
        <div className="category-page__hero-overlay" />
        <div className="category-page__hero-content">
          <h1 className="category-page__title">{category?.name?.toUpperCase() || slug.toUpperCase()}</h1>
        </div>
      </div>

      {/* Header bar with filter button */}
      <div style={{ borderBottom: '1px solid #eee', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            {totalCount} produit{totalCount !== 1 ? 's' : ''}
          </p>
          <button
            id="cat-filter-btn"
            onClick={() => setFilterOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px', borderRadius: '30px',
              border: '1.5px solid', borderColor: activeCount > 0 ? 'var(--color-accent)' : '#ccc',
              background: activeCount > 0 ? 'var(--color-accent)' : 'transparent',
              color: activeCount > 0 ? '#fff' : 'inherit',
              fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              letterSpacing: '0.05em', transition: 'all 0.2s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Filtrer{activeCount > 0 ? ` (${activeCount})` : ''}
          </button>
        </div>
      </div>

      {/* Banners supp */}
      {categoryBanners.length > 1 && (
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '24px' }}>
            {categoryBanners.slice(1).map(banner => (
              <a key={banner.id} href={banner.cta_url || '#'} style={{ display: 'block', borderRadius: '12px', overflow: 'hidden' }}>
                <img src={mediaUrl(banner.image)} alt={banner.title} style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover', display: 'block' }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      <div className="container" style={{ padding: '40px var(--gutter) 80px', position: 'relative' }}>
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-img--tall" />
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-text skeleton-text--short" />
                <div className="skeleton skeleton-text" style={{ width: '55%', marginTop: 8 }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ opacity: isFetching ? 0.5 : 1, transition: 'opacity 0.2s', pointerEvents: isFetching ? 'none' : 'auto' }}>
            <div className="products-grid">
              {products.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {totalCount > 20 && (
              <nav className="shop-pagination" aria-label="Pagination">
                <button className="shop-pagination__arrow" disabled={page === 1} onClick={() => { setPage(page - 1); window.scrollTo(0,0) }} aria-label="Page précédente">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                {Array.from({ length: Math.ceil(totalCount / 20) }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === Math.ceil(totalCount / 20) || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) => p === '...'
                    ? <span key={`ellipsis-${i}`} className="shop-pagination__ellipsis">…</span>
                    : <button key={p} className={`shop-pagination__page ${p === page ? 'active' : ''}`} onClick={() => { setPage(p); window.scrollTo(0,0) }} aria-label={`Page ${p}`}>{p}</button>
                  )}
                <button className="shop-pagination__arrow" disabled={page >= Math.ceil(totalCount / 20)} onClick={() => { setPage(page + 1); window.scrollTo(0,0) }} aria-label="Page suivante">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </nav>
            )}
          </div>
        )}
      </div>

      {/* ── Filter Drawer ── */}
      {filterOpen && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 2000 }}
          onClick={() => setFilterOpen(false)}
        />
      )}
      <div style={{
        position: 'fixed', top: 0, right: filterOpen ? 0 : '-380px',
        width: '360px', maxWidth: '95vw', height: '100vh',
        background: '#fff', zIndex: 2001,
        boxShadow: '-4px 0 30px rgba(0,0,0,0.12)',
        transition: 'right 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Drawer header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Filtres</h3>
          <button onClick={() => setFilterOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#555' }}>✕</button>
        </div>

        <div style={{ padding: '24px', flex: 1 }}>
          {/* Pointure */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>POINTURE</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SIZES.map(s => (
                <button key={s} onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                  style={{
                    width: '44px', height: '44px', fontSize: '0.82rem', fontWeight: 600,
                    borderRadius: '8px', border: '1.5px solid',
                    borderColor: selectedSize === s ? '#111' : '#ddd',
                    background: selectedSize === s ? '#111' : 'transparent',
                    color: selectedSize === s ? '#fff' : 'inherit',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', marginBottom: '14px' }}>COULEUR</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => updateFilter('color', selectedColor === c ? '' : c)}
                  style={{
                    padding: '8px 16px', fontSize: '0.78rem', fontWeight: 600,
                    borderRadius: '24px', border: '1.5px solid',
                    borderColor: selectedColor === c ? '#111' : '#ddd',
                    background: selectedColor === c ? '#111' : 'transparent',
                    color: selectedColor === c ? '#fff' : 'inherit',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >{c}</button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #eee', display: 'flex', gap: '12px' }}>
          {activeCount > 0 && (
            <button onClick={() => { setSearchParams({}); setPage(1) }}
              style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1.5px solid #ddd', background: 'transparent', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              Réinitialiser
            </button>
          )}
          <button onClick={() => setFilterOpen(false)}
            style={{ flex: 2, padding: '12px', borderRadius: '8px', border: 'none', background: '#111', color: '#fff', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.05em' }}
          >
            Voir les résultats
          </button>
        </div>
      </div>
    </main>
  )
}
