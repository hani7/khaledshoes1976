import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'

export default function AdminProfitReport() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchReport()
  }, [month, year])

  const fetchReport = async () => {
    setLoading(true)
    try {
      const res = await adminClient.get(`/admin/reports/profit/?month=${month}&year=${year}`)
      setReport(res.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des rapports.')
    } finally {
      setLoading(false)
    }
  }

  const months = [
    { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
    { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
    { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
    { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Rapport de Bénéfices (P&L)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-control" value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: '150px' }}>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          <select className="form-control" value={year} onChange={e => setYear(Number(e.target.value))} style={{ width: '100px' }}>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Chargement...</span></div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : report ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          
          <div className="admin-card" style={{ padding: '24px', borderLeft: '4px solid var(--admin-success)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--admin-text-muted)', margin: '0 0 10px 0' }}>Revenus des Ventes</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--admin-success)' }}>
              {Number(report.revenue).toLocaleString('fr-DZ')} <span style={{ fontSize: '1rem' }}>DA</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Commandes livrées et payées
            </p>
          </div>

          <div className="admin-card" style={{ padding: '24px', borderLeft: '4px solid var(--admin-danger)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--admin-text-muted)', margin: '0 0 10px 0' }}>Coût des Marchandises (COGS)</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--admin-danger)' }}>
              - {Number(report.cost_of_goods_sold).toLocaleString('fr-DZ')} <span style={{ fontSize: '1rem' }}>DA</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Prix d'achat des produits vendus
            </p>
          </div>

          <div className="admin-card" style={{ padding: '24px', borderLeft: '4px solid var(--admin-warning)' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--admin-text-muted)', margin: '0 0 10px 0' }}>Charges & Dépenses</h3>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--admin-warning)' }}>
              - {Number(report.expenses).toLocaleString('fr-DZ')} <span style={{ fontSize: '1rem' }}>DA</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
              Salaires, Loyer, Électricité, etc.
            </p>
          </div>

          <div className="admin-card" style={{ padding: '24px', gridColumn: '1 / -1', background: 'var(--admin-surface2)', border: report.net_profit >= 0 ? '2px solid var(--admin-success)' : '2px solid var(--admin-danger)' }}>
            <h3 style={{ fontSize: '1.2rem', margin: '0 0 10px 0' }}>Bénéfice Net</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: report.net_profit >= 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
              {Number(report.net_profit).toLocaleString('fr-DZ')} <span style={{ fontSize: '1.2rem' }}>DA</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>
              Revenus - COGS - Charges = Bénéfice Net
            </p>
          </div>

          {/* Statistiques Supplémentaires */}
          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>Indicateurs de Performance (KPIs)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              
              <div className="admin-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>Commandes Validées</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{report.orders_count || 0}</div>
              </div>

              <div className="admin-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>Panier Moyen (AOV)</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{Number(report.average_order_value || 0).toLocaleString('fr-DZ', {maximumFractionDigits:0})} DA</div>
              </div>

              <div className="admin-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>Marge Brute</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--admin-primary)' }}>{report.gross_margin_percentage || 0}%</div>
              </div>

              <div className="admin-card" style={{ padding: '20px' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginBottom: '8px' }}>Marge Nette</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: (report.net_margin_percentage || 0) >= 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>{report.net_margin_percentage || 0}%</div>
              </div>

            </div>
          </div>

        </div>
      ) : null}
    </div>
  )
}
