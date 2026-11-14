import Logo from './Logo'

export const navLinks = [
  ['#how', 'How it works'],
  ['#calculator', 'Calculator'],
  ['/suppliers', 'Suppliers'],
  ['#compare', 'How we compare'],
  ['#faq', 'FAQ'],
]

export default function Header({ isSuppliersPage = false }) {
  return (
    <header>
      <div className="wrap nav">
        <Logo href={isSuppliersPage ? '/' : '#top'} />
        <nav aria-label="Primary">
          <ul>
            {navLinks.map(([href, label]) => {
              const destination = isSuppliersPage && href.startsWith('#') ? `/${href}` : href
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
          </ul>
        </nav>
        <a className="btn btn-primary" href={isSuppliersPage ? '/#apply' : '#apply'}>Open an account</a>
      </div>
    </header>
  )
}
