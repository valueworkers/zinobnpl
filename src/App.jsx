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

export default function App() {
  const isSuppliersPage = window.location.pathname.replace(/\/+$/, '') === '/suppliers'

  return (
    <>
      <Header isSuppliersPage={isSuppliersPage} />
      {isSuppliersPage ? (
        <SuppliersPage />
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
      <Footer isSuppliersPage={isSuppliersPage} />
      <ThemeSwitcher />
    </>
  )
}
