import Logo from './Logo'
import { navLinks } from './Header'

const infoLinks = [
  ['/privacy-policy', 'Privacy Policy'],
  ['/terms-and-conditions', 'Terms & Conditions'],
  ['/shipping-policy', 'Shipping Policy'],
  ['/refund-policy', 'Refund Policy'],
]

const footerGroups = [
  { title: 'Explore', links: navLinks },
  { title: 'Policies', links: infoLinks },
  {
    title: 'Company',
    links: [
      ['/about-us', 'About us'],
      ['/contact-us', 'Contact us'],
    ],
  },
  { title: 'Get started', links: [['#apply', 'Open an account']] },
]

export default function Footer({ isStandalonePage = false }) {
  return (
    <footer className="wrap">
      <div className="footer-main">
        <div className="footer-brand">
          <Logo href={isStandalonePage ? '/' : '#top'} />
          <p>Wholesale sourcing and payment options for businesses worldwide.</p>
        </div>
        <div className="footer-groups">
          {footerGroups.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2>{group.title}</h2>
              <ul>
                {group.links.map(([href, label]) => {
                  const destination = isStandalonePage && href.startsWith('#') ? `/${href}` : href
                  return <li key={href}><a href={destination}>{label}</a></li>
                })}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p className="legal">
          Trade credit is subject to approval and website estimates are illustrative.
          Import requirements, duties and taxes vary by product and destination.
        </p>
        <p className="footer-copyright">© 2026 ZinoBNPL · zinobnpl.com</p>
      </div>
    </footer>
  )
}
