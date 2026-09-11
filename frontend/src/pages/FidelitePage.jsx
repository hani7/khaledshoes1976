import { Link } from 'react-router-dom'
import PageSEO from '../components/PageSEO'

export default function FidelitePage() {
  return (
    <main className="page-enter" style={{ paddingTop: 'var(--navbar-height)', paddingBottom: '80px', minHeight: '80vh' }}>
      <PageSEO
        title="Programme Fidélité — Khaled Shoes"
        description="Découvrez le programme de fidélité Khaled Shoes. Cumulez vos achats et recevez un bon de réduction de 10% tous les 25 000 DA dépensés."
        url="/fidelite"
      />

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #111 0%, #2a1a08 60%, #3d2510 100%)',
        padding: '70px 24px 60px',
        textAlign: 'center',
        color: '#fff',
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎁</div>
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 3rem)',
          fontWeight: 700,
          letterSpacing: '0.08em',
          marginBottom: '14px',
        }}>
          PROGRAMME FIDÉLITÉ
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto 28px' }}>
          Chez Khaled Shoes, nous récompensons votre fidélité avec des bons de réduction exclusifs.
        </p>
        <Link to="/compte/fidelite" style={{
          display: 'inline-block',
          background: '#F5EBE0',
          color: '#111',
          fontWeight: 700,
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          padding: '14px 32px',
          borderRadius: '50px',
          textDecoration: 'none',
        }}>
          VOIR MES POINTS
        </Link>
      </div>

      {/* Comment ça marche */}
      <div className="container" style={{ maxWidth: '860px', margin: '0 auto', padding: '60px var(--gutter)' }}>

        <h2 style={{
          fontSize: '1rem', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', textAlign: 'center',
          marginBottom: '40px', color: '#888',
        }}>
          COMMENT ÇA MARCHE ?
        </h2>

        {/* Étapes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '60px' }}>
          {[
            {
              num: '1',
              icon: '🛍️',
              title: 'Vous achetez',
              desc: 'Chaque dinar dépensé chez Khaled Shoes est comptabilisé dans votre historique.',
            },
            {
              num: '2',
              icon: '📊',
              title: 'On cumule',
              desc: 'Vos achats s\'accumulent automatiquement. Dès 25 000 DA cumulés, vous êtes récompensé.',
            },
            {
              num: '3',
              icon: '🎟️',
              title: 'Vous recevez',
              desc: 'Un bon de réduction de -10% est automatiquement généré et disponible dans votre compte.',
            },
            {
              num: '4',
              icon: '✅',
              title: 'Vous profitez',
              desc: 'Utilisez votre bon lors de votre prochain achat. Simple, automatique, sans démarche.',
            },
          ].map((step, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '28px 20px',
              border: '1px solid #f0ebe3',
              textAlign: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)',
                width: '28px', height: '28px', borderRadius: '50%',
                background: '#111', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
              }}>{step.num}</div>
              <div style={{ fontSize: '2.2rem', marginBottom: '12px', marginTop: '8px' }}>{step.icon}</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.7 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Bloc principal - Règle */}
        <div style={{
          background: '#F5EBE0',
          borderRadius: '20px',
          padding: '40px 36px',
          textAlign: 'center',
          marginBottom: '40px',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏆</div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 700, marginBottom: '12px' }}>
            25 000 DA d'achats
          </h2>
          <div style={{
            fontSize: '3.5rem', fontWeight: 900,
            color: 'var(--color-accent)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            marginBottom: '12px',
          }}>
            = –10%
          </div>
          <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, maxWidth: '440px', margin: '0 auto' }}>
            Dès que le total de vos achats atteint <strong>25 000 DA</strong>,
            vous recevez automatiquement un <strong>bon de réduction de 10%</strong> sur votre prochaine commande.
          </p>
        </div>

        {/* FAQ Fidélité */}
        <h2 style={{
          fontSize: '1rem', fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', marginBottom: '24px',
          paddingBottom: '10px', borderBottom: '2px solid #F5EBE0',
        }}>
          Questions fréquentes
        </h2>

        {[
          {
            q: 'Qui peut bénéficier du programme ?',
            a: 'Tout client ayant créé un compte sur khaledshoes.dz et ayant effectué au moins une commande.',
          },
          {
            q: 'Comment suivre mon total d\'achats ?',
            a: 'Connectez-vous à votre espace client → rubrique "Fidélité". Vous verrez votre total cumulé et votre progression.',
          },
          {
            q: 'Le bon de réduction expire-t-il ?',
            a: 'Oui, les bons de réduction sont valables pendant 6 mois à compter de leur date de génération.',
          },
          {
            q: 'Puis-je cumuler plusieurs bons ?',
            a: 'Un seul bon est utilisable par commande. Les bons non utilisés restent disponibles pour vos prochains achats.',
          },
          {
            q: 'Les retours sont-ils déduits de mon total ?',
            a: 'Oui, en cas de retour validé, le montant remboursé est retiré de votre total d\'achats cumulé.',
          },
        ].map((item, i) => (
          <div key={i} style={{
            borderBottom: '1px solid #f0ebe3',
            padding: '18px 0',
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '8px' }}>❓ {item.q}</p>
            <p style={{ color: '#555', fontSize: '0.9rem', lineHeight: 1.7 }}>{item.a}</p>
          </div>
        ))}

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <p style={{ color: '#666', marginBottom: '20px', fontSize: '0.95rem' }}>
            Vous n'avez pas encore de compte ?
          </p>
          <Link to="/compte" style={{
            display: 'inline-block',
            background: '#111', color: '#fff',
            fontWeight: 700, fontSize: '0.85rem',
            letterSpacing: '0.1em', padding: '14px 36px',
            borderRadius: '50px', textDecoration: 'none',
          }}>
            CRÉER MON COMPTE
          </Link>
        </div>
      </div>
    </main>
  )
}
