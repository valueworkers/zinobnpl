import { useState } from 'react'

const docs = [
  ['Business registration', 'Proof that your business is legally registered'],
  ['Tax registration', 'The applicable tax ID for your country'],
  ['Import/export authorisation', 'If required for your business or products'],
  ['Industry or SME certification', 'If applicable in your country'],
]

const lines = ['Up to USD 10,000', 'USD 10,000–25,000', 'USD 25,000–100,000', 'Above USD 100,000']

export default function Apply() {
  const [form, setForm] = useState({ biz: '', person: '', phone: '', country: '', registration: '', line: lines[0] })
  const [status, setStatus] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.biz.trim() || !form.phone.trim()) {
      setStatus('Add your business name and phone number so we can reach you.')
      return
    }
    setStatus('Application form preview: this form is not connected to an inbox yet, so nothing has been sent.')
  }

  return (
    <div className="band" id="apply">
      <section className="wrap">
        <div className="apply">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 style={{ marginTop: '1rem' }}>Get approved, then stock up.</h2>
            <p style={{ color: 'var(--band-muted)', marginTop: '1rem', fontSize: '1.1rem' }}>Apply for a trade credit line and buy from verified Chinese suppliers, with terms tailored to your approved account.</p>
            <ul className="docs">
              {docs.map(([title, sub]) => (
                <li key={title}><div><strong>{title}</strong><small>{sub}</small></div></li>
              ))}
            </ul>
          </div>
          <form className="panel form" noValidate onSubmit={submit}>
            <div className="f">
              <label htmlFor="biz">Business name</label>
              <input id="biz" autoComplete="organization" placeholder="e.g. Northstar Trading" value={form.biz} onChange={set('biz')} />
            </div>
            <div className="two">
              <div className="f">
                <label htmlFor="person">Your name</label>
                <input id="person" autoComplete="name" value={form.person} onChange={set('person')} />
              </div>
              <div className="f">
                <label htmlFor="phone">Phone (WhatsApp)</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="Include country code" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="two">
              <div className="f">
                <label htmlFor="country">Country of registration</label>
                <input id="country" autoComplete="country-name" placeholder="e.g. Singapore" value={form.country} onChange={set('country')} />
              </div>
              <div className="f">
                <label htmlFor="registration">Business / tax registration ID</label>
                <input id="registration" autoCapitalize="characters" placeholder="Your local registration ID" value={form.registration} onChange={set('registration')} />
              </div>
            </div>
            <div className="f">
              <label htmlFor="line">Credit line needed (USD)</label>
              <select id="line" value={form.line} onChange={set('line')}>
                {lines.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Open an account</button>
            <p className="status" role="status" hidden={!status}>{status}</p>
          </form>
        </div>
      </section>
    </div>
  )
}
