import { useParams, Link, useSearchParams } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'
import ProductCard from '../components/ProductCard'
import PageSEO from '../components/PageSEO'
import { getProductsByCategory, getCategories, getBanners } from '../api/products'
import mediaUrl from '../api/mediaUrl'
import './CategoryPage.css'

const SIZES = ['35','36','37','38','39','40','41','42','43','44','45']
const COLORS = ['Noir','Blanc','Beige','Marron','Camel','Gris','Rouge','Bleu','Rose','Vert']

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

  const selectedSize = searchParams.get('size') || ''
  const selectedColor = searchParams.get('color') || ''

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

  useEffect(() => {
    setPage(1)
  }, [slug])

  return (
    <main className="category-page page-enter">
      <PageSEO
        title={category?.name || slug}
        description={`Découvrez notre collection ${category?.name || ''} chez Khaled Shoes. Chaussures de qualité — livraison dans toute l'Algérie.`}
        url={`/${slug}`}
      />
      {/* Hero Banner (admin-managed) */}
      <div
        className="category-page__hero"
        style={{
          backgroundImage: categoryBanners.length > 0 ? `url(${mediaUrl(categoryBanners[0].image)})` : 'none',
        }}
      >
        <div className="category-page__hero-overlay" />
        <div className="category-page__hero-content">
          <h1 className="category-page__title">{category?.name?.toUpperCase() || slug.toUpperCase()}</h1>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ borderBottom: '1px solid #eee', background: '#fafafa', padding: '14px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'flex-start' }}>
          {/* Pointure */}
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>POINTURE</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SIZES.map(s => (
                <button key={s} onClick={() => updateFilter('size', selectedSize === s ? '' : s)}
                  style={{
                    width: '38px', height: '38px', fontSize: '0.78rem', fontWeight: 600,
                    borderRadius: '6px', border: '1.5px solid',
                    borderColor: selectedSize === s ? 'var(--color-accent)' : '#ddd',
                    background: selectedSize === s ? 'var(--color-accent)' : 'transparent',
                    color: selectedSize === s ? 'white' : 'inherit',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >{s}</button>
              ))}
            </div>
          </div>

          {/* Couleur */}
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#999', marginBottom: '8px' }}>COULEUR</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => updateFilter('color', selectedColor === c ? '' : c)}
                  style={{
                    padding: '5px 12px', fontSize: '0.75rem', fontWeight: 600,
                    borderRadius: '20px', border: '1.5px solid',
                    borderColor: selectedColor === c ? 'var(--color-accent)' : '#ddd',
                    background: selectedColor === c ? 'var(--color-accent)' : 'transparent',
                    color: selectedColor === c ? 'white' : 'inherit',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >{c}</button>
              ))}
            </div>
          </div>

          {/* Reset */}
          {(selectedSize || selectedColor) && (
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '2px' }}>
              <button onClick={() => { setSearchParams({}); setPage(1) }}
                style={{ fontSize: '0.75rem', color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, letterSpacing: '0.05em' }}>
                ✕ RÉINITIALISER
              </button>
            </div>
          )}
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
            
            {/* Pagination */}
            {totalCount > 20 && (
              <nav className="shop-pagination" aria-label="Pagination">
                <button
                  className="shop-pagination__arrow"
                  disabled={page === 1}
                  onClick={() => { setPage(page - 1); window.scrollTo(0,0) }}
                  aria-label="Page précédente"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                </button>

                {Array.from({ length: Math.ceil(totalCount / 20) }, (_, i) => i + 1)
                  .filter(p => p === 1 || p === Math.ceil(totalCount / 20) || Math.abs(p - page) <= 2)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
                    acc.push(p)
                    return acc
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="shop-pagination__ellipsis">…</span>
                    ) : (
                      <button
                        key={p}
                        className={`shop-pagination__page ${p === page ? 'active' : ''}`}
                        onClick={() => { setPage(p); window.scrollTo(0,0) }}
                        aria-label={`Page ${p}`}
                      >{p}</button>
                    )
                  )
                }

                <button
                  className="shop-pagination__arrow"
                  disabled={page >= Math.ceil(totalCount / 20)}
                  onClick={() => { setPage(page + 1); window.scrollTo(0,0) }}
                  aria-label="Page suivante"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
