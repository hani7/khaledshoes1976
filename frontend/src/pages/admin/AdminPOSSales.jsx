import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Plus, Trash2, Printer, RefreshCw } from 'lucide-react'
import adminClient from '../../api/adminClient'


function Pagination({ page, totalPages, onPage }) {
  const actualTotalPages = Math.max(1, totalPages)
  if (actualTotalPages <= 1) return (
    <div className="admin-pagination">
      <button className="admin-page-btn" disabled>&#8249;</button>
      <button className="admin-page-btn active">1</button>
      <button className="admin-page-btn" disabled>&#8250;</button>
    </div>
  )
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
      acc.push(p)
      return acc
    }, [])
  return (
    <div className="admin-pagination">
      <button className="admin-page-btn" disabled={page === 1} onClick={() => onPage(page - 1)}>&#8249;</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} style={{ color: 'var(--admin-text-muted)', padding: '0 4px' }}>&#8230;</span>
          : <button key={p} className={`admin-page-btn ${p === page ? 'active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      )}
      <button className="admin-page-btn" disabled={page === totalPages} onClick={() => onPage(page + 1)}>&#8250;</button>
    </div>
  )
}

const STATUS_LABELS = {
  pending: 'En attente',
  payment_failed: 'Paiement échoué',
  confirmed: 'Confirmé',
  en_cours: 'En cours',
  shipped: 'En livraison',
  fulfilled: 'Livrée',
  cancelled: 'Annulée',
  returned: 'Retournée',
  boutique: 'En Boutique',
}

const STATUS_BADGE = {
  pending: 'badge-pending',
  payment_failed: 'badge-danger',
  confirmed: 'badge-confirmed',
  en_cours: 'badge-pending',
  shipped: 'badge-shipped',
  fulfilled: 'badge-fulfilled',
  cancelled: 'badge-cancelled',
  returned: 'badge-returned',
  boutique: 'badge-pending',
}

// Couleurs calquées sur le portail Yalidine
export const YALIDINE_STATUS_STYLE = (s = '') => {
  const sl = s.toLowerCase()
  if (sl.includes('livré'))
                                               return { bg: '#dcfce7', color: '#15803d', border: '#86efac', icon: '✅' }
  if (sl.includes('en cours de livraison') || sl.includes('out for delivery'))
                                               return { bg: '#dbeafe', color: '#1d4ed8', border: '#93c5fd', icon: '🚚' }
  if (sl.includes('centre'))
                                               return { bg: '#e0e7ff', color: '#4338ca', border: '#a5b4fc', icon: '🏢' }
  if (sl.includes('transit'))
                                               return { bg: '#fef9c3', color: '#a16207', border: '#fde047', icon: '🚛' }
  if (sl.includes('prép') || sl.includes('pickup'))
                                               return { bg: '#fef3c7', color: '#b45309', border: '#fcd34d', icon: '📦' }
  if (sl.includes('cré') || sl.includes('upload') || sl.includes('created'))
                                               return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: '📝' }
  if (sl.includes('retour') || sl.includes('reverse') || sl.includes('return'))
                                               return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', icon: '↩️' }
  if (sl.includes('cancel'))                   return { bg: '#f3f4f6', color: '#6b7280', border: '#d1d5db', icon: '❌' }
  if (sl.includes('echec') || sl.includes('failed')) return { bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', icon: '⚠️' }
  return { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa', icon: '📦' }
}

export default function AdminPOSSales() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(25)
  const [selectedIds, setSelectedIds] = useState([])
  const [yalidineFilter, setYalidineFilter] = useState('')   // 'with' | 'without' | or yalidine_status value
  const [yalidineShipping, setYalidineShipping] = useState(false)
  const [yalidineSyncing, setYalidineSyncing] = useState(false)

  const handleModalShip = async (orderId) => {
    if (!window.confirm('Expédier cette commande via Yalidine ?')) return
    setYalidineShipping(true)
    try {
      await adminClient.post(`/admin/orders/${orderId}/yalidine_ship/`)
      const fresh = await adminClient.get(`/admin/orders/${orderId}/`)
      setDetail(fresh.data)
      load()
    } catch (e) {
      const msg = e.response?.data?.message || e.response?.data?.error || JSON.stringify(e.response?.data) || 'Erreur Yalidine'
      alert('\u274C ' + msg)
    } finally {
      setYalidineShipping(false)
    }
  }

  // ── Sync statut Yalidine → Piové ──────────────────────────────────────────
  const handleSyncYalidine = async (orderId) => {
    setYalidineSyncing(true)
    try {
      const res = await adminClient.get(`/admin/orders/${orderId}/yalidine_track/`)
      const fresh = await adminClient.get(`/admin/orders/${orderId}/`)
      setDetail(fresh.data)
      // Mettre à jour dans la liste aussi
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, yalidine_status: fresh.data.yalidine_status, status: fresh.data.status } : o))
      const myStatus = res.data?.yalidine_status || ''
      const pioveStatus = res.data?.piove_status || fresh.data.status || ''
      alert(`✅ Sync réussie\nYalidine : ${myStatus}\nStatut Piové : ${STATUS_LABELS[pioveStatus] || pioveStatus}`)
    } catch (e) {
      const msg = e.response?.data?.error || e.response?.data?.message || 'Impossible de contacter Yalidine'
      alert('\u274C ' + msg)
    } finally {
      setYalidineSyncing(false)
    }
  }

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams()
    // Only send standard Piové status to backend — Yalidine filters are client-side only
    if (filter && !filter.startsWith('yalidine:')) params.append('status', filter)
    if (paymentFilter) params.append('payment_status', paymentFilter)
    if (deliveryFilter) params.append('delivery_type', deliveryFilter)
    if (search) params.append('search', search)
    params.append('page_size', 500)
    params.append('source', 'pos')
    adminClient.get(`/admin/orders/?${params}`)
      .then(r => setOrders(r.data.results || r.data))
      .catch(err => {
        console.error('Erreur chargement commandes:', err?.response?.data || err)
        setOrders([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { 
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && detail) setDetail(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [detail])

  // ── Auto-sync Yalidine quand on ouvre un détail avec barcode ───────────────────
  useEffect(() => {
    if (!detail?.yalidine_tracking) return
    // Sync silencieux en arrière-plan
    adminClient.get(`/admin/orders/${detail.id}/yalidine_track/`)
      .then(res => {
        const newYalidine = res.data?.yalidine_status
        const newPiove  = res.data?.piove_status
        if (newYalidine && (newYalidine !== detail.yalidine_status || newPiove !== detail.status)) {
          setDetail(prev => prev ? { ...prev, yalidine_status: newYalidine, status: newPiove || prev.status } : prev)
          setOrders(prev => prev.map(o =>
            o.id === detail.id
              ? { ...o, yalidine_status: newYalidine, status: newPiove || o.status }
              : o
          ))
        }
      })
      .catch(() => {/* silencieux */})
  }, [detail?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { 
    setPage(1)
    load() 
  }, [filter, paymentFilter, deliveryFilter, search])

  useEffect(() => {
    adminClient.post('/admin/orders/mark_viewed/', { type: 'normal' })
      .then(() => {
        window.dispatchEvent(new Event('ordersViewed'))
      })
      .catch(() => {})
  }, [])

  const handleSelectAll = (e) => {
    const visibleOrders = orders.slice((page - 1) * perPage, page * perPage)
    if (e.target.checked) {
      const newIds = new Set([...selectedIds, ...visibleOrders.map(o => o.id)])
      setSelectedIds(Array.from(newIds))
    } else {
      const visibleIds = visibleOrders.map(o => o.id)
      setSelectedIds(selectedIds.filter(id => !visibleIds.includes(id)))
    }
  }

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleBulkDelete = async () => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer les ${selectedIds.length} commande(s) sélectionnée(s) ?`)) return
    try {
      await adminClient.post('/admin/orders/bulk_delete/', { ids: selectedIds })
      setSelectedIds([])
      load()
    } catch (e) {
      alert('Erreur lors de la suppression groupée')
    }
  }

  const handleBulkStatusUpdate = async (statusId) => {
    if (!window.confirm(`Mettre à jour le statut des ${selectedIds.length} commandes vers "${STATUS_LABELS[statusId]}" ?`)) return
    try {
      await adminClient.post('/admin/orders/bulk_update_status/', { ids: selectedIds, status: statusId })
      setSelectedIds([])
      load()
    } catch (e) {
      alert('Erreur lors de la mise à jour')
    }
  }

  const handleBulkExportExcel = async () => {
    try {
      const r = await adminClient.post('/admin/orders/bulk_export_excel/', { ids: selectedIds }, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([r.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'commandes_export.xlsx')
      document.body.appendChild(link)
      link.click()
    } catch (e) {
      alert('Erreur lors de l\'export Excel')
    }
  }

  const handleBulkPackingSlips = async () => {
    if (selectedIds.length === 0) return
    try {
      const r = await adminClient.post('/admin/orders/bulk_packing_slips/', { ids: selectedIds })
      const w = window.open('about:blank', '_blank')
      w.document.open()
      w.document.write(r.data)
      w.document.close()
    } catch (e) {
      alert('Erreur lors de la génération des bons')
    }
  }

  const handleBulkYalidineShip = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm('Voulez-vous générer les colis Yalidine pour les commandes sélectionnées ?')) return
    try {
      const res = await adminClient.post('/admin/orders/bulk_yalidine_ship/', { ids: selectedIds })
      const results = res.data?.results || []
      const failed = results.filter(r => !r.success)
      const ok = results.filter(r => r.success)
      if (failed.length === 0) {
        alert(`âœ… ${ok.length} colis Yalidine créé(s) avec succès.`)
      } else {
        const msgs = failed.map(r => `#${r.id}: ${r.message || r.error || 'Erreur inconnue'}`).join('\n')
        alert(`⚠️ ${ok.length} réussi(s), ${failed.length} échec(s):\n\n${msgs}`)
      }
      load()
    } catch (e) {
      const msg = e.response?.data?.detail || e.response?.data?.error || e.message || 'Erreur inconnue'
      alert(`Erreur Yalidine:\n${msg}`)
    }
  }

  const handleBulkYalidineTrack = async () => {
    if (selectedIds.length === 0) return
    try {
      await adminClient.post('/admin/orders/bulk_yalidine_track/', { ids: selectedIds })
      alert('Statuts Yalidine actualisés.')
      load()
    } catch (e) {
      alert("Erreur lors de l'actualisation Yalidine.")
    }
  }

  const handleBulkYalidineCancel = async () => {
    if (selectedIds.length === 0) return
    if (!window.confirm('Voulez-vous vraiment annuler les envois Yalidine sélectionnés ?')) return
    try {
      await adminClient.post('/admin/orders/bulk_yalidine_cancel/', { ids: selectedIds })
      alert('Envois Yalidine annulés.')
      load()
    } catch (e) {
      alert("Erreur lors de l'annulation Yalidine.")
    }
  }

  const handleYalidineTest = async () => {
    try {
      const res = await adminClient.get('/admin/orders/yalidine_test/')
      const d = res.data
      const html = `<!DOCTYPE html><html><head><title>Yalidine Diagnostic</title>
<style>body{font-family:monospace;background:#0f172a;color:#e2e8f0;padding:24px;margin:0}
h2{color:#38bdf8;margin-bottom:16px}
.ok{color:#4ade80}.err{color:#f87171}.sec{color:#fbbf24;margin-top:16px;font-weight:bold}
pre{background:#1e293b;padding:16px;border-radius:8px;overflow:auto;white-space:pre-wrap;word-break:break-all;font-size:13px}
</style></head><body>
<h2>ðŸ”§ Diagnostic Yalidine</h2>
<pre>Username    : ${d.username || '(vide)'}
Password    : ${d.password_set ? '<span class="ok">âœ… Configuré</span>' : '<span class="err">âŒ Non configuré</span>'}
Warehouse   : ${d.warehouse || '(vide)'}
Base URL    : ${d.base_url}
Auth        : <span class="${d.auth === 'OK' ? 'ok' : 'err'}">${d.auth}</span></pre>
${d.addorders_status ? `<div class="sec">--- Test AddOrders ---</div>
<pre>HTTP Status : <span class="${d.addorders_status < 300 ? 'ok' : 'err'}">${d.addorders_status}</span>
Réponse     : ${JSON.stringify(d.addorders_response || d.addorders_response_raw || d.addorders_error, null, 2)}</pre>` : ''}
</body></html>`
      const w = window.open('', '_blank', 'width=800,height=600')
      w.document.write(html)
      w.document.close()
    } catch (e) {
      alert('Erreur diagnostic: ' + (e.response?.data?.detail || e.message))
    }
  const handlePrintSingleBordereau = async (id) => {
    try {
      const r = await adminClient.post('/admin/orders/bulk_packing_slips/', { ids: [id] })
      const w = window.open('about:blank', '_blank')
      w.document.open()
      w.document.write(r.data)
      w.document.close()
    } catch (e) {
      alert('Erreur lors de la génération du bordereau')
    }
  }

  // Vrais statuts Yalidine Algeria connus
  const YALIDINE_STATUS_OPTIONS = [
    'En préparation',
    'En centre',
    'En transit',
    'En cours de livraison',
    'Livré',
    'Echec de livraison',
    'Retour vers centre',
    'Retourné à l\'expéditeur',
  ]

  // Statuts Yalidine dynamiques (présents dans les commandes chargées)
  const dynamicYalidineStatuses = [...new Set(orders.map(o => o.yalidine_status).filter(Boolean))]
  // Fusionner statuts connus + dynamiques sans doublons
  const allYalidineStatuses = [...new Set([...YALIDINE_STATUS_OPTIONS, ...dynamicYalidineStatuses])]

  const filteredOrders = (() => {
    // Filtre par statut Yalidine (préfixé 'yalidine:')
    if (filter?.startsWith('yalidine:')) {
      const ms = filter.slice(9)
      return orders.filter(o => (o.yalidine_status || '') === ms)
    }
    // Filtre par statut Piové standard
    if (filter) return orders.filter(o => o.status === filter)
    return orders
  })()
  const visibleOrders = filteredOrders.slice((page - 1) * perPage, page * perPage)
  const allVisibleSelected = visibleOrders.length > 0 && visibleOrders.every(o => selectedIds.includes(o.id))

  const activeOrders = orders.filter(o =>
    o.status !== 'cancelled' && o.status !== 'returned' && o.status !== 'payment_failed'
  )
  const stats = {
    total:          orders.length,
    revenue:        activeOrders.reduce((acc, o) => acc + Number(o.total) - Number(o.delivery_cost || 0), 0),
    pending:        orders.filter(o => o.status === 'pending' || o.status === 'en_cours').length,
    payment_failed: orders.filter(o => o.status === 'payment_failed').length,
    confirmed:      orders.filter(o => o.status === 'confirmed').length,
    shipped:        orders.filter(o => o.status === 'shipped').length,
    fulfilled:      orders.filter(o => o.status === 'fulfilled').length,
    cancelled:      orders.filter(o => o.status === 'cancelled' || o.status === 'returned').length,
    avgBasket: activeOrders.length > 0
      ? Math.round(activeOrders.reduce((acc, o) => acc + Number(o.total) - Number(o.delivery_cost || 0), 0) / activeOrders.length)
      : 0,
  }

  // Yalidine stats — count orders per Yalidine status
  const yalidineOrdersTotal = orders.filter(o => o.yalidine_tracking).length
  const yalidineStatsCounts = {}
  allYalidineStatuses.forEach(s => yalidineStatsCounts[s] = 0)
  
  orders.forEach(o => {
    if (o.yalidine_status) {
      yalidineStatsCounts[o.yalidine_status] = (yalidineStatsCounts[o.yalidine_status] || 0) + 1
    }
  })
  
  // Conserver l'ordre logique défini par allYalidineStatuses
  const yalidineStatsEntries = allYalidineStatuses.map(s => [s, yalidineStatsCounts[s]])
  const yalidineTotal = yalidineStatsEntries.reduce((s, [, c]) => s + c, 0)

  const KpiCard = ({ label, value, sub, color, icon }) => (
    <div style={{
      background: 'white',
      borderRadius: 14,
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      border: '1px solid #f1f5f9',
      borderTop: `3px solid ${color}`,
      minWidth: 0,
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem',
      }}>{icon}</div>
      <div style={{ minWidth: 0, overflow: 'hidden' }}>
        <div style={{ fontSize: '0.58rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{value}</div>
        {sub && <div style={{ fontSize: '0.56rem', color: '#cbd5e1', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  )

  return (
    <div>
      {/* ── Piové KPIs ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 9, marginBottom: 10 }}>
        <KpiCard label="Total"       value={stats.total}                                              color="#0f172a"  icon="📋" />
        <KpiCard label="Revenus"     value={`${stats.revenue.toLocaleString('fr-DZ')} DA`}            color="#10b981"  icon="💰" sub="hors annulées" />
        <KpiCard label="Panier Moy." value={`${stats.avgBasket.toLocaleString('fr-DZ')} DA`}          color="#6366f1"  icon="🛒" sub="cmd actives" />
        <KpiCard label="En Attente"  value={stats.pending}                                            color="#f59e0b"  icon="⏳" />
        <KpiCard label="Confirmées"  value={stats.confirmed}                                          color="#8b5cf6"  icon="✅" />
        <KpiCard label="Annulées"    value={`${stats.cancelled}${stats.total > 0 ? ` · ${Math.round(stats.cancelled/stats.total*100)}%` : ''}`} color="#94a3b8" icon="🚫" />
      </div>


      <div className="admin-page-header">
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Commandes</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          {selectedIds.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: 4 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Actions ({selectedIds.length}) :</span>
              
              <select 
              className="admin-filter-select" 
              style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: 140 }}
              onChange={(e) => { if (e.target.value) handleBulkStatusUpdate(e.target.value); e.target.value = ''; }}
            >
              <option value="">Marquer comme...</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#3b82f6', color: 'white', borderRadius: 50, border: 'none', whiteSpace: 'nowrap' }} onClick={handleBulkYalidineShip}>
              Expédier
            </button>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.8rem', background: '#f59e0b', color: 'white', borderRadius: 50, border: 'none', whiteSpace: 'nowrap' }} onClick={handleBulkYalidineTrack}>
              <RefreshCw size={14}/> Actualiser
            </button>
            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#ef4444', color: 'white', borderRadius: 50, border: 'none', whiteSpace: 'nowrap' }} onClick={handleBulkYalidineCancel}>
              Annuler Envoi
            </button>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', fontSize: '0.8rem', background: '#8b5cf6', color: 'white', borderRadius: 50, border: 'none', whiteSpace: 'nowrap' }} onClick={handleBulkPackingSlips}>
              <Printer size={14}/> Imprimer
            </button>
            <button className="btn" style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#10b981', color: 'white', borderRadius: 50, border: 'none', whiteSpace: 'nowrap' }} onClick={handleBulkExportExcel}>
              📊 Exporter
            </button>
            <button className="btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px', background: '#1f2937', color: 'white', borderRadius: 50, border: 'none' }} title="Supprimer" onClick={handleBulkDelete}>
              <Trash2 size={16}/>
            </button>
            </div>
          ) : (
            <>
            <button className="btn-primary" onClick={() => navigate('/kh-76/orders/new')}>
              <Plus size={16}/> Créer une Commande
            </button>
            </>
          )}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div className="admin-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                placeholder="Nom, téléphone..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="orders-search"
              />
            </div>
            <select
              className="admin-filter-select"
              value={filter}
              onChange={e => { setFilter(e.target.value); setPage(1) }}
              id="orders-filter"
            >
              <option value="">Tous les statuts</option>
              <optgroup label="── Statuts Piové ──">
                {Object.entries(STATUS_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </optgroup>
              <optgroup label="── Statuts Yalidine ──">
                {allYalidineStatuses.map(s => (
                  <option key={s} value={`yalidine:${s}`}>📦 {s}</option>
                ))}
              </optgroup>
            </select>
            <select
              className="admin-filter-select"
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
            >
              <option value="">Paiement: Tous</option>
              <option value="unpaid">Non payé</option>
              <option value="paid">Payé</option>
              <option value="refunded">Remboursé</option>
            </select>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
              Afficher
              <select 
                className="form-control" 
                style={{ width: 'auto', padding: '4px 24px 4px 12px', fontSize: '0.85rem', height: '32px' }}
                value={perPage} 
                onChange={e => { setPerPage(Number(e.target.value)); setPage(1); }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              par page
            </div>
          </div>
          <span style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>
            {filter ? `${filteredOrders.length} / ${orders.length}` : orders.length} commande{orders.length !== 1 ? 's' : ''}
          </span>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="spin" /><span>Chargement...</span></div>
        ) : (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th style={{ width: 40, textAlign: 'center' }}>
                      <input type="checkbox" checked={allVisibleSelected} onChange={handleSelectAll} style={{ cursor: 'pointer' }} />
                    </th>
                    <th>#</th><th>Client</th><th>Contact</th><th>Wilaya</th>
                    <th>T.Produits</th>
                  <th>Livraison</th>
                  <th>Total</th>
                    <th>Paiement</th><th>Statut</th><th>Origine</th><th>Date</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map(o => (
                  <tr 
                    key={o.id} 
                    style={{ ...(o.is_blacklisted ? { background: '#fff0f0' } : {}) }}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <input type="checkbox" checked={selectedIds.includes(o.id)} onChange={() => handleSelect(o.id)} style={{ cursor: 'pointer' }} />
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem' }}>#{o.id}</td>
                    <td style={{ fontWeight: 500 }}>
                      {o.customer_name}
                      {o.is_blacklisted && <span className="badge badge-danger" style={{marginLeft: 8, fontSize: '0.65rem', padding: '2px 4px'}}>BLACKLIST</span>}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>
                      {o.guest_phone || (o.user ? '—' : '—')}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.82rem' }}>{o.wilaya || '—'}</td>
                    <td style={{ fontWeight: 600 }}>{(o.items || []).reduce((acc, it) => acc + Number(it.subtotal || (it.price_at_purchase * it.quantity)), 0).toLocaleString('fr-DZ')} DA</td>
                    <td style={{ color: 'var(--color-gray-500)' }}>{Number(o.delivery_cost).toLocaleString('fr-DZ')} DA</td>
                    <td style={{ fontWeight: 700, color: 'var(--color-black)' }}>{Number(o.total).toLocaleString('fr-DZ')} DA</td>
                    <td>
                      {o.payment_method === 'cib' ? (
                        <span className="badge" style={{ background: '#2563eb', color: 'white', fontSize: '0.65rem', padding: '3px 10px', whiteSpace: 'nowrap', borderRadius: '50px', fontWeight: 'bold' }}>EN LIGNE</span>
                      ) : o.payment_method === 'yassir' ? (
                        <span className="badge" style={{ background: '#8b5cf6', color: 'white', fontSize: '0.65rem', padding: '3px 10px', whiteSpace: 'nowrap', borderRadius: '50px', fontWeight: 'bold' }}>YASSIR</span>
                      ) : (
                        <span className="badge" style={{ background: '#16a34a', color: 'white', fontSize: '0.65rem', padding: '3px 10px', whiteSpace: 'nowrap', borderRadius: '50px', fontWeight: 'bold' }}>CASH</span>
                      )}
                    </td>
                    <td>
                      {o.yalidine_tracking ? (() => {
                        const ms = YALIDINE_STATUS_STYLE(o.yalidine_status)
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <span style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: ms.bg, color: ms.color,
                              border: `1px solid ${ms.border}`,
                              fontSize: '0.65rem', padding: '3px 8px', borderRadius: 20,
                              fontWeight: 700, whiteSpace: 'nowrap', maxWidth: 180,
                            }}>
                              {ms.icon} {o.yalidine_status || 'Shipment Created'}
                            </span>
                            <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontFamily: 'monospace' }}>{o.yalidine_tracking}</span>
                          </div>
                        )
                      })() : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span className={`badge ${STATUS_BADGE[o.status]}`} style={{ fontSize: '0.65rem', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                            {STATUS_LABELS[o.status]}
                          </span>
                          {o.status === 'boutique' && o.boutique_name && (
                            <span style={{ fontSize: '0.65rem', color: '#8b5cf6', fontWeight: 700, background: '#f5f3ff', padding: '2px 6px', borderRadius: '4px', border: '1px solid #ddd6fe', whiteSpace: 'nowrap' }}>
                              📍 {o.boutique_name}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                      {(() => {
                        if (!o.source) return <span style={{ color: 'var(--admin-text-muted)' }}>—</span>
                        const parts = o.source.split(' | ')
                        const mainSource = parts[0]
                        const extras = parts.slice(1).join(' / ')

                        const SRC = {
                          fb:      { label: 'Facebook',  bg: '#1877f2' },
                          ig:      { label: 'Instagram', bg: '#e1306c' },
                          direct:  { label: 'Direct',    bg: '#6366f1' },
                          google:  { label: 'Google',    bg: '#34a853' },
                          tiktok:  { label: 'TikTok',    bg: '#010101' },
                          referral:{ label: 'Référent',  bg: '#10b981' },
                        }
                        const s = SRC[mainSource] || { label: mainSource, bg: '#64748b' }
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ background: s.bg, color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, alignSelf: 'flex-start' }}>{s.label}</span>
                            {extras && <span style={{ fontSize: '0.65rem', color: 'var(--admin-text-muted)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={extras}>{extras}</span>}
                          </div>
                        )
                      })()}
                    </td>
                    <td style={{ color: 'var(--admin-text-muted)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                      {new Date(o.created_at).toLocaleDateString('fr-DZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button 
                          className="btn-icon" 
                          style={{ padding: '6px', background: '#f1f5f9', borderRadius: '50%', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }} 
                          onClick={() => setDetail(o)} 
                          title="Aperçu rapide"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          style={{ padding: '6px', background: '#f1f5f9', borderRadius: '50%', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }} 
                          onClick={() => navigate(`/kh-76/orders/${o.id}`)} 
                          title="Détails complets"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </button>
                        <button 
                          className="btn-icon" 
                          style={{ padding: '6px', background: '#fef2f2', borderRadius: '50%', color: '#dc3545', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28 }} 
                          onClick={async () => {
                            if(window.confirm('Supprimer cette commande ?')) {
                              await adminClient.delete(`/admin/orders/${o.id}/`);
                              load();
                            }
                          }}
                          title="Supprimer"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                  {orders.length === 0 && (
                    <tr><td colSpan={10}><div className="admin-empty"><p>Aucune commande.</p></div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '16px', padding: '0 4px' }}>
              <Pagination page={page} totalPages={Math.ceil(orders.length / perPage)} onPage={setPage} />
            </div>
          </>
        )}
      </div>

      {/* QUICK PREVIEW MODAL */}
      {detail && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setDetail(null)}>
          <div className="admin-modal" style={{ maxWidth: 600 }}>
            <div className="admin-modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-modal-title">Aperçu Commande #{detail.id}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)', marginRight: 16, fontWeight: 500, background: '#f1f5f9', padding: '4px 10px', borderRadius: 20 }}>{detail.items?.length || 0} article{detail.items?.length > 1 ? 's' : ''}</span>
                <button type="button" className="admin-modal-close" onClick={() => setDetail(null)}><X size={20}/></button>
              </div>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{detail.customer_name}</div>
                  <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>{detail.guest_phone || '—'}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)', marginBottom: 4 }}>LIVRAISON</div>
                    <div style={{ fontSize: '0.9rem' }}>{detail.shipping_address}</div>
                    <div style={{ color: 'var(--admin-text-muted)', fontSize: '0.85rem' }}>{detail.wilaya} — {detail.city}</div>
                  </div>
                  {/* Badge type de paiement */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '6px 12px', borderRadius: 8, alignSelf: 'flex-start',
                    background: detail.payment_method === 'cib' ? '#e0e7ff' : detail.payment_method === 'yassir' ? '#fef08a' : '#f0fdf4',
                    border: `1px solid ${detail.payment_method === 'cib' ? '#c7d2fe' : detail.payment_method === 'yassir' ? '#fde047' : '#bbf7d0'}`,
                  }}>
                    <span style={{ fontSize: '1rem' }}>{detail.payment_method === 'cib' ? '💳' : detail.payment_method === 'yassir' ? '📱' : '💵'}</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: detail.payment_method === 'cib' ? '#3730a3' : detail.payment_method === 'yassir' ? '#854d0e' : '#166534' }}>
                        {detail.payment_method === 'cib' ? 'En ligne' : detail.payment_method === 'yassir' ? 'Yassir Cash' : 'Cash'}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: detail.payment_method === 'cib' ? '#4338ca' : detail.payment_method === 'yassir' ? '#a16207' : '#15803d' }}>
                        {detail.payment_method === 'cib' ? 'CIB / Edahabia' : detail.payment_method === 'yassir' ? "Paiement via l'application Yassir" : 'Paiement à la livraison'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Bloc statut Yalidine (si barcode) ── */}
              {detail.yalidine_tracking && (() => {
                const ms = YALIDINE_STATUS_STYLE(detail.yalidine_status)
                return (
                  <div style={{
                    background: ms.bg,
                    border: `1.5px solid ${ms.border}`,
                    borderRadius: 12,
                    padding: '12px 16px',
                    marginBottom: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: '1.4rem' }}>{ms.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: ms.color, marginBottom: 2 }}>
                          Statut Yalidine
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: ms.color }}>
                          {detail.yalidine_status || 'Shipment Created'}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: ms.color, opacity: 0.7, marginBottom: 2 }}>Barcode</div>
                      <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 600, color: ms.color }}>{detail.yalidine_tracking}</div>
                    </div>
                  </div>
                )
              })()}

              <div style={{ background: 'var(--admin-surface2)', borderRadius: 8, overflow: 'hidden', marginBottom: 16 }}>
                {detail.items?.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--admin-border)' }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{item.product_name}</div>
                      {item.variant_name && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--admin-text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
                          {item.variant_color && (
                            <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.variant_color, border: '1px solid rgba(0,0,0,0.15)', flexShrink: 0 }} />
                          )}
                          <span style={{ fontStyle: 'italic' }}>{item.variant_name}</span>
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Qté: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 600 }}>{Number(item.subtotal).toLocaleString('fr-DZ')} DA</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--admin-border)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Sous-total</span>
                  <span style={{ fontWeight: 500 }}>{(Number(detail.total) - Number(detail.delivery_cost || 0)).toLocaleString('fr-DZ')} DA</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--admin-text-muted)' }}>Livraison</span>
                  <span style={{ fontWeight: 500 }}>{Number(detail.delivery_cost || 0).toLocaleString('fr-DZ')} DA</span>
                </div>

                {/* Note du client */}
                {detail.notes && (
                  <div style={{
                    margin: '6px 0 2px',
                    padding: '8px 12px',
                    background: '#fffbeb',
                    border: '1px solid #fde68a',
                    borderRadius: 8,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ fontSize: '0.95rem', flexShrink: 0 }}>💬</span>
                    <div>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 2 }}>Note du client</div>
                      <div style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5 }}>{detail.notes}</div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--admin-border)', paddingTop: 8, marginTop: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>Total commande</span>
                    <span className={`badge ${STATUS_BADGE[detail.status]}`}>{STATUS_LABELS[detail.status]}</span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--admin-gold, #b8860b)' }}>
                    {Number(detail.total).toLocaleString('fr-DZ')} DA
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
               <button className="btn" style={{ background: '#eab308', color: 'white', borderRadius: 20, border: 'none', fontWeight: 600, padding: '8px 20px' }} onClick={() => navigate(`/kh-76/orders/${detail.id}`)}>Voir tout</button>
               <button className="btn" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#3b82f6', color: 'white', border: 'none', borderRadius: 20, fontWeight: 600, padding: '8px 20px' }} onClick={() => handlePrintSingleBordereau(detail.id)}>
                 <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                 Bordereau
               </button>

               {/* Bouton Sync Yalidine — uniquement si barcode existant */}
               {detail.yalidine_tracking && (
                 <button
                   className="btn"
                   style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f59e0b', color: 'white', border: 'none', borderRadius: 20, fontWeight: 600, padding: '8px 18px', opacity: yalidineSyncing ? 0.7 : 1, cursor: yalidineSyncing ? 'not-allowed' : 'pointer' }}
                   onClick={() => handleSyncYalidine(detail.id)}
                   disabled={yalidineSyncing}
                   title="Récupérer le statut Yalidine et mettre à jour la commande"
                 >
                   {yalidineSyncing
                     ? <><div className="spin" style={{ width: 13, height: 13, borderWidth: 2 }} /> Sync...</>
                     : <><RefreshCw size={14}/> Sync Yalidine</>}
                 </button>
               )}

               {/* Barcode + statut ou bouton Expédier */}
               {detail.yalidine_tracking ? (
                 <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                   <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#dcfce7', color: '#15803d', borderRadius: 20, padding: '8px 16px', fontWeight: 600, fontSize: '0.82rem', border: '1px solid #86efac' }}>
                     ✅ {detail.yalidine_tracking}
                   </span>
                   {detail.yalidine_status && (
                     <span style={{ fontSize: '0.72rem', color: '#6b7280', fontStyle: 'italic', paddingRight: 8 }}>
                       {detail.yalidine_status}
                     </span>
                   )}
                 </div>
               ) : (
                 <button
                   className="btn"
                   style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#2563eb', color: 'white', border: 'none', borderRadius: 20, fontWeight: 600, padding: '8px 20px', opacity: yalidineShipping ? 0.7 : 1, cursor: yalidineShipping ? 'not-allowed' : 'pointer' }}
                   onClick={() => handleModalShip(detail.id)}
                   disabled={yalidineShipping}
                 >
                   {yalidineShipping ? (
                     <><div className="spin" style={{ width: 13, height: 13, borderWidth: 2 }} /> Envoi...</>
                   ) : (
                     <>
                       <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                       Expédier
                     </>
                   )}
                 </button>
               )}
               <button className="btn" style={{ background: '#dc3545', color: 'white', borderRadius: 20, border: 'none', fontWeight: 600, padding: '8px 20px' }} onClick={() => setDetail(null)}>Fermer</button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

}

