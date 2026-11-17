import { useState } from 'react'
import Logo from './Logo'

export const navLinks = [
  ['#how', 'How it works'],
  ['#calculator', 'Calculator'],
  ['/suppliers', 'Suppliers'],
  ['#compare', 'How we compare'],
  ['#faq', 'FAQ'],
]

const companyLinks = [
  ['/about-us', 'About us'],
  ['/contact-us', 'Contact us'],
]

export default function Header({ isStandalonePage = false, isSuppliersPage = false }) {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header>
      <div className="wrap nav">
        <Logo href={isStandalonePage ? '/' : '#top'} />
        <nav aria-label="Primary">
          <ul id="primary-navigation" className={mobileMenuOpen ? 'mobile-open' : ''}>
            {navLinks.map(([href, label]) => {
              const destination = isStandalonePage && href.startsWith('#') ? `/${href}` : href
              const isSuppliersLink = href === '/suppliers'
              return (
                <li key={href}>
                  <a
                    href={destination}
                    aria-current={isSuppliersPage && isSuppliersLink ? 'page' : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
            <li className="nav-desktop-company">
              <details className="nav-company">
                <summary>Company</summary>
                <div className="nav-company-menu">
                  {companyLinks.map(([href, label]) => (
                    <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>
                      {label}
                    </a>
                  ))}
                </div>
              </details>
            </li>
            <li className="nav-mobile-company-heading"><span>Company</span></li>
            {companyLinks.map(([href, label]) => (
              <li className="nav-mobile-link" key={`mobile-${href}`}>
                <a href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              </li>
            ))}
            <li className="nav-mobile-account">
              <a
                className="btn btn-primary"
                href={isStandalonePage ? '/#apply' : '#apply'}
                onClick={() => setMobileMenuOpen(false)}
              >
                Open an account
              </a>
            </li>
          </ul>
        </nav>
        <a className="btn btn-primary nav-account" href={isStandalonePage ? '/#apply' : '#apply'}>Open an account</a>
        <button
          className="nav-toggle"
          type="button"
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
