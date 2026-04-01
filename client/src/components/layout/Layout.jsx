import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from '../ui/CartDrawer'
import PageTransition from '../ui/PageTransition'
import ScrollToTop from '../ui/ScrollToTop'

const Layout = () => {
  return (
    <div className="min-h-screen bg-primary flex flex-col">
      <ScrollToTop />
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <Footer />
    </div>
  )
}

export default Layout