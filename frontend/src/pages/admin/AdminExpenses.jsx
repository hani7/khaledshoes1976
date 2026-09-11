import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'
import { Plus, Trash2, X } from 'lucide-react'

export default function AdminExpenses() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [modal, setModal] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await adminClient.get('/admin/expenses/')
      setExpenses(res.data.results || res.data)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des charges.')
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setForm({
      title: '',
      amount: '',
      category: 'Salaire',
      date: new Date().toISOString().split('T')[0],
      notes: ''
    })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminClient.post('/admin/expenses/', form)
      setModal(false)
      fetchData()
    } catch (err) {
      alert('Erreur: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette charge ?')) return
    try {
      await adminClient.delete(`/admin/expenses/${id}/`)
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
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Charges & Dépenses</h2>
            <button className="btn-primary" onClick={openAdd}>
              <Plus size={16} /> Ajouter une charge
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
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Montant (DA)</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(e => (
                    <tr key={e.id}>
                      <td>{new Date(e.date).toLocaleDateString('fr-FR')}</td>
                      <td style={{ fontWeight: 600 }}>{e.title}</td>
                      <td>{e.category}</td>
                      <td style={{ color: 'var(--admin-rose)', fontWeight: 600 }}>{Number(e.amount).toLocaleString('fr-DZ')}</td>
                      <td>{e.notes || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn-action-icon" onClick={() => handleDelete(e.id)} title="Supprimer" style={{ background: '#de0411' }}>
                            <Trash2 size={16} color="white" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {expenses.length === 0 && (
                    <tr><td colSpan={6}><div className="admin-empty">Aucune dépense enregistrée.</div></td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {modal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Enregistrer une dépense</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: '15px' }}>
                <div className="form-group">
                  <label>Titre / Description courte *</label>
                  <input className="form-control" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Catégorie *</label>
                  <input className="form-control" required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: Salaire, Loyer, Électricité..." list="expense-categories" />
                  <datalist id="expense-categories">
                    <option value="Salaire" />
                    <option value="Loyer" />
                    <option value="Électricité" />
                    <option value="Internet" />
                    <option value="Marketing" />
                    <option value="Autre" />
                  </datalist>
                </div>

                <div className="form-group">
                  <label>Montant (DA) *</label>
                  <input className="form-control" type="number" step="0.01" required min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Date *</label>
                  <input className="form-control" type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Notes détaillées</label>
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
