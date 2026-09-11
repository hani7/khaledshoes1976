import PageSEO from '../components/PageSEO'

const STORES = [
  {
    id: 'sidi-yahia',
    name: 'SIDI YAHIA',
    tag: 'Boutique principale',
    image: '/boutique-sidi-yahia.jpg',
    address: 'Sidi Yahia, Hydra, Alger',
    phone: '0770 26 34 94',
    phone2: null,
    hours: 'Lun – Sam : 9h00 – 20h00',
    mapsUrl: 'https://maps.google.com/?q=Khaled+Shoes+Sidi+Yahia+Alger',
    accent: '#EDDEC9',
  },
  {
    id: 'hydra',
    name: 'HYDRA',
    tag: 'Outlet — Prix réduits toute l\'année',
    image: '/boutique-hydra.png',
    address: 'Hydra, Alger',
    phone: '0553 94 74 06',
    phone2: null,
    hours: 'Lun – Sam : 9h00 – 20h00',
    mapsUrl: 'https://maps.google.com/?q=Khaled+Shoes+Hydra+Alger',
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
        background: '#EDDEC9',
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
            gridTemplateColumns: i % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
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
                      color: store.dark ? '#EDDEC9' : 'var(--color-accent)',
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
                  background: store.dark ? '#EDDEC9' : '#111',
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

      {/* WhatsApp CTA */}
      <div style={{ textAlign: 'center', padding: '0 24px' }}>
        <div style={{
          background: '#111', color: '#fff',
          borderRadius: '16px', padding: '32px 40px',
          maxWidth: '600px', margin: '0 auto',
        }}>
          <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'rgba(255,255,255,0.8)' }}>
            Vous souhaitez vérifier la disponibilité d'un article avant de vous déplacer ?
          </p>
          <a href="https://wa.me/213770263494" target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            background: '#25D366', color: '#fff',
            padding: '14px 28px', borderRadius: '50px',
            fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.06em',
            textDecoration: 'none',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Nous contacter sur WhatsApp
          </a>
        </div>
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
