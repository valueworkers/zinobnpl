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

  return (
    <header>
      <div className="wrap nav">
        <Logo href={isStandalonePage ? '/' : '#top'} />
        <nav aria-label="Primary">
          <ul>
            {navLinks.map(([href, label]) => {
              const destination = isStandalonePage && href.startsWith('#') ? `/${href}` : href
              const isSuppliersLink = href === '/suppliers'
              return (
                <li key={href}>
                  <a
                    href={destination}
                    aria-current={isSuppliersPage && isSuppliersLink ? 'page' : undefined}
                  >
                    {label}
                  </a>
                </li>
              )
            })}
            <li>
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
          </ul>
        </nav>
        <a className="btn btn-primary" href={isStandalonePage ? '/#apply' : '#apply'}>Open an account</a>
      </div>
    </header>
  )
}
