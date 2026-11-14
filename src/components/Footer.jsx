import Logo from './Logo'
import { navLinks } from './Header'

export default function Footer({ isSuppliersPage = false }) {
  return (
    <footer className="wrap">
      <div className="foot-top">
        <Logo href={isSuppliersPage ? '/' : '#top'} />
        <ul>
          {[...navLinks, ['#apply', 'Open an account']].map(([href, label]) => {
            const destination = isSuppliersPage && href.startsWith('#') ? `/${href}` : href
            return <li key={href}><a href={destination}>{label}</a></li>
          })}
        </ul>
      </div>
      <p className="legal">ZinoBNPL is a wholesale trade platform for business buyers. Trade credit is subject to approval and estimates on this page are illustrative. Imports into India must meet customs, BIS and other regulatory requirements. © 2026 ZinoBNPL, zinobnpl.com</p>
    </footer>
  )
}
