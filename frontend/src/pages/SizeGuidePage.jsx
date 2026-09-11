import PageSEO from '../components/PageSEO'
import './SizeGuidePage.css'

const WOMEN_SIZES = [
  { cm: 23,   fr: 36, uk: 3.5, us: 5,   it: 35 },
  { cm: 23.7, fr: 37, uk: 4,   us: 5.5, it: 36 },
  { cm: 24.4, fr: 38, uk: 5,   us: 6.5, it: 37 },
  { cm: 25,   fr: 39, uk: 5.5, us: 7.5, it: 38 },
  { cm: 25.7, fr: 40, uk: 6.5, us: 8,   it: 39 },
  { cm: 26.4, fr: 41, uk: 7.5, us: 9,   it: 40 },
  { cm: 27,   fr: 42, uk: 8,   us: 9.5, it: 41 },
]

const MEN_SIZES = [
  { cm: 25.7, fr: 40, uk: 6.5, us: 7,   it: 39 },
  { cm: 26.4, fr: 41, uk: 7,   us: 7.5, it: 40 },
  { cm: 27,   fr: 42, uk: 8,   us: 8.5, it: 41 },
  { cm: 27.7, fr: 43, uk: 9,   us: 9.5, it: 42 },
  { cm: 28.4, fr: 44, uk: 9.5, us: 10,  it: 43 },
  { cm: 29,   fr: 45, uk: 10.5,us: 11,  it: 44 },
  { cm: 29.7, fr: 46, uk: 11,  us: 12,  it: 45 },
]

function SizeTable({ title, rows }) {
  return (
    <div className="size-guide__table-wrapper">
      <table className="size-guide__table">
        <thead>
          <tr>
            <th colSpan={5} className="size-guide__table-title">{title}</th>
          </tr>
          <tr>
            <th>cm</th>
            <th>FR</th>
            <th>UK</th>
            <th>US</th>
            <th>IT</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row.cm}</td>
              <td><strong>{row.fr}</strong></td>
              <td>{row.uk}</td>
              <td>{row.us}</td>
              <td>{row.it}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function SizeGuidePage() {
  return (
    <main className="size-guide-page page-enter">
      <PageSEO
        title="Guide des Tailles — Khaled Shoes"
        description="Trouvez votre pointure idéale grâce à notre guide des tailles pour chaussures femme et homme. Conversions CM, FR, UK, US, IT."
        url="/size-guide"
      />

      <div className="size-guide__hero">
        <h1>GUIDE DES TAILLES</h1>
        <p>Trouvez facilement votre pointure grâce à nos tableaux de conversion</p>
      </div>

      <div className="size-guide__content container">

        {/* Mesure */}
        <section className="size-guide__section">
          <h2>Comment mesurer votre pied ?</h2>
          <div className="size-guide__steps">
            <div className="size-guide__step">
              <div className="size-guide__step-num">1</div>
              <p>Placez votre pied sur une feuille de papier posée sur le sol.</p>
            </div>
            <div className="size-guide__step">
              <div className="size-guide__step-num">2</div>
              <p>Tracez le contour de votre pied en tenant le crayon vertical.</p>
            </div>
            <div className="size-guide__step">
              <div className="size-guide__step-num">3</div>
              <p>Mesurez la distance entre le talon et l'orteil le plus long.</p>
            </div>
            <div className="size-guide__step">
              <div className="size-guide__step-num">4</div>
              <p>Comparez avec notre tableau ci-dessous pour trouver votre taille.</p>
            </div>
          </div>
          <div className="size-guide__tip">
            💡 <strong>Conseil :</strong> Mesurez vos pieds en fin de journée, ils sont légèrement plus grands. Si vous avez deux pieds de tailles différentes, choisissez la plus grande.
          </div>
        </section>

        {/* Tables */}
        <section className="size-guide__section">
          <SizeTable title="CHAUSSURES FEMME" rows={WOMEN_SIZES} />
        </section>



        {/* Info */}
        <section className="size-guide__section size-guide__info">
          <h2>Besoin d'aide ?</h2>
          <p>
            Si vous hésitez entre deux tailles, nous vous recommandons de choisir la taille supérieure.
            Pour plus d'informations, contactez-nous sur WhatsApp au <strong>0770 26 34 94</strong>.
          </p>
          <a
            href="https://wa.me/213770263494"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-accent"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contacter sur WhatsApp
          </a>
        </section>

      </div>
    </main>
  )
}
