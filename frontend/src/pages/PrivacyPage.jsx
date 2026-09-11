import React from 'react'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', color: '#111', borderBottom: '2px solid #EDDEC9', paddingBottom: '8px' }}>{title}</h2>
    {children}
  </div>
)

export default function PrivacyPage() {
  return (
    <main className="page-enter" style={{ paddingBottom: '80px', minHeight: '60vh', background: '#fafafa' }}>
      {/* Header */}
      <div style={{ background: '#111', color: '#fff', padding: '60px 24px 50px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '14px' }}>
          Khaled Shoes
        </p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '16px' }}>
          Politique de Confidentialité
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Dernière mise à jour : Septembre 2026</p>
      </div>

      <div className="container" style={{ maxWidth: '820px', margin: '0 auto', padding: '50px 24px' }}>
        <div style={{ lineHeight: '1.9', fontSize: '0.97rem', color: '#444' }}>

          <Section title="1. Collecte des informations">
            <p>Lors de l'utilisation de notre site et de la passation d'une commande, nous collectons les informations suivantes :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Nom, prénom</li>
              <li style={{ marginBottom: '8px' }}>Numéro de téléphone</li>
              <li style={{ marginBottom: '8px' }}>Adresse de livraison (wilaya, commune, adresse)</li>
              <li style={{ marginBottom: '8px' }}>Adresse e-mail (si renseignée)</li>
              <li style={{ marginBottom: '8px' }}>Historique des commandes</li>
            </ul>
          </Section>

          <Section title="2. Utilisation des données">
            <p>Vos données personnelles sont utilisées exclusivement pour :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Traiter, préparer et expédier vos commandes</li>
              <li style={{ marginBottom: '8px' }}>Vous contacter pour confirmer ou suivre votre commande</li>
              <li style={{ marginBottom: '8px' }}>Gérer votre compte client et votre programme de fidélité</li>
              <li style={{ marginBottom: '8px' }}>Améliorer la qualité de nos services</li>
              <li style={{ marginBottom: '8px' }}>Vous informer de nos offres et nouveautés (avec votre consentement)</li>
            </ul>
          </Section>

          <Section title="3. Partage des données">
            <p>Khaled Shoes ne vend ni ne loue vos données personnelles à des tiers. Vos informations peuvent être partagées uniquement avec :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Nos partenaires de livraison, pour l'acheminement de vos commandes</li>
              <li style={{ marginBottom: '8px' }}>Les autorités compétentes, si la loi algérienne l'exige</li>
            </ul>
          </Section>

          <Section title="4. Sécurité des données">
            <p>Nous mettons en œuvre des mesures techniques appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation. Votre mot de passe est chiffré et n'est jamais stocké en clair.</p>
          </Section>

          <Section title="5. Cookies et pixels">
            <p>Notre site peut utiliser des cookies et pixels publicitaires (Meta Pixel, TikTok Pixel) pour :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Mémoriser vos préférences de navigation</li>
              <li style={{ marginBottom: '8px' }}>Analyser le trafic et améliorer notre site</li>
              <li style={{ marginBottom: '8px' }}>Personnaliser les publicités sur les réseaux sociaux</li>
            </ul>
            <p style={{ marginTop: '10px' }}>Vous pouvez désactiver les cookies dans les paramètres de votre navigateur.</p>
          </Section>

          <Section title="6. Conservation des données">
            <p>Vos données sont conservées aussi longtemps que votre compte est actif, ou pendant la durée nécessaire à l'exécution de nos obligations légales et contractuelles.</p>
          </Section>

          <Section title="7. Vos droits">
            <p>Conformément à la législation algérienne, vous disposez des droits suivants :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Droit d'accès à vos données personnelles</li>
              <li style={{ marginBottom: '8px' }}>Droit de rectification des informations inexactes</li>
              <li style={{ marginBottom: '8px' }}>Droit à l'effacement de vos données</li>
              <li style={{ marginBottom: '8px' }}>Droit d'opposition à l'utilisation de vos données à des fins marketing</li>
            </ul>
            <p style={{ marginTop: '10px' }}>Pour exercer ces droits, contactez-nous à : <strong>contact@khaledshoes.dz</strong></p>
          </Section>

          <Section title="8. Modifications">
            <p>Khaled Shoes se réserve le droit de modifier cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page avec une date de mise à jour.</p>
          </Section>

          <Section title="9. Contact">
            <p>Pour toute question relative à la protection de vos données :</p>
            <p style={{ marginTop: '10px' }}>
              📧 <strong>contact@khaledshoes.dz</strong><br />
              📞 <strong>0770 26 34 94</strong><br />
              📍 Chemin Sidi Yahia N°44, Sidi Yahia, Alger
            </p>
          </Section>

        </div>
      </div>
    </main>
  )
}
