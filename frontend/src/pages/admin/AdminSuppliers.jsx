import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'
import { Plus, Trash2, Edit, X } from 'lucide-react'

export default function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    is_active: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminClient.get('/admin/suppliers/')
      setSuppliers(res.data.results || res.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des fournisseurs.')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditId(null)
    setForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      is_active: true
    })
    setModal(true)
  }

  const openEdit = (supplier) => {
    setEditId(supplier.id)
    setForm({
      name: supplier.name,
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      is_active: supplier.is_active
    })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        await adminClient.put(`/admin/suppliers/${editId}/`, form)
      } else {
        await adminClient.post('/admin/suppliers/', form)
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
    if (!window.confirm('Voulez-vous vraiment supprimer ce fournisseur ?')) return
    try {
      await adminClient.delete(`/admin/suppliers/${id}/`)
      fetchData()
    } catch (err) {
      alert('Erreur lors de la suppression. Ce fournisseur est peut-être lié à des achats.')
    }
  }

  return (
    <div>
      {!modal && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Fournisseurs</h2>
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={16} /> Ajouter un fournisseur
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
                    <th>Nom</th>
                    <th>Téléphone</th>
                    <th>Email</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td>{s.phone || '-'}</td>
                      <td>{s.email || '-'}</td>
                      <td>
                        <span className={s.is_active ? 'badge-success' : 'badge-error'} style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.8rem' }}>
                          {s.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => openEdit(s)} className="btn-icon" title="Modifier"><Edit size={16} color="var(--color-primary)" /></button>
                          <button onClick={() => handleDelete(s.id)} className="btn-icon" title="Supprimer"><Trash2 size={16} color="var(--color-danger)" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr><td colSpan={5}><div className="admin-empty">Aucun fournisseur.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500, padding: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div className="form-group">
                  <label>Nom du fournisseur *</label>
                  <input className="form-control" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Téléphone</label>
                  <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Adresse</label>
                  <textarea className="form-control" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input type="checkbox" id="isActive" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  <label htmlFor="isActive" style={{ margin: 0, cursor: 'pointer' }}>Fournisseur actif</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: 30 }}>
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
