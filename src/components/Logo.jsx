import logo from '../assets/logo.png'

export default function Logo({ href = '#top' }) {
  return (
    <a className="logo" href={href} aria-label="ZinoBNPL home">
      <img alt="ZinoBNPL Global Trade Partners" src={logo} />
    </a>
  )
}
