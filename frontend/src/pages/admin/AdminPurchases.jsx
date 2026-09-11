import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'
import { Plus, Edit, Trash2, X, Save } from 'lucide-react'

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [products, setProducts] = useState([])
  const [productSearch, setProductSearch] = useState('')
  const [productDropdownOpen, setProductDropdownOpen] = useState(false)
  const [variants, setVariants] = useState([])
  const [boutiques, setBoutiques] = useState([])
  
  const [suppliers, setSuppliers] = useState([])
  const [supplierSearch, setSupplierSearch] = useState('')
  const [supplierDropdownOpen, setSupplierDropdownOpen] = useState(false)
  
  const [form, setForm] = useState({
    product: '',
    variant: '',
    boutique: '',
    quantity: 1,
    unit_price: '',
    total_price: '',
    supplier: '',
    invoice_number: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && modal) setModal(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modal])
  const fetchData = async () => {
    setLoading(true)
    try {
      const [pRes, prodRes, boutRes, suppRes] = await Promise.all([
        adminClient.get('/admin/purchases/'),
        adminClient.get('/admin/products/?page_size=5000'),
        adminClient.get('/admin/boutiques/'),
        adminClient.get('/admin/suppliers/?page_size=5000')
      ])
      setPurchases(pRes.data.results || pRes.data)
      setProducts(prodRes.data.results || prodRes.data)
      setBoutiques(boutRes.data.results || boutRes.data)
      setSuppliers(suppRes.data.results || suppRes.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des achats.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductChange = async (productId) => {
    setForm(f => ({ ...f, product: productId, variant: '' }))
    if (!productId) {
      setVariants([])
      return
    }
    try {
      const res = await adminClient.get(`/admin/variants/?product=${productId}`)
      setVariants(res.data.results || res.data)
    } catch (e) {
      console.error(e)
    }
  }

  const openAdd = () => {
    setEditId(null)
    setForm({
      product: '',
      variant: '',
      boutique: boutiques[0]?.id || '',
      quantity: 1,
      unit_price: '',
      total_price: '',
      supplier: '',
      invoice_number: '',
      notes: ''
    })
    setVariants([])
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.variant) payload.variant = null
      
      if (editId) {
        await adminClient.patch(`/admin/purchases/${editId}/`, payload)
      } else {
        await adminClient.post('/admin/purchases/', payload)
      }
      setModal(false)
      fetchData()
    } catch (err) {
      alert('Erreur: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet achat ?')) return
    try {
      await adminClient.delete(`/admin/purchases/${id}/`)
      fetchData()
    } catch (err) {
      alert('Erreur lors de la suppression.')
    }
  }

  return (
    <div>
      {!modal && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Achats & Entrées de Stock</h2>
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={16} /> Ajouter un achat
            </button>
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
                    <th>Boutique</th>
                    <th>Quantité</th>
                    <th>Prix U. (DA)</th>
                    <th>Total (DA)</th>
                    <th>Fournisseur</th>
                    <th>N° Facture</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {purchases.map(p => (
                    <tr key={p.id}>
                      <td>{new Date(p.date).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{p.product_name}</div>
                        {p.variant && <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Variante ID: {p.variant}</div>}
                      </td>
                      <td>{p.boutique_name}</td>
                      <td style={{ fontWeight: 600 }}>{p.quantity}</td>
                      <td>{Number(p.unit_price).toLocaleString('fr-DZ')}</td>
                      <td>{Number(p.total_price || (p.unit_price * p.quantity)).toLocaleString('fr-DZ')}</td>
                      <td>{p.supplier || '—'}</td>
                      <td>{p.invoice_number || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-action-icon" onClick={() => handleDelete(p.id)} title="Supprimer" style={{ background: '#de0411' }}>
                            <Trash2 size={16} color="white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {purchases.length === 0 && (
                    <tr><td colSpan={9}><div className="admin-empty">Aucun achat enregistré.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 600, padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Enregistrer un achat</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Boutique / Magasin *</label>
                  <select className="form-control" required value={form.boutique} onChange={e => setForm({ ...form, boutique: e.target.value })}>
                    <option value="">Sélectionner un magasin...</option>
                    {boutiques.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2', position: 'relative' }}>
                  <label>Produit *</label>
                  <div 
                    className="form-control" 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--admin-surface)', minHeight: '42px' }}
                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                  >
                    {form.product ? (
                      (() => {
                        const p = products.find(prod => prod.id.toString() === form.product.toString());
                        return p ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {p.thumbnail ? (
                              <img src={p.thumbnail.replace('http://localhost:8000', '')} style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4 }} alt="" />
                            ) : (
                              <div style={{ width: 24, height: 24, background: 'var(--admin-border)', borderRadius: 4 }} />
                            )}
                            <span style={{ fontWeight: 500 }}>{p.name}</span>
                          </div>
                        ) : 'Sélectionner un produit...'
                      })()
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>Sélectionner un produit...</span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>▼</span>
                  </div>

                  {productDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '8px', zIndex: 100, marginTop: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxHeight: '320px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ padding: '10px', borderBottom: '1px solid var(--admin-surface2)', background: 'var(--admin-surface)' }}>
                        <input 
                          type="text" 
                          autoFocus
                          placeholder="Rechercher un produit (nom ou code)..." 
                          className="form-control" 
                          style={{ width: '100%' }}
                          value={productSearch} 
                          onChange={e => setProductSearch(e.target.value)} 
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <div style={{ overflowY: 'auto', flex: 1 }}>
                        {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toString().includes(productSearch)).map(p => (
                          <div 
                            key={p.id} 
                            style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--admin-surface2)', transition: 'background 0.2s' }}
                            onClick={() => {
                              handleProductChange(p.id.toString());
                              setProductDropdownOpen(false);
                              setProductSearch('');
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--admin-surface2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            {p.thumbnail ? (
                              <img src={p.thumbnail.replace('http://localhost:8000', '')} style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 4 }} alt="" />
                            ) : (
                              <div style={{ width: 36, height: 36, background: 'var(--admin-border)', borderRadius: 4 }} />
                            )}
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</div>
                              <div style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>Code: {p.id}</div>
                            </div>
                          </div>
                        ))}
                        {products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.id.toString().includes(productSearch)).length === 0 && (
                          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--admin-text-muted)' }}>Aucun produit trouvé.</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {variants.length > 0 && (
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Variante (Optionnel)</label>
                    <select className="form-control" value={form.variant} onChange={e => setForm({ ...form, variant: e.target.value })}>
                      <option value="">Aucune (Produit global)</option>
                      {variants.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Quantité *</label>
                  <input className="form-control" type="number" required min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value, total_price: (form.unit_price * e.target.value).toFixed(2) })} />
                </div>

                <div className="form-group">
                  <label>Prix unitaire (DA) *</label>
                  <input className="form-control" type="number" step="0.01" required min="0" value={form.unit_price} onChange={e => setForm({ ...form, unit_price: e.target.value, total_price: (e.target.value * form.quantity).toFixed(2) })} />
                </div>

                <div className="form-group">
                  <label>Prix total (DA)</label>
                  <input className="form-control" type="number" step="0.01" value={form.total_price} onChange={e => setForm({ ...form, total_price: e.target.value })} />
                </div>

                <div className="form-group" style={{ position: 'relative' }}>
                  <label>Fournisseur</label>
                  <div 
                    className="form-control" 
                    style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--admin-surface)', minHeight: '42px' }}
                    onClick={() => setSupplierDropdownOpen(!supplierDropdownOpen)}
                  >
                    {form.supplier ? (
                      (() => {
                        const s = suppliers.find(sup => sup.id.toString() === form.supplier.toString());
                        return s ? s.name : form.supplier
                      })()
                    ) : (
                      <span style={{ color: 'var(--admin-text-muted)' }}>Sélectionner...</span>
                    )}
                    <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-muted)' }}>▼</span>
                  </div>

                  {supplierDropdownOpen && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--admin-surface)', border: '1px solid var(--admin-border)', borderRadius: '8px', zIndex: 100, marginTop: '4px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxHeight: '250px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ padding: '10px', borderBottom: '1px solid var(--admin-surface2)', background: 'var(--admin-surface)' }}>
                        <input 
                          type="text" 
                          autoFocus
                          placeholder="Rechercher un fournisseur..." 
                          className="form-control" 
                          style={{ width: '100%' }}
                          value={supplierSearch} 
                          onChange={e => setSupplierSearch(e.target.value)} 
                          onClick={e => e.stopPropagation()}
                        />
                      </div>
                      <div style={{ overflowY: 'auto', flex: 1 }}>
                        <div 
                          style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid var(--admin-surface2)', color: 'var(--admin-text-muted)' }}
                          onClick={() => { setForm({ ...form, supplier: '' }); setSupplierDropdownOpen(false); }}
                        >
                          Aucun (Effacer)
                        </div>
                        {suppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase())).map(s => (
                          <div 
                            key={s.id} 
                            style={{ padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid var(--admin-surface2)', transition: 'background 0.2s' }}
                            onClick={() => {
                              setForm({ ...form, supplier: s.id.toString() });
                              setSupplierDropdownOpen(false);
                              setSupplierSearch('');
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'var(--admin-surface2)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{s.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>N° de Facture</label>
                  <input className="form-control" value={form.invoice_number} onChange={e => setForm({ ...form, invoice_number: e.target.value })} />
                </div>
                
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Notes / Remarques</label>
                  <textarea className="form-control" rows="3" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
                <button type="button" className="btn-secondary" onClick={() => setModal(false)}>Annuler</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
