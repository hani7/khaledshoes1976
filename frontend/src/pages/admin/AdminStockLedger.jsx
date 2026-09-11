import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'

export default function AdminStockLedger() {
  const [movements, setMovements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [filterBoutique, setFilterBoutique] = useState('')
  const [filterType, setFilterType] = useState('')
  const [boutiques, setBoutiques] = useState([])

  useEffect(() => {
    fetchBoutiques()
  }, [])

  useEffect(() => {
    fetchData()
  }, [filterBoutique, filterType])

  const fetchBoutiques = async () => {
    try {
      const res = await adminClient.get('/admin/boutiques/')
      setBoutiques(res.data.results || res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      let url = '/admin/stock-movements/'
      const params = new URLSearchParams()
      if (filterBoutique) params.append('boutique', filterBoutique)
      if (filterType) params.append('movement_type', filterType)
      if (params.toString()) url += `?${params.toString()}`

      const res = await adminClient.get(url)
      setMovements(res.data.results || res.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des mouvements.')
    } finally {
      setLoading(false)
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'purchase': return <span className="badge badge-active" style={{ background: '#107c41' }}>Achat (+ Entrée)</span>
      case 'sale': return <span className="badge badge-inactive" style={{ background: '#0ea5e9', color: 'white' }}>Vente (- Sortie)</span>
      case 'transfer_in': return <span className="badge" style={{ background: '#f59e0b', color: 'white' }}>Transfert In (+)</span>
      case 'transfer_out': return <span className="badge" style={{ background: '#f97316', color: 'white' }}>Transfert Out (-)</span>
      case 'adjustment_up': return <span className="badge badge-active">Ajustement (+)</span>
      case 'adjustment_down': return <span className="badge badge-inactive">Ajustement (-)</span>
      default: return <span className="badge">{type}</span>
    }
  }

  const totalEntriesQty = movements.filter(m => m.quantity > 0).reduce((acc, m) => acc + m.quantity, 0)
  const totalExitsQty = movements.filter(m => m.quantity < 0).reduce((acc, m) => acc + Math.abs(m.quantity), 0)
  
  const totalEntriesAmount = movements.filter(m => m.quantity > 0).reduce((acc, m) => acc + (m.quantity * (parseFloat(m.product_cost_price) || parseFloat(m.product_price) || 0)), 0)
  const totalExitsAmount = movements.filter(m => m.quantity < 0).reduce((acc, m) => acc + (Math.abs(m.quantity) * (parseFloat(m.product_cost_price) || parseFloat(m.product_price) || 0)), 0)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Mouvements de Stock</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select className="form-control" value={filterBoutique} onChange={e => setFilterBoutique(e.target.value)}>
            <option value="">Tous les magasins</option>
            {boutiques.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <select className="form-control" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tous les types</option>
            <option value="purchase">Achats</option>
            <option value="sale">Ventes</option>
            <option value="transfer_in">Transferts In</option>
            <option value="transfer_out">Transferts Out</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="admin-card" style={{ padding: '20px', borderLeft: '4px solid var(--admin-success)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Total Entrées</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--admin-success)' }}>+{totalEntriesQty}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', marginTop: 5 }}>Montant: {totalEntriesAmount.toLocaleString('fr-DZ')} DZD</div>
        </div>
        <div className="admin-card" style={{ padding: '20px', borderLeft: '4px solid var(--admin-danger)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 }}>Total Sorties</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--admin-danger)' }}>-{totalExitsQty}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--admin-text-muted)', marginTop: 5 }}>Montant: {totalExitsAmount.toLocaleString('fr-DZ')} DZD</div>
        </div>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spin" /><span>Chargement...</span></div>
      ) : error ? (
        <div className="admin-error">{error}</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Produit</th>
                <th>Magasin</th>
                <th>Type</th>
                <th>Quantité</th>
                <th>Référence</th>
              </tr>
            </thead>
            <tbody>
              {movements.map(m => (
                <tr key={m.id}>
                  <td>{new Date(m.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.product_name}</div>
                    {m.variant && <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Variante: {m.variant}</div>}
                  </td>
                  <td>{m.boutique_name}</td>
                  <td>{getTypeLabel(m.movement_type)}</td>
                  <td style={{ fontWeight: 600, color: m.quantity > 0 ? 'var(--admin-success)' : 'var(--admin-danger)' }}>
                    {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                  </td>
                  <td>{m.reference || '—'}</td>
                </tr>
              ))}
              {movements.length === 0 && (
                <tr><td colSpan={6}><div className="admin-empty">Aucun mouvement trouvé.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
