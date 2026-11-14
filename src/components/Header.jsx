import Logo from './Logo'

export const navLinks = [
  ['#how', 'How it works'],
  ['#calculator', 'Calculator'],
  ['#compare', 'How we compare'],
  ['#faq', 'FAQ'],
]

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <Logo />
        <nav aria-label="Primary">
          <ul>
            {navLinks.map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
        <a className="btn btn-primary" href="#apply">Open an account</a>
      </div>
    </header>
  )
}
