import { useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Welcome from './components/Welcome'
import Why from './components/Why'
import Steps from './components/Steps'
import Calculator from './components/Calculator'
import Compare from './components/Compare'
import Categories from './components/Categories'
import Apply from './components/Apply'
import Faq from './components/Faq'
import Closing from './components/Closing'
import Footer from './components/Footer'
import ThemeSwitcher from './components/ThemeSwitcher'
import SuppliersPage from './pages/SuppliersPage'
import InfoPage, { infoPages } from './pages/InfoPage'
import SupplierRecommendationPage from './pages/SupplierRecommendationPage'

export default function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const isSuppliersPage = pathname === '/suppliers'
  const isSupplierRecommendationPage = pathname === '/recommend-supplier'
  const infoPage = infoPages[pathname]
  const isStandalonePage = isSuppliersPage || isSupplierRecommendationPage || Boolean(infoPage)

  useEffect(() => {
    const targetId = window.location.hash.slice(1)
    if (targetId) document.getElementById(targetId)?.scrollIntoView()
  }, [pathname])

  return (
    <>
      <Header isStandalonePage={isStandalonePage} isSuppliersPage={isSuppliersPage} />
      {isSuppliersPage ? (
        <SuppliersPage />
      ) : isSupplierRecommendationPage ? (
        <SupplierRecommendationPage />
      ) : infoPage ? (
        <InfoPage page={infoPage} />
      ) : (
        <main id="top">
          <Hero />
          <Welcome />
          <Why />
          <Steps />
          <Calculator />
          <Compare />
          <Categories />
          <Apply />
          <Faq />
          <Closing />
        </main>
      )}
      <Footer isStandalonePage={isStandalonePage} />
      <ThemeSwitcher />
    </>
  )
}
