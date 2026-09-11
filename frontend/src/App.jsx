import { useState, useEffect, Suspense, lazy } from 'react'
import { Routes, Route, Navigate, useParams, useLocation } from 'react-router-dom'
import client from './api/client'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MobileBottomNav from './components/MobileBottomNav'
import PromoBanner from './components/PromoBanner'
import PromoPopup from './components/PromoPopup'
import SideBanners from './components/SideBanners'
import { useAuthStore } from './store/authStore'

// Pages - lazy loaded
const HomePage = lazy(() => import('./pages/HomePage'))
const ShopPage = lazy(() => import('./pages/ShopPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmedPage = lazy(() => import('./pages/OrderConfirmedPage'))
const AccountPage = lazy(() => import('./pages/AccountPage'))
const AccountLayout = lazy(() => import('./pages/AccountLayout'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const AddressesPage = lazy(() => import('./pages/AddressesPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const LoyaltyPage = lazy(() => import('./pages/LoyaltyPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'))
const PaymentResultPage = lazy(() => import('./pages/PaymentResultPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const ShippingPage = lazy(() => import('./pages/ShippingPage'))
const FaqPage = lazy(() => import('./pages/FaqPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const TrackPage = lazy(() => import('./pages/TrackPage'))
const SizeGuidePage = lazy(() => import('./pages/SizeGuidePage'))
const FidelitePage = lazy(() => import('./pages/FidelitePage'))
const BoutiquesPage = lazy(() => import('./pages/BoutiquesPage'))
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'))

// Admin
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'))
const AdminBrands = lazy(() => import('./pages/admin/AdminBrands'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminOrderHistory = lazy(() => import('./pages/admin/AdminOrderHistory'))
const AdminOrderCreate = lazy(() => import('./pages/admin/AdminOrderCreate'))
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'))
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'))
const AdminDeliveryCompanies = lazy(() => import('./pages/admin/AdminDeliveryCompanies'))
const AdminDeliveryRates = lazy(() => import('./pages/admin/AdminDeliveryRates'))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'))
const AdminBlacklist = lazy(() => import('./pages/admin/AdminBlacklist'))
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter'))
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'))
const AdminReports = lazy(() => import('./pages/admin/AdminReports'))
const AdminUserHistory = lazy(() => import('./pages/admin/AdminUserHistory'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminMediatheque = lazy(() => import('./pages/admin/AdminMediatheque'))
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile'))
const AdminBoutiques = lazy(() => import('./pages/admin/AdminBoutiques'))
const AdminPurchases = lazy(() => import('./pages/admin/AdminPurchases'))
const AdminExpenses = lazy(() => import('./pages/admin/AdminExpenses'))
const AdminStockLedger = lazy(() => import('./pages/admin/AdminStockLedger'))
const AdminProfitReport = lazy(() => import('./pages/admin/AdminProfitReport'))
const AdminPOS = lazy(() => import('./pages/admin/AdminPOS'))
const AdminSuppliers = lazy(() => import('./pages/admin/AdminSuppliers'))
const AdminPOSSales = lazy(() => import('./pages/admin/AdminPOSSales'))

// Boutique
const BoutiqueLogin = lazy(() => import('./pages/boutique/BoutiqueLogin'))
const BoutiqueLayout = lazy(() => import('./pages/boutique/BoutiqueLayout'))
const BoutiqueDashboard = lazy(() => import('./pages/boutique/BoutiqueDashboard'))
const BoutiqueOrders = lazy(() => import('./pages/boutique/BoutiqueOrders'))

// Redirect /category/:slug â†’ /:slug (backwards compatibility)
function CategoryRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/${slug}`} replace />
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/kh-secure-2026')
  const user = useAuthStore(s => s.user)

  const [settings, setSettings] = useState(null)
  const [loadingSettings, setLoadingSettings] = useState(true)

  useEffect(() => {
    client.get('/settings/')
      .then(res => setSettings(res.data))
      .catch(console.error)
      .finally(() => setLoadingSettings(false))
  }, [])

  // Inject Meta Pixel dynamically
  useEffect(() => {
    if (!settings?.meta_pixel_id) return
    if (document.getElementById('meta-pixel-script')) return
    const pixelId = settings.meta_pixel_id
    const script = document.createElement('script')
    script.id = 'meta-pixel-script'
    script.innerHTML = `
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init','${pixelId}');fbq('track','PageView');
    `
    document.head.appendChild(script)
    const noscript = document.createElement('noscript')
    noscript.innerHTML = `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"/>`
    document.head.appendChild(noscript)
  }, [settings?.meta_pixel_id])

  // Inject TikTok Pixel dynamically
  useEffect(() => {
    if (!settings?.tiktok_pixel_id) return
    if (document.getElementById('tiktok-pixel-script')) return
    const pixelId = settings.tiktok_pixel_id
    const script = document.createElement('script')
    script.id = 'tiktok-pixel-script'
    script.innerHTML = `
      !function (w, d, t) {
        w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};
        ttq.load('${pixelId}');
        ttq.page();
      }(window, document, 'ttq');
    `
    document.head.appendChild(script)
  }, [settings?.tiktok_pixel_id])

  // Source detection
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    let source = null
    if (params.has('fbclid')) source = 'fb'
    else if (params.has('igshid')) source = 'ig'
    else if (params.has('ttclid')) source = 'tiktok'
    else if (params.get('utm_source')) source = params.get('utm_source')
    else if (document.referrer) {
      if (document.referrer.includes('facebook.com')) source = 'fb'
      else if (document.referrer.includes('instagram.com')) source = 'ig'
      else if (document.referrer.includes('tiktok.com')) source = 'tiktok'
    }
    if (source) {
      localStorage.setItem('piove_source', source)
    }
  }, [pathname])

  if (loadingSettings && !isAdmin) {
    return <div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}><div className="spin" /></div>
  }

  if (settings?.is_maintenance_mode && !isAdmin) {
    return <MaintenancePage message={settings?.maintenance_message} />
  }

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <PromoBanner />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <SideBanners />}
      <Suspense fallback={<div style={{height:'100vh',display:'flex',alignItems:'center',justifyContent:'center'}}>Chargement...</div>}>
        <Routes>
          {/* Public store */}
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/produit/:slug" element={<ProductPage />} />
          <Route path="/category/:slug" element={<CategoryRedirect />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
          <Route path="/compte" element={<AccountPage />} />
          <Route element={<AccountLayout />}>
            <Route path="/compte/commandes" element={<OrdersPage />} />
            <Route path="/compte/adresses" element={<AddressesPage />} />
            <Route path="/compte/fidelite" element={<LoyaltyPage />} />
            <Route path="/compte/favoris" element={<WishlistPage />} />
            <Route path="/compte/parametres" element={<SettingsPage />} />
          </Route>
          <Route path="/payment-result" element={<PaymentResultPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/livraison" element={<ShippingPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/confidentialite" element={<PrivacyPage />} />
          <Route path="/conditions" element={<TermsPage />} />
          <Route path="/suivi" element={<TrackPage />} />
          <Route path="/size-guide" element={<SizeGuidePage />} />
          <Route path="/fidelite" element={<FidelitePage />} />
          <Route path="/boutiques" element={<BoutiquesPage />} />
          <Route path="/returns" element={<ReturnsPage />} />

          {/* Boutique */}
          <Route path="/boutique/login" element={<BoutiqueLogin />} />
          <Route path="/boutique" element={<BoutiqueLayout />}>
            <Route index element={<BoutiqueOrders />} />
          </Route>

          {/* Admin */}
          <Route path="/kh-secure-2026/login" element={<AdminLogin />} />
          <Route path="/kh-secure-2026" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="pos-sales" element={<AdminPOSSales />} />
            <Route path="orders-history" element={<AdminOrderHistory />} />
            <Route path="orders/new" element={<AdminOrderCreate />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="delivery-companies" element={<AdminDeliveryCompanies />} />
            <Route path="delivery-rates" element={<AdminDeliveryRates />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="blacklist" element={<AdminBlacklist />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="history" element={<AdminUserHistory />} />
            <Route path="mediatheque" element={<AdminMediatheque />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="boutiques" element={<AdminBoutiques />} />
            <Route path="pos" element={<AdminPOS />} />
            <Route path="purchases" element={<AdminPurchases />} />
            <Route path="suppliers" element={<AdminSuppliers />} />
            <Route path="expenses" element={<AdminExpenses />} />
            <Route path="stock-ledger" element={<AdminStockLedger />} />
            <Route path="reports/profit" element={<AdminProfitReport />} />
          </Route>

          {/* Catch-all â†’ category page */}
          <Route path="/:slug" element={<CategoryPage />} />
        </Routes>
      </Suspense>
      {!isAdmin && <MobileBottomNav />}
      {!isAdmin && <Footer />}
      {!isAdmin && pathname === '/' && <PromoPopup />}
    </>
  )
}

