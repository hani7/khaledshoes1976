import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, getNewArrivals, getCategories, getBanners, getPromotions } from '../api/products'
import mediaUrl from '../api/mediaUrl'
import ProductCarousel from '../components/ProductCarousel'
import ProductCard from '../components/ProductCard'
import CategoryCarouselSection from '../components/CategoryCarouselSection'
import './HomePage.css'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [promotions, setPromotions] = useState([])
  const [categories, setCategories] = useState([])
  const [heroBanners, setHeroBanners] = useState([])
  const [slide, setSlide] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getFeaturedProducts(),
      getNewArrivals(),
      getPromotions(),
      getCategories(),
      getBanners()
    ])
      .then(([feat, newArr, promos, cats, bans]) => {
        setFeatured(feat.data.results || feat.data)
        setNewArrivals(newArr.data.results || newArr.data)
        setPromotions(promos.data.results || promos.data)
        setCategories(cats.data.results || cats.data)
        
        const allBanners = bans.data.results || bans.data
        const heroes = allBanners.filter(b => b.placement === 'hero' && b.is_active !== false)
        setHeroBanners(heroes)
      })
      .finally(() => setLoading(false))
  }, [])


  const nextSlide = useCallback(() => {
    if (heroBanners.length > 0) {
      setSlide((s) => (s + 1) % heroBanners.length)
    }
  }, [heroBanners])
  
  const prevSlide = useCallback(() => {
    if (heroBanners.length > 0) {
      setSlide((s) => (s - 1 + heroBanners.length) % heroBanners.length)
    }
  }, [heroBanners])

  useEffect(() => {
    if (heroBanners.length > 1) {
      const t = setInterval(nextSlide, 5000)
      return () => clearInterval(t)
    }
  }, [nextSlide, heroBanners.length])

  return (
    <main className="homepage page-enter">
      {/* Hero Slider */}
      {loading ? (
        /* Skeleton hero pendant le chargement */
        <section className="hero hero-skeleton" aria-hidden="true" style={{ background: '#f1f5f9', minHeight: '80vh' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
        </section>
      ) : heroBanners.length > 0 ? (
        <section 
          className={`hero hero--${(slide % 3) + 1}`}
          aria-label="Bannière principale"
        >
          {/* Image ou Vidéo hero — visible complètement sur mobile */}
          {heroBanners[slide].image ? (
            heroBanners[slide].image.match(/\.(mp4|webm|mov)$/i) ? (
              <video
                key={`video-${slide}`}
                src={mediaUrl(heroBanners[slide].image)}
                className="hero__bg-img"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <img
                key={`img-${slide}`}
                src={mediaUrl(heroBanners[slide].image)}
                alt={heroBanners[slide].title || 'Bannière'}
                className="hero__bg-img"
                loading="eager"
                fetchPriority="high"
              />
            )
          ) : null}
        <div className="hero__content container">
          <div className="hero__text">
            <p className="hero__eyebrow">{heroBanners[slide].subtitle}</p>
            <h1 className="hero__title">{heroBanners[slide].title}</h1>
          </div>
        </div>

        {/* Button above dots */}
        <div className="hero__bottom">
          {(heroBanners[slide].cta_label || heroBanners[slide].cta_url) && (
            <Link to={heroBanners[slide].cta_url || '/shop'} className="btn btn-accent hero__cta">
              {heroBanners[slide].cta_label || 'Découvrir'}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ marginLeft: '8px' }}>
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </Link>
          )}

          {heroBanners.length > 1 && (
            <div className="hero__dots">
              {heroBanners.map((_, i) => (
                <button
                  key={i}
                  className={`hero__dot ${i === slide ? 'hero__dot--active' : ''}`}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  id={`hero-dot-${i}`}
                />
              ))}
            </div>
          )}
        </div>

        {heroBanners.length > 1 && (
          <>
            <button className="hero__prev" onClick={prevSlide} aria-label="Précédent" id="hero-prev">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="hero__next" onClick={nextSlide} aria-label="Suivant" id="hero-next">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}
      </section>
      ) : null}




      {/* Categories */}
      <section className="section" id="categories-section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="categories-grid">
          {(() => {
            // Only show categories that actually have a non-empty image
            const withImage = (categories || []).filter(c => c.is_active && c.image && String(c.image).trim() !== '')
            // Featured first, then others
            const featured = withImage.filter(c => c.is_featured)
            const others   = withImage.filter(c => !c.is_featured)
            const toShow   = [...featured, ...others].slice(0, 6)
            return toShow.map((cat) => (
              <Link key={cat.slug} to={`/${cat.slug}`} className="cat-card" id={`cat-${cat.slug}`}>
                <div className="cat-card__img">
                  {cat.image ? (
                    <img src={`${mediaUrl(cat.image)}?v=${cat.updated_at || Date.now()}`} alt={cat.name} />
                  ) : (
                    <div className="cat-card__placeholder" />
                  )}
                </div>
                <div className="cat-card__overlay">
                  <p className="cat-card__name">{cat.name.toUpperCase()}</p>
                </div>
              </Link>
            ))
          })()}
        </div>
      </section>




      {/* ── Brand Manifesto ── */}
      <section style={{
        background: '#fff',
        padding: '72px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <p style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: '18px',
          }}>
            Since 2001
          </p>
          <h2 style={{
            fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            color: '#111',
            marginBottom: '28px',
            lineHeight: 1.25,
          }}>
            MAISON DE CHAUSSURES À L'ÉLÉGANCE ITALIENNE
          </h2>
          <div style={{
            width: '48px',
            height: '2px',
            background: '#111',
            margin: '0 auto 28px',
          }} />
          <p style={{
            fontSize: '1rem',
            color: '#444',
            lineHeight: 1.9,
            marginBottom: '16px',
          }}>
            Plongez dans l'univers de Khaled Shoes, une maison née d'une conviction : une chaussure peut être élégante et dans l'air du temps, tout en restant confortable, raffinée et accessible.
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#444',
            lineHeight: 1.9,
            marginBottom: '16px',
          }}>
            Depuis 2001, nous sélectionnons avec passion des chaussures et des sacs inspirés du style italien, pour accompagner chaque femme au quotidien comme lors de ses plus belles occasions.
          </p>
          <p style={{
            fontSize: '0.95rem',
            color: '#666',
            lineHeight: 1.9,
            fontStyle: 'italic',
          }}>
            Depuis le premier jour, nous ne faisons aucun compromis sur le style, la qualité et le confort.
          </p>
        </div>
      </section>

      {/* ── Best Sellers ── */}
      <section style={{ background: '#fff', padding: '60px 0 70px' }}>
        <p style={{
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 700,
          letterSpacing: '0.28em',
          textTransform: 'uppercase',
          color: '#111',
          marginBottom: '36px',
        }}>
          ⭐ &nbsp; Best Sellers
        </p>
        <ProductCarousel
          title=""
          products={featured}
          isLoading={loading}
        />
      </section>

      {/* ── Loyalty Promo Block ── */}
      <section className="loyalty-block">
        <div className="loyalty-block__inner">
          {/* Left — illustration */}
          <div className="loyalty-block__emoji">🎁</div>

          {/* Divider */}
          <div className="loyalty-block__divider" />

          {/* Right — text */}
          <div className="loyalty-block__content">
            <p className="loyalty-block__label">Programme Fidélité</p>
            <h2 className="loyalty-block__title">
              Profitez de notre programme fidélité<br />
              <span style={{ color: '#9a6b40' }}>pour gagner un bon d'achat de 10%</span>
            </h2>
            <p className="loyalty-block__desc">
              Chaque achat vous rapproche d'une réduction exclusive. Cumulez vos points et bénéficiez de 10% de remise sur votre prochaine commande dès 25 000 DA d'achats.
            </p>
            <Link
              to="/fidelite"
              className="loyalty-block__btn"
              onMouseEnter={e => { e.currentTarget.style.background = '#9a6b40' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#111' }}
            >
              Découvrir le programme
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Promotions ── */}
      {(promotions.length > 0 || loading) && (
        <section style={{ background: '#fafafa', padding: '60px 0 70px' }}>
          <p style={{
            textAlign: 'center',
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#111',
            marginBottom: '36px',
          }}>
            🏷️ &nbsp; PROMO
          </p>
          <ProductCarousel
            title=""
            products={promotions}
            isLoading={loading}
          />
        </section>
      )}

    </main>
  )
}
