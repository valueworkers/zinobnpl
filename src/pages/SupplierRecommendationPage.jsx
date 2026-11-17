import { useEffect, useState } from 'react'

const requestFromUrl = () => (
  new URLSearchParams(window.location.search).get('request') === 'onboarding'
    ? 'onboarding'
    : 'recommendation'
)

const requestLabels = {
  recommendation: 'Recommend an existing supplier',
  onboarding: 'Onboard my business as a supplier',
}

export default function SupplierRecommendationPage() {
  const [form, setForm] = useState({
    request: requestFromUrl(),
    company: '',
    website: '',
    products: '',
    location: '',
    contactName: '',
    email: '',
  })
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    document.title = `${form.request === 'onboarding' ? 'Supplier onboarding' : 'Supplier recommendation'} | ZinoBNPL`
  }, [form.request])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setPreview(null)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setPreview({ ...form })
  }

  return (
    <main id="top" className="supplier-recommend-page">
      <div className="wrap">
        <a className="supplier-recommend-back" href="/suppliers">← Back to suppliers</a>
        <section className="supplier-recommend-heading">
          <p className="eyebrow">Grow the supplier network</p>
          <h1>{form.request === 'onboarding' ? 'Introduce your business.' : 'Recommend a supplier.'}</h1>
          <p>
            Use this form to prepare details for a supplier recommendation or onboarding enquiry.
          </p>
        </section>

        <div className="supplier-recommend-layout">
          <form className="panel supplier-recommend-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="supplier-request">How can we help?</label>
              <select id="supplier-request" name="request" value={form.request} onChange={updateField}>
                {Object.entries(requestLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="supplier-company">Supplier or company name</label>
              <input
                id="supplier-company"
                name="company"
                autoComplete="organization"
                required
                value={form.company}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label htmlFor="supplier-website">Website (optional)</label>
              <input
                id="supplier-website"
                name="website"
                type="url"
                inputMode="url"
                placeholder="https://example.com"
                value={form.website}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label htmlFor="supplier-products">Products or categories</label>
              <input
                id="supplier-products"
                name="products"
                required
                value={form.products}
                onChange={updateField}
              />
            </div>
            <div className="field">
              <label htmlFor="supplier-location">Supplier location</label>
              <input
                id="supplier-location"
                name="location"
                autoComplete="country-name"
                required
                value={form.location}
                onChange={updateField}
              />
            </div>
            <div className="supplier-recommend-contact">
              <div className="field">
                <label htmlFor="supplier-contact-name">Your name</label>
                <input
                  id="supplier-contact-name"
                  name="contactName"
                  autoComplete="name"
                  required
                  value={form.contactName}
                  onChange={updateField}
                />
              </div>
              <div className="field">
                <label htmlFor="supplier-contact-email">Your email</label>
                <input
                  id="supplier-contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={updateField}
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit">Preview details</button>
            <p className="supplier-recommend-note">
              This form is a preview only. Details are not sent or saved.
            </p>
          </form>

          <aside className="supplier-recommend-aside" aria-live="polite">
            {preview ? (
              <>
                <p className="eyebrow">Local preview</p>
                <h2>Review your details</h2>
                <dl>
                  <div><dt>Request</dt><dd>{requestLabels[preview.request]}</dd></div>
                  <div><dt>Supplier or company</dt><dd>{preview.company}</dd></div>
                  {preview.website && <div><dt>Website</dt><dd>{preview.website}</dd></div>}
                  <div><dt>Products or categories</dt><dd>{preview.products}</dd></div>
                  <div><dt>Location</dt><dd>{preview.location}</dd></div>
                  <div><dt>Your contact</dt><dd>{preview.contactName} · {preview.email}</dd></div>
                </dl>
                <p className="supplier-recommend-note">
                  Nothing has been sent or saved. A submission service must be connected before this form can reach ZinoBNPL.
                </p>
              </>
            ) : (
              <>
                <p className="eyebrow">What to include</p>
                <h2>Help us understand the supplier.</h2>
                <p>
                  Add the company name, its products, and where it is based. A website is helpful but optional.
                </p>
              </>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}
