import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        
        <div className="footer__whatsapp">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 0C5.383 0 .002 5.381.002 12.029c0 2.124.553 4.195 1.605 6.02L.034 23.996l6.104-1.601c1.761.947 3.738 1.447 5.892 1.447 6.647 0 12.027-5.38 12.027-12.029C24.056 5.381 18.678 0 12.031 0zm0 21.84c-1.802 0-3.567-.485-5.112-1.403l-.367-.217-3.805.998.998-3.712-.238-.379c-1.008-1.608-1.54-3.463-1.54-5.384 0-5.65 4.597-10.246 10.248-10.246 5.648 0 10.245 4.596 10.245 10.246 0 5.649-4.597 10.246-10.245 10.246h-.184zm5.617-7.669c-.308-.154-1.821-.899-2.103-1.003-.282-.102-.487-.154-.693.154-.205.308-.795 1.003-.974 1.208-.179.205-.359.23-.667.077-1.488-.737-2.673-1.458-3.682-3.238-.21-.371-.023-.572.13-.725.138-.138.308-.359.461-.539.154-.18.205-.308.308-.513.102-.205.051-.385-.026-.539-.077-.154-.692-1.668-.948-2.283-.251-.601-.507-.52-.693-.529-.18-.009-.384-.009-.589-.009-.205 0-.539.077-.821.385-.282.308-1.077 1.052-1.077 2.566s1.103 2.977 1.257 3.181c.154.205 2.172 3.315 5.258 4.646.733.316 1.306.505 1.753.646.736.233 1.406.2 1.934.12.59-.088 1.821-.744 2.077-1.463.256-.718.256-1.334.18-1.463-.077-.128-.282-.205-.59-.359z"/>
          </svg>
          <span>Écrivez-nous sur WhatsApp: 0553 94 74 06</span>
        </div>

        <div className="footer__top">
          <div className="footer__col footer__col--newsletter">
            <h4>NEWSLETTER</h4>
            <p className="footer__desc">
              Nouveaux produits et ventes privées, notre Butler vous dira tout...
            </p>
            <form className="footer__form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="E-mail" required className="footer__input" />
              <button type="submit" className="footer__btn">REJOINDRE LA LISTE</button>
            </form>
            <div className="footer__social">
              <a href="https://www.instagram.com/khaled_shoes/?hl=fr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="https://www.facebook.com/khaled.shoes/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@khaled.shoes" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.31-1.92 1.57-4.62 2.2-7.03 1.5-3.25-.94-5.58-4.14-5.4-7.52.12-2.55 1.5-4.87 3.58-6.15 1.64-1.01 3.73-1.38 5.61-1.1v4.11c-.5-.09-1.02-.13-1.52-.08-1.54.14-2.89 1.34-3.24 2.85-.36 1.54.2 3.23 1.48 4.11 1.49 1.03 3.76.84 4.88-.53.79-.97 1.15-2.28 1.13-3.53-.05-6.84-.02-13.67-.03-20.51h-.16z"/></svg>
              </a>
            </div>
            
            <p className="footer__copyright">
              © {new Date().getFullYear()} - KHALED SHOES
            </p>
          </div>

          <div className="footer__col">
            <h4>LA MARQUE</h4>
            <Link to="/boutiques">Boutiques</Link>
            <Link to="/terms">Conditions Générales</Link>
            <Link to="/privacy">Politique de Confidentialité</Link>
          </div>

          <div className="footer__col">
            <h4>CONCIERGE</h4>
            <Link to="/size-guide">Guide des tailles</Link>
            <Link to="/livraison">Expédition & Suivi</Link>
            <Link to="/fidelite">Programme Fidélité</Link>
            <Link to="/returns">Retours & Remboursements</Link>
            <Link to="/faq">FAQ</Link>
          </div>

          <div className="footer__col">
            <h4>ASSISTANCE</h4>
            <p>Contactez-nous par e-mail</p>
            <a href="mailto:contact@khaledshoes.dz" style={{ color: 'var(--color-white)', marginTop: '8px' }}>contact@khaledshoes.dz</a>
            
            <div style={{ marginTop: '30px' }}>
              <p>Téléphone</p>
              <a href="tel:0553947406" style={{ color: 'var(--color-white)', marginTop: '8px' }}>0553 94 74 06</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
