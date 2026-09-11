import React from 'react'

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 style={{ fontSize: '1.15rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px', color: '#111', borderBottom: '2px solid #F5EBE0', paddingBottom: '8px' }}>{title}</h2>
    {children}
  </div>
)

export default function TermsPage() {
  return (
    <main className="page-enter" style={{ paddingBottom: '80px', minHeight: '60vh', background: '#fafafa' }}>
      {/* Header */}
      <div style={{ background: '#111', color: '#fff', padding: '60px 24px 50px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#999', marginBottom: '14px' }}>
          Khaled Shoes
        </p>
        <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 700, letterSpacing: '0.04em', marginBottom: '16px' }}>
          Conditions Générales de Vente
        </h1>
        <p style={{ color: '#aaa', fontSize: '0.85rem' }}>Dernière mise à jour : Septembre 2026</p>
      </div>

      <div className="container" style={{ maxWidth: '820px', margin: '0 auto', padding: '50px 24px' }}>
        <div style={{ lineHeight: '1.9', fontSize: '0.97rem', color: '#444' }}>

          <Section title="1. Présentation">
            <p><strong>Khaled Shoes</strong> est une boutique spécialisée dans la vente de chaussures et sacs inspirés du style italien, présente en Algérie depuis 2001. Le site <strong>khaledshoes.dz</strong> permet aux clients de passer des commandes en ligne avec livraison dans toute l'Algérie.</p>
            <p style={{ marginTop: '10px' }}>L'utilisation de ce site implique l'acceptation pleine et entière des présentes conditions générales de vente.</p>
          </Section>

          <Section title="2. Produits et disponibilité">
            <p>Nos produits sont proposés dans la limite des stocks disponibles. En cas d'indisponibilité après validation de la commande, nous vous en informerons dans les plus brefs délais.</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Les photos sont présentées à titre illustratif. Des légères variations de couleur peuvent exister selon les écrans.</li>
              <li style={{ marginBottom: '8px' }}>Les prix sont exprimés en Dinars Algériens (DA) TTC.</li>
              <li style={{ marginBottom: '8px' }}>Khaled Shoes se réserve le droit de modifier ses prix à tout moment.</li>
            </ul>
          </Section>

          <Section title="3. Commandes">
            <p>Pour passer une commande, vous devez renseigner vos coordonnées complètes. Chaque commande est confirmée par SMS ou appel téléphonique par notre équipe.</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Khaled Shoes se réserve le droit de refuser toute commande en cas de suspicion de fraude.</li>
              <li style={{ marginBottom: '8px' }}>En cas d'erreur sur la commande passée, contactez-nous immédiatement au <strong>0553 94 74 06</strong>.</li>
              <li style={{ marginBottom: '8px' }}>Les commandes sont traitées du lundi au samedi, de 9h00 à 20h00.</li>
            </ul>
          </Section>

          <Section title="4. Paiement">
            <p>Le paiement s'effectue <strong>à la livraison (paiement en espèces)</strong>. Aucun paiement en ligne n'est exigé lors de la commande.</p>
            <p style={{ marginTop: '10px' }}>Merci de préparer le montant exact lors de la réception de votre colis.</p>
          </Section>

          <Section title="5. Livraison">
            <p>Nous livrons dans les <strong>58 wilayas d'Algérie</strong> via nos partenaires de livraison.</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Délai moyen : <strong>24h à 72h</strong> selon la wilaya.</li>
              <li style={{ marginBottom: '8px' }}>Les frais de livraison sont affichés lors de la commande selon votre wilaya.</li>
              <li style={{ marginBottom: '8px' }}>En cas d'absence lors de la livraison, le livreur vous recontactera.</li>
              <li style={{ marginBottom: '8px' }}>Khaled Shoes ne peut être tenu responsable de tout retard dû aux services de livraison tiers.</li>
            </ul>
          </Section>

          <Section title="6. Échanges et retours">
            <p>Nous proposons l'échange de pointure dans la limite des stocks disponibles, sous les conditions suivantes :</p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li style={{ marginBottom: '8px' }}>Délai maximum : <strong>48h</strong> après réception du colis.</li>
              <li style={{ marginBottom: '8px' }}>Le produit doit être non porté, dans son état d'origine avec son emballage.</li>
              <li style={{ marginBottom: '8px' }}>Les frais de retour sont à la charge du client.</li>
              <li style={{ marginBottom: '8px' }}>Si la pointure désirée n'est plus disponible, vous pouvez choisir un autre article de valeur équivalente.</li>
            </ul>
            <p style={{ marginTop: '10px' }}>Pour toute demande d'échange, contactez-nous au <strong>0553 94 74 06</strong> ou sur nos réseaux sociaux.</p>
            <p style={{ marginTop: '8px' }}>Veuillez consulter notre <strong>guide des tailles</strong> avant de confirmer votre commande.</p>
          </Section>

          <Section title="7. Programme Fidélité">
            <p>Pour chaque tranche de <strong>25 000 DA</strong> d'achats cumulés, vous bénéficiez d'un bon de réduction de <strong>10%</strong> sur votre prochaine commande.</p>
            <p style={{ marginTop: '10px' }}>Les points de fidélité sont calculés automatiquement sur votre compte client.</p>
          </Section>

          <Section title="8. Propriété intellectuelle">
            <p>Tout le contenu de ce site (images, textes, logos, vidéos, design) est la propriété exclusive de <strong>Khaled Shoes</strong>. Toute reproduction ou utilisation sans autorisation écrite est strictement interdite.</p>
          </Section>

          <Section title="9. Responsabilité">
            <p>Khaled Shoes s'engage à proposer des produits de qualité italienne. Toutefois, nous ne saurions être tenus responsables des dommages indirects résultant d'une mauvaise utilisation des produits.</p>
          </Section>

          <Section title="10. Droit applicable">
            <p>Les présentes conditions sont régies par le droit algérien. Tout litige sera soumis aux tribunaux compétents d'Alger.</p>
          </Section>

          <Section title="11. Contact">
            <p>Pour toute question concernant vos commandes ou nos conditions :</p>
            <p style={{ marginTop: '10px' }}>
              📧 <strong>contact@khaledshoes.dz</strong><br />
              📞 <strong>0553 94 74 06</strong><br />
              📍 Chemin Sidi Yahia N°44, Sidi Yahia, Alger<br />
              📍 39 Rue du Hoggar, Hydra, Alger
            </p>
          </Section>

        </div>
      </div>
    </main>
  )
}
