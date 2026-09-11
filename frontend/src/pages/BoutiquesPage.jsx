import PageSEO from '../components/PageSEO'

const STORES = [
  {
    id: 'sidi-yahia',
    name: 'SIDI YAHIA',
    tag: 'Boutique principale',
    image: '/boutique-sidi-yahia.jpg',
    address: 'Chemin Sidi Yahia N°44, Sidi Yahia, Alger',
    phone: '0553 94 74 06',
    phone2: null,
    hours: 'Lun – Sam : 9h00 – 20h00',
    mapsUrl: 'https://maps.app.goo.gl/GqGXYnfNHgM8auu79',
    accent: '#F5EBE0',
  },
  {
    id: 'hydra',
    name: 'HYDRA',
    tag: 'Outlet — Prix réduits toute l\'année',
    image: '/boutique-hydra.png',
    address: '39 Rue du Hoggar, Hydra, Alger',
    phone: '0553 94 74 06',
    phone2: null,
    hours: 'Lun – Sam : 9h00 – 20h00',
    mapsUrl: 'https://maps.app.goo.gl/uJyzzKU6RVX6q2wJ8',
    accent: '#1a1a1a',
    dark: true,
  },
]

export default function BoutiquesPage() {
  return (
    <main className="page-enter" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '80vh' }}>
      <PageSEO
        title="Nos Boutiques — Khaled Shoes"
        description="Retrouvez Khaled Shoes dans nos 2 boutiques à Alger : Sidi Yahia et Hydra. Sac & Chaussure Italien depuis 2001."
        url="/boutiques"
      />

      {/* Hero */}
      <div style={{
        background: '#F5EBE0',
        padding: '52px 24px 44px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.18em', color: '#888', textTransform: 'uppercase', marginBottom: '10px' }}>
          Sac & Chaussure Italien — Since 2001
        </p>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          color: '#111',
          marginBottom: '10px',
        }}>
          NOS BOUTIQUES
        </h1>
        <p style={{ color: '#666', fontSize: '0.95rem' }}>
          Venez nous rendre visite dans l'une de nos boutiques à Alger.
        </p>
      </div>

      {/* Stores */}
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '52px var(--gutter)', display: 'flex', flexDirection: 'column', gap: '48px' }}>
        {STORES.map((store, i) => (
          <div key={store.id} style={{
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            gap: '0',
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.1)',
            flexDirection: i % 2 !== 0 ? 'row-reverse' : 'row',
          }}>

            {/* Image */}
            <div style={{
              order: i % 2 !== 0 ? 2 : 1,
              position: 'relative',
              minHeight: '400px',
            }}>
              <img
                src={store.image}
                alt={`Boutique Khaled Shoes ${store.name}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Tag overlay */}
              <div style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                background: store.dark ? 'rgba(0,0,0,0.85)' : 'rgba(237,222,201,0.95)',
                color: store.dark ? '#fff' : '#111',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: '6px 14px',
                borderRadius: '20px',
              }}>
                {store.tag}
              </div>
            </div>

            {/* Info */}
            <div style={{
              order: i % 2 !== 0 ? 1 : 2,
              background: store.dark ? '#111' : '#fff',
              color: store.dark ? '#fff' : '#111',
              padding: '44px 40px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '20px',
            }}>
              <div>
                <p style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: store.dark ? 'rgba(255,255,255,0.45)' : '#bbb',
                  marginBottom: '6px',
                }}>
                  Boutique
                </p>
                <h2 style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                }}>
                  {store.name}
                </h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Adresse */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>📍</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: store.dark ? 'rgba(255,255,255,0.45)' : '#aaa', marginBottom: '2px' }}>Adresse</p>
                    <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{store.address}</p>
                  </div>
                </div>

                {/* Téléphone */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>📞</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: store.dark ? 'rgba(255,255,255,0.45)' : '#aaa', marginBottom: '2px' }}>Téléphone</p>
                    <a href={`tel:${store.phone.replace(/\s/g,'')}`} style={{
                      fontSize: '1rem', fontWeight: 700,
                      color: store.dark ? '#F5EBE0' : 'var(--color-accent)',
                      textDecoration: 'none',
                    }}>
                      {store.phone}
                    </a>
                    {store.phone2 && (
                      <a href={`tel:${store.phone2.replace(/\s/g,'')}`} style={{
                        display: 'block', fontSize: '0.95rem', fontWeight: 600,
                        color: store.dark ? 'rgba(237,222,201,0.7)' : '#888',
                        textDecoration: 'none', marginTop: '2px',
                      }}>
                        {store.phone2}
                      </a>
                    )}
                  </div>
                </div>

                {/* Horaires */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '1.1rem', marginTop: '1px' }}>🕐</span>
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: store.dark ? 'rgba(255,255,255,0.45)' : '#aaa', marginBottom: '2px' }}>Horaires</p>
                    <p style={{ fontSize: '0.92rem' }}>{store.hours}</p>
                  </div>
                </div>
              </div>

              {/* Bouton Maps */}
              <a
                href={store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                id={`maps-btn-${store.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: store.dark ? '#F5EBE0' : '#111',
                  color: store.dark ? '#111' : '#fff',
                  padding: '14px 24px',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  letterSpacing: '0.1em',
                  textDecoration: 'none',
                  alignSelf: 'flex-start',
                  marginTop: '4px',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                VOIR SUR MAPS
              </a>
            </div>
          </div>
        ))}
      </div>


      {/* Responsive */}
      <style>{`
        @media (max-width: 700px) {
          .boutique-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  )
}
