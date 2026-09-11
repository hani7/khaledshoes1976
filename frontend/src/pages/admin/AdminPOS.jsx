import { useState, useEffect } from 'react'
import adminClient from '../../api/adminClient'
import './admin.css'
import { Search, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react'

export default function AdminPOS() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [boutiques, setBoutiques] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBoutique, setSelectedBoutique] = useState('')
  
  const [cart, setCart] = useState([])
  const [discountInput, setDiscountInput] = useState('')
  const [discountAmount, setDiscountAmount] = useState(0)
  
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, boutRes, catRes] = await Promise.all([
        adminClient.get('/admin/products/?is_active=true&page_size=5000'), // Load all for local search/filter
        adminClient.get('/admin/boutiques/'),
        adminClient.get('/admin/categories/?page_size=500')
      ])
      // Handle pagination or straight array
      setProducts(prodRes.data.results || prodRes.data)
      const bouts = boutRes.data.results || boutRes.data
      setBoutiques(bouts)
      setCategories(catRes.data.results || catRes.data)
      if (bouts.length > 0) setSelectedBoutique(bouts[0].id)
      setError(null)
    } catch (err) {
      setError('Erreur lors du chargement des données POS.')
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => {
    // 1. Filter by category
    if (selectedCategory) {
      const catMatches = p.categories?.some(c => c.id.toString() === selectedCategory) || (p.category_ids && p.category_ids.includes(Number(selectedCategory)))
      if (!catMatches) return false
    }
    // 2. Filter by search term
    const term = search.toLowerCase().trim()
    if (!term) return true
    return p.name.toLowerCase().includes(term) || p.id.toString() === term || p.id.toString().includes(term)
  })

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product_id === product.id)
      if (existing) {
        return prev.map(item => item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { 
        product_id: product.id, 
        name: product.name, 
        price: product.promo_price || product.price,
        quantity: 1,
        image: product.thumbnail || product.images?.[0]?.image || null
      }]
    })
  }

  const updateQuantity = (productId, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product_id === productId) {
          const newQ = item.quantity + delta
          return newQ > 0 ? { ...item, quantity: newQ } : item
        }
        return item
      })
    })
  }

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product_id !== productId))
  }

  const cartTotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0)
  const finalTotal = Math.max(0, cartTotal - discountAmount)

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Le panier est vide')
    if (!selectedBoutique) return alert('Veuillez sélectionner un magasin')
    
    setProcessing(true)
    try {
      const payload = {
        guest_name: 'Client Comptoir',
        guest_phone: '0000000000',
        discount_amount: discountAmount,
        wilaya: 'Alger',
        shipping_address: 'Achat en magasin',
        payment_method: 'cash',
        delivery_type: 'home',
        status: 'fulfilled', // Livré et payé instantanément
        source: 'pos',
        boutique_id: selectedBoutique, // To pass the boutique ID explicitly
        items: cart.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          variant_id: null // Simplified for now
        }))
      }

      await adminClient.post('/orders/', payload)
      // Note: Ideally, you'd have an endpoint to directly associate this order with a specific boutique and deduct stock specifically from there. 
      // Our OrderCreateAPIView automatically deducts from the boutique with the largest stock, but for POS, it should be the selected boutique.
      // Assuming OrderCreateAPIView handles it via order creation, or you modify backend to accept 'fulfilled_by_id'. Let's pass it in payload if supported.
      
      alert('Vente enregistrée avec succès !')
      setCart([])
      setDiscountInput('')
      setDiscountAmount(0)
    } catch (err) {
      alert('Erreur: ' + JSON.stringify(err.response?.data || err.message))
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', gap: '24px', overflow: 'hidden' }}>
      
      {/* Left side: Products List */}
      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>Caisse Enregistreuse (POS)</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <select className="form-control" style={{ width: '200px' }} value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
              <option value="">Toutes les catégories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="admin-search" style={{ margin: 0, width: '300px' }}>
              <Search size={16} />
              <input placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><div className="spin" /><span>Chargement...</span></div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : (
          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '10px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '15px' }}>
              {filteredProducts.map(p => (
                <div 
                  key={p.id} 
                  className="admin-card" 
                  style={{ padding: '15px', cursor: 'pointer', transition: 'all 0.2s', border: '2px solid transparent' }}
                  onClick={() => addToCart(p)}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <div style={{ height: '120px', background: 'var(--admin-surface2)', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {p.thumbnail || (p.images && p.images[0]) ? (
                      <img src={(p.thumbnail || p.images[0].image).replace('http://localhost:8000', '')} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <ShoppingCart size={32} color="var(--admin-text-muted)" />
                    )}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</div>
                  <div style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{Number(p.promo_price || p.price).toLocaleString('fr-DZ')} DA</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right side: Cart & Checkout */}
      <div className="admin-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0 0 20px 0', borderBottom: '1px solid var(--admin-border)', paddingBottom: '15px' }}>Panier de Vente</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: 'var(--admin-text-muted)', marginBottom: '6px' }}>Magasin de vente *</label>
          <select className="form-control" value={selectedBoutique} onChange={e => setSelectedBoutique(e.target.value)}>
            {boutiques.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', marginTop: '40px' }}>
              <ShoppingCart size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p>Le panier est vide</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {cart.map(item => (
                <div key={item.product_id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '15px', borderBottom: '1px solid var(--admin-surface2)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ color: 'var(--color-primary)', fontSize: '0.85rem', fontWeight: 600 }}>{Number(item.price).toLocaleString('fr-DZ')} DA</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--admin-surface2)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.product_id, -1)} style={{ padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer' }}><Minus size={14} /></button>
                      <span style={{ fontWeight: 600, width: '30px', textAlign: 'center' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product_id, 1)} style={{ padding: '6px 10px', background: 'none', border: 'none', cursor: 'pointer' }}><Plus size={14} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.product_id)} style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--admin-danger)' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ borderTop: '2px dashed var(--admin-border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input className="form-control" type="number" placeholder="Réduction (DA)" value={discountInput} onChange={e => setDiscountInput(e.target.value)} />
            <button className="btn-primary" style={{ padding: '8px 16px' }} onClick={() => setDiscountAmount(Number(discountInput) || 0)}>Valider</button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontSize: '1rem', color: 'var(--admin-text-muted)' }}>Sous-total</span>
            <span style={{ fontSize: '1rem', fontWeight: 600 }}>{cartTotal.toLocaleString('fr-DZ')} DA</span>
          </div>
          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '1rem', color: 'var(--admin-danger)' }}>Réduction</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--admin-danger)' }}>- {discountAmount.toLocaleString('fr-DZ')} DA</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', marginTop: '10px', borderTop: '1px solid var(--admin-border)', paddingTop: '10px' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 600 }}>Total à payer</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--admin-success)' }}>{finalTotal.toLocaleString('fr-DZ')} DA</span>
          </div>

          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', justifyContent: 'center', background: cart.length > 0 ? 'var(--admin-success)' : 'var(--admin-border)', borderColor: cart.length > 0 ? 'var(--admin-success)' : 'var(--admin-border)' }}
            disabled={cart.length === 0 || processing}
            onClick={handleCheckout}
          >
            {processing ? 'Enregistrement...' : 'Encaisser la vente'}
          </button>
        </div>
      </div>
    </div>
  )
}
