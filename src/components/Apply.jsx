import { useState } from 'react'

const docs = [
  ['GST registration', 'For your registered business'],
  ['Business PAN', 'Company, firm or proprietor'],
  ['Importer-Exporter Code (IEC)', 'Required to import into India'],
  ['Udyam registration', 'If you are registered as an MSME'],
]

const lines = ['Up to ₹10 lakh', '₹10 to ₹25 lakh', '₹25 lakh to ₹1 crore', 'Above ₹1 crore']

export default function Apply() {
  const [form, setForm] = useState({ biz: '', person: '', phone: '', gst: '', line: lines[0] })
  const [status, setStatus] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (!form.biz.trim() || !form.phone.trim()) {
      setStatus('Add your business name and mobile number so we can reach you.')
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
            <p style={{ color: 'var(--band-muted)', marginTop: '1rem', fontSize: '1.1rem' }}>Apply for your trade credit line and buy from verified Chinese suppliers on supply terms made for Indian businesses.</p>
            <ul className="docs">
              {docs.map(([title, sub]) => (
                <li key={title}><div><strong>{title}</strong><small>{sub}</small></div></li>
              ))}
            </ul>
          </div>
          <form className="panel form" noValidate onSubmit={submit}>
            <div className="f">
              <label htmlFor="biz">Business name</label>
              <input id="biz" autoComplete="organization" placeholder="e.g. Shree Ganesh Traders" value={form.biz} onChange={set('biz')} />
            </div>
            <div className="two">
              <div className="f">
                <label htmlFor="person">Your name</label>
                <input id="person" autoComplete="name" value={form.person} onChange={set('person')} />
              </div>
              <div className="f">
                <label htmlFor="phone">Mobile (WhatsApp)</label>
                <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div className="two">
              <div className="f">
                <label htmlFor="gst">GSTIN</label>
                <input id="gst" maxLength={15} autoCapitalize="characters" placeholder="15 characters" value={form.gst} onChange={set('gst')} />
              </div>
              <div className="f">
                <label htmlFor="line">Credit line needed</label>
                <select id="line" value={form.line} onChange={set('line')}>
                  {lines.map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Open an account</button>
            <p className="status" role="status" hidden={!status}>{status}</p>
          </form>
        </div>
      </section>
    </div>
  )
}
