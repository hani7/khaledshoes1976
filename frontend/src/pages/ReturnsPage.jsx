import { Link } from 'react-router-dom'
import PageSEO from '../components/PageSEO'

export default function ReturnsPage() {
  return (
    <main className="page-enter" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '80vh' }}>
      <PageSEO
        title="Retours & Échanges — Khaled Shoes"
        description="Politique de retour et d'échange Khaled Shoes. Échange de pointure possible dans les 48h après réception, dans la limite des stocks disponibles."
        url="/returns"
      />

      {/* Hero */}
      <div style={{
        background: '#F5EBE0',
        padding: '56px 24px 48px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>🔄</div>
        <h1 style={{
          fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: '10px',
          color: '#111',
        }}>
          RETOURS & ÉCHANGES
        </h1>
        <p style={{ color: '#666', fontSize: '1rem', maxWidth: '480px', margin: '0 auto' }}>
          Votre satisfaction est notre priorité. Consultez notre politique d'échange ci-dessous.
        </p>
      </div>

      {/* Contenu */}
      <div className="container" style={{ maxWidth: '760px', margin: '0 auto', padding: '52px var(--gutter)' }}>

        {/* Bloc principal */}
        <div style={{
          background: '#fff',
          border: '1px solid #f0ebe3',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          marginBottom: '32px',
        }}>

          {/* Section 1 */}
          <div style={{ padding: '28px 32px', borderBottom: '1px solid #f5f0ea' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                background: '#111', color: '#fff', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>👟</div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Échange de pointure
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
                  On propose l'échange de pointure, <strong>dans la limite des stocks disponibles</strong>.
                  Si vous souhaitez une autre pointure, contactez-nous <strong>au plus vite après réception de votre colis</strong>,
                  dans un délai maximum de <strong>48h</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div style={{ padding: '28px 32px', borderBottom: '1px solid #f5f0ea' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                background: '#111', color: '#fff', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>🛍️</div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Pointure non disponible
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
                  Si la pointure désirée n'est plus disponible, vous pouvez choisir
                  <strong> n'importe quel article d'échange</strong> sur le site.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div style={{ padding: '28px 32px', borderBottom: '1px solid #f5f0ea' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                background: '#111', color: '#fff', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>🚚</div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Frais de livraison retour
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
                  Il est à noter que <strong>les frais de livraison du produit à retourner sont à la charge du client</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '44px', height: '44px', minWidth: '44px',
                background: '#111', color: '#fff', borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.2rem',
              }}>📞</div>
              <div>
                <h2 style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Procédure
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.8 }}>
                  Après traitement de la demande, <strong>un membre de notre équipe vous contactera</strong> pour vous expliquer la procédure.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Note importante */}
        <div style={{
          background: '#F5EBE0',
          borderRadius: '12px',
          padding: '20px 24px',
          marginBottom: '32px',
          lineHeight: 1.8,
          fontSize: '0.92rem',
          color: '#333',
        }}>
          <p style={{ marginBottom: '8px' }}>
            📏 Veuillez consulter notre{' '}
            <Link to="/size-guide" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
              guide des tailles
            </Link>{' '}
            avant de confirmer votre commande.
          </p>
          <p>
            📄 Veillez à consulter nos{' '}
            <Link to="/conditions" style={{ color: 'var(--color-accent)', fontWeight: 700 }}>
              conditions générales de ventes
            </Link>.
          </p>
        </div>

        {/* Contact */}
        <div style={{
          background: '#111',
          color: '#fff',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '12px' }}>
            Des questions ?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: 1.8, marginBottom: '20px' }}>
            Pour toutes autres questions, n'hésitez pas à contacter notre service client.<br />
            Merci de votre confiance et à très bientôt chez Khaled Shoes !
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:contact@khaledshoes.dz" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#F5EBE0', color: '#111',
              padding: '12px 22px', borderRadius: '50px',
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em',
              textDecoration: 'none',
            }}>
              ✉️ contact@khaledshoes.dz
            </a>
            <a href="https://wa.me/213553947406" target="_blank" rel="noopener noreferrer" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#25D366', color: '#fff',
              padding: '12px 22px', borderRadius: '50px',
              fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em',
              textDecoration: 'none',
            }}>
              📱 WhatsApp
            </a>
          </div>
        </div>

      </div>
    </main>
  )
}
