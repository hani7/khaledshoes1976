import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageSEO from '../components/PageSEO'

const RATES = [
  { w: 'Adrar', h: 1400, d: 1100 },
  { w: 'Aïn Defla', h: 800, d: 400 },
  { w: 'Aïn Témouchent', h: 800, d: 400 },
  { w: 'Alger', h: 500, d: 300 },
  { w: 'Annaba', h: 800, d: 400 },
  { w: 'Batna', h: 800, d: 400 },
  { w: 'Béchar', h: 1400, d: 1100 },
  { w: 'Béjaïa', h: 800, d: 400 },
  { w: 'Béni Abbès', h: 1600, d: 1100 },
  { w: 'Biskra', h: 950, d: 600 },
  { w: 'Blida', h: 600, d: 350 },
  { w: 'Bordj Badji Mokhtar', h: 1600, d: 1100 },
  { w: 'Bordj Bou Arréridj', h: 800, d: 400 },
  { w: 'Bouira', h: 800, d: 400 },
  { w: 'Boumerdès', h: 700, d: 350 },
  { w: 'Chlef', h: 800, d: 400 },
  { w: 'Constantine', h: 800, d: 400 },
  { w: 'Djanet', h: 1800, d: 1500 },
  { w: 'Djelfa', h: 950, d: 600 },
  { w: 'El Bayadh', h: 1400, d: 1100 },
  { w: "El M'Ghair", h: 950, d: 600 },
  { w: 'El Menia', h: 1150, d: 600 },
  { w: 'El Meniaa', h: 500, d: 300 },
  { w: 'El Oued', h: 950, d: 600 },
  { w: 'El Tarf', h: 800, d: 400 },
  { w: 'Ghardaïa', h: 950, d: 600 },
  { w: 'Guelma', h: 800, d: 400 },
  { w: 'Illizi', h: 1600, d: 1500 },
  { w: 'In Guezzam', h: 1800, d: 1500 },
  { w: 'In Salah', h: 1600, d: 1500 },
  { w: 'Jijel', h: 800, d: 400 },
  { w: 'Khenchela', h: 800, d: 400 },
  { w: 'Laghouat', h: 950, d: 600 },
  { w: "M'Sila", h: 800, d: 400 },
  { w: 'Mascara', h: 800, d: 400 },
  { w: 'Médéa', h: 800, d: 400 },
  { w: 'Mila', h: 800, d: 400 },
  { w: 'Mostaganem', h: 800, d: 400 },
  { w: 'Naâma', h: 1400, d: 1100 },
  { w: 'Oran', h: 800, d: 400 },
  { w: 'Ouargla', h: 950, d: 600 },
  { w: 'Ouled Djellal', h: 950, d: 600 },
  { w: 'Oum El Bouaghi', h: 800, d: 400 },
  { w: 'Relizane', h: 800, d: 400 },
  { w: 'Saïda', h: 800, d: 400 },
  { w: 'Sétif', h: 800, d: 400 },
  { w: 'Sidi Bel Abbès', h: 850, d: 400 },
  { w: 'Skikda', h: 800, d: 400 },
  { w: 'Souk Ahras', h: 800, d: 400 },
  { w: 'Tamanrasset', h: 1600, d: 1500 },
  { w: 'Tébessa', h: 950, d: 600 },
  { w: 'Tiaret', h: 800, d: 400 },
  { w: 'Timimoun', h: 1400, d: 1100 },
  { w: 'Tindouf', h: 1600, d: 1500 },
  { w: 'Tipaza', h: 600, d: 350 },
  { w: 'Tissemsilt', h: 800, d: 400 },
  { w: 'Tizi Ouzou', h: 800, d: 400 },
  { w: 'Tlemcen', h: 800, d: 400 },
  { w: 'Touggourt', h: 950, d: 600 },
]

function getPriceBadge(price) {
  if (price <= 350) return { label: 'Gratuit quasi', color: '#10b981' }
  if (price <= 600) return { label: 'Économique', color: '#3b82f6' }
  if (price <= 950) return { label: 'Standard', color: '#f59e0b' }
  return { label: 'Grand sud', color: '#ef4444' }
}

export default function ShippingPage() {
  const [trackQuery, setTrackQuery] = useState('')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const handleTrack = (e) => {
    e.preventDefault()
    if (!trackQuery.trim()) return
    navigate(`/suivi?q=${encodeURIComponent(trackQuery.trim())}`)
  }

  const filtered = useMemo(() =>
    RATES.filter(r => r.w.toLowerCase().includes(search.toLowerCase())),
    [search]
  )

  const highlighted = search.trim() && filtered.length === 1 ? filtered[0] : null

  return (
    <main className="page-enter" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '80vh' }}>
      <PageSEO
        title="Expédition & Suivi — Khaled Shoes"
        description="Consultez les tarifs de livraison Khaled Shoes pour toutes les wilayas d'Algérie. Suivi de commande en ligne."
        url="/livraison"
      />

      {/* ── Tracking Hero ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0d 60%, #2d0a14 100%)',
        padding: '60px 24px 50px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <span style={{ fontSize: '3rem', display: 'block', marginBottom: '16px' }}>🚚</span>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '10px' }}>
          EXPÉDITION & SUIVI
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', marginBottom: '32px' }}>
          Entrez votre numéro de commande ou votre numéro de téléphone
        </p>
        <form onSubmit={handleTrack} style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', gap: '10px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50px', padding: '6px 6px 6px 20px',
          }}>
            <input
              id="track-order-input"
              type="text"
              value={trackQuery}
              onChange={e => setTrackQuery(e.target.value)}
              placeholder="Numéro de commande ou téléphone..."
              autoComplete="off"
              style={{
                flex: 1, background: 'transparent', border: 'none', outline: 'none',
                color: '#fff', fontSize: '1rem', fontFamily: 'inherit',
              }}
            />
            <button type="submit" id="track-order-btn" style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--color-accent)', color: '#fff', border: 'none',
              borderRadius: '50px', padding: '12px 22px',
              fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
              letterSpacing: '0.08em', whiteSpace: 'nowrap',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              CHERCHER
            </button>
          </div>
        </form>
      </div>

      {/* ── Info Cards ── */}
      <div className="container" style={{ padding: '40px var(--gutter) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
          {[
            { icon: '⚡', title: '24h – 72h', desc: 'Délai de livraison' },
            { icon: '🏙️', title: '58 Wilayas', desc: "Toute l'Algérie" },
            { icon: '💰', title: 'Paiement à la livraison', desc: 'Payez à la réception' },
            { icon: '🔄', title: '7 jours', desc: 'Pour retourner votre article' },
          ].map((c, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '12px', padding: '18px 16px',
              border: '1px solid #f0ebe3', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{c.icon}</div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{c.title}</p>
              <p style={{ fontSize: '0.78rem', color: '#999' }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tarifs de livraison ── */}
      <div className="container" style={{ padding: '40px var(--gutter)' }}>
        <h2 style={{
          fontSize: '1rem', fontWeight: 700, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '20px',
          paddingBottom: '10px', borderBottom: '2px solid #F5EBE0',
        }}>
          Tarifs de livraison par wilaya
        </h2>

        {/* Recherche wilaya */}
        <div style={{ position: 'relative', marginBottom: '20px', maxWidth: '400px' }}>
          <input
            id="wilaya-search-input"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Rechercher votre wilaya..."
            style={{
              width: '100%', padding: '12px 16px 12px 44px',
              border: '2px solid #F5EBE0', borderRadius: '10px',
              fontSize: '0.9rem', fontFamily: 'inherit',
              outline: 'none', boxSizing: 'border-box',
              background: '#fffdf9',
            }}
          />
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#bbb' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>

        {/* Résultat mis en avant */}
        {highlighted && (
          <div style={{
            background: '#F5EBE0', borderRadius: '12px', padding: '20px 24px',
            marginBottom: '20px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
          }}>
            <div>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#888', marginBottom: '4px' }}>
                Votre wilaya
              </p>
              <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>📍 {highlighted.w}</p>
            </div>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>🏠 À domicile</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-accent)' }}>{highlighted.h} DA</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>🏢 Point relais</p>
                <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#333' }}>{highlighted.d} DA</p>
              </div>
            </div>
          </div>
        )}

        {/* Tableau */}
        <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid #f0ebe3', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#111', color: '#fff' }}>
                <th style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.75rem' }}>WILAYA</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.75rem' }}>🏠 DOMICILE</th>
                <th style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.75rem' }}>🏢 POINT RELAIS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const badge = getPriceBadge(r.h)
                const isMatch = search.trim() && r.w.toLowerCase().includes(search.toLowerCase())
                return (
                  <tr key={i} style={{
                    background: isMatch ? '#fffaf0' : i % 2 === 0 ? '#fff' : '#fafafa',
                    borderBottom: '1px solid #f0ebe3',
                    transition: 'background 0.15s',
                  }}>
                    <td style={{ padding: '13px 20px', fontWeight: isMatch ? 700 : 400 }}>
                      {isMatch && <span style={{ marginRight: '6px' }}>📍</span>}
                      {r.w}
                      <span style={{
                        marginLeft: '10px', fontSize: '0.65rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: '20px', color: '#fff',
                        background: badge.color, letterSpacing: '0.05em',
                      }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '13px 20px', textAlign: 'center', fontWeight: 700, color: 'var(--color-accent)' }}>
                      {r.h} DA
                    </td>
                    <td style={{ padding: '13px 20px', textAlign: 'center', fontWeight: 600, color: '#333' }}>
                      {r.d} DA
                    </td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                    Aucune wilaya trouvée pour &quot;{search}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Note */}
        <div style={{ marginTop: '24px', background: '#F5EBE0', borderRadius: '10px', padding: '16px 20px' }}>
          <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.7 }}>
            📞 <strong>Besoin d'aide ?</strong> Contactez-nous au <strong>0553 94 74 06</strong> ou sur{' '}
            <a href="https://wa.me/213553947406" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              WhatsApp
            </a>. Paiement à la livraison uniquement.
          </p>
        </div>
      </div>
    </main>
  )
}
