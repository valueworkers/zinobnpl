import { useEffect, useState } from 'react'
import { submitForm } from '../lib/submitForm'
import supplierRecords from '../data/suppliers.json'
import countries from '../data/countries.json'

const categoryLabels = {
  building: 'Building materials',
  hardware: 'Hardware & tools',
  electronics: 'Electronics',
  computer: 'Computer hardware',
  manufactured: 'Manufactured goods',
  industrial: 'Industrial',
  furniture: 'Furniture',
  mattresses: 'Mattresses',
  flooring: 'Flooring',
  lighting: 'Lighting',
  home_appliances: 'Home appliances',
  healthcare_medical: 'Healthcare & medical',
  apparel_accessories: 'Apparel & accessories',
  luggage_bags: 'Luggage & bags',
  towels_home_textiles: 'Towels & home textiles',
  stationery: 'Stationery',
  strollers_toys: 'Strollers & toys',
  packaging_materials: 'Packaging materials',
  foodstuff: 'Foodstuff',
  household_tissue: 'Household tissue',
  hardware_fasteners: 'Hardware & fasteners',
  printing_consumables: 'Printing consumables',
  bicycle_lighting: 'Bicycle lighting',
  decoration_materials: 'Decoration materials',
  new_materials: 'New materials',
  commercial_equipment: 'Commercial equipment',
  pet_supplies: 'Pet supplies',
  cosmetics: 'Cosmetics',
  musical_instruments: 'Musical instruments',
  sporting_goods: 'Sporting goods',
  rubber_plastic_parts: 'Rubber & plastic parts',
}

const supplierCategories = [...new Set(supplierRecords.map((supplier) => supplier.category))]
  .sort((a, b) => (categoryLabels[a] || a).localeCompare(categoryLabels[b] || b))

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
    country: 'China',
    province: '',
    address: '',
    contactName: '',
    email: '',
  })
  const [preview, setPreview] = useState(null)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    document.title = `${form.request === 'onboarding' ? 'Supplier onboarding' : 'Supplier recommendation'} | ZinoBNPL`
  }, [form.request])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setPreview(null)
    setStatus('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setStatus('')
    try {
      await submitForm('supplier', {
        request: form.request,
        supplierName: form.company,
        website: form.website,
        products: form.products,
        location: [form.address, form.province, form.country].filter(Boolean).join(', '),
        country: form.country,
        province: form.province,
        address: form.address,
        contactName: form.contactName,
        email: form.email,
      })
      setPreview({ ...form })
      setStatus('Your supplier details have been submitted. Our team will be in touch.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsSubmitting(false)
    }
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
              <label htmlFor="supplier-products">Product category</label>
              <select
                id="supplier-products"
                name="products"
                required
                value={form.products}
                onChange={updateField}
              >
                <option value="">Select a product category</option>
                {supplierCategories.map((category) => (
                  <option key={category} value={categoryLabels[category] || category}>
                    {categoryLabels[category] || category}
                  </option>
                ))}
              </select>
            </div>
            <div className="supplier-location-fields">
              <div className="field">
                <label htmlFor="supplier-country">Supplier country</label>
                <select
                  id="supplier-country"
                  name="country"
                  autoComplete="country-name"
                  required
                  value={form.country}
                  onChange={updateField}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="supplier-province">Province / state</label>
                <input
                  id="supplier-province"
                  name="province"
                  required
                  placeholder="e.g. Zhejiang"
                  value={form.province}
                  onChange={updateField}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="supplier-address">Supplier address</label>
              <input
                id="supplier-address"
                name="address"
                required
                autoComplete="street-address"
                placeholder="Street, city and postal address"
                value={form.address}
                onChange={updateField}
              />
            </div>
            <div className="supplier-recommend-contact">
              <div className="field">
                <label htmlFor="supplier-contact-name">Contact person name</label>
                <input
                  id="supplier-contact-name"
                  name="contactName"
                  autoComplete="name"
                  required
                  placeholder="Full name"
                  value={form.contactName}
                  onChange={updateField}
                />
              </div>
              <div className="field">
                <label htmlFor="supplier-contact-email">Business email</label>
                <input
                  id="supplier-contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={updateField}
                />
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit supplier details'}
            </button>
            <p className="supplier-recommend-note" role="status" hidden={!status}>{status}</p>
          </form>

          <aside className="supplier-recommend-aside" aria-live="polite">
            {preview ? (
              <>
                <p className="eyebrow">Submission received</p>
                <h2>Thank you for getting in touch.</h2>
                <dl>
                  <div><dt>Request</dt><dd>{requestLabels[preview.request]}</dd></div>
                  <div><dt>Supplier or company</dt><dd>{preview.company}</dd></div>
                  {preview.website && <div><dt>Website</dt><dd>{preview.website}</dd></div>}
                  <div><dt>Products or categories</dt><dd>{preview.products}</dd></div>
                  <div><dt>Location</dt><dd>{[preview.address, preview.province, preview.country].filter(Boolean).join(', ')}</dd></div>
                  <div><dt>Your contact</dt><dd>{preview.contactName} · {preview.email}</dd></div>
                </dl>
                <p className="supplier-recommend-note">
                  Your information has been securely submitted to ZinoBNPL for review.
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
