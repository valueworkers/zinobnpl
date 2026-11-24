import { useState } from 'react'
import countries from '../data/countries.json'
import { registrationCountryCode, registrationRules } from '../data/registrationRules'
import { submitForm } from '../lib/submitForm'

const docs = [
  ['Business registration', 'Proof that your business is legally registered'],
  ['Tax registration', 'The applicable tax ID for your country'],
  ['Import/export authorisation', 'If required for your business or products'],
  ['Industry or SME certification', 'If applicable in your country'],
]

const lines = ['Up to USD 10,000', 'USD 10,000–25,000', 'USD 25,000–100,000', 'Above USD 100,000']
const phoneCodes = countries.flatMap((country) => country.dialCodes.map((dialCode) => ({
  value: `${country.code}-${dialCode}`,
  dialCode,
  label: `${dialCode} (${country.code}) — ${country.name}`,
  shortLabel: `${dialCode} (${country.code})`,
})))

export default function Apply() {
  const defaultPhoneCode = phoneCodes.find((option) => option.dialCode === '+91' && option.value.startsWith('IN-'))?.value || ''
  const [form, setForm] = useState({ biz: '', person: '', phoneCode: defaultPhoneCode, phone: '', country: '', registration: '', line: lines[0] })
  const [taxDocument, setTaxDocument] = useState(null)
  const [identityDocument, setIdentityDocument] = useState(null)
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registrationTouched, setRegistrationTouched] = useState(false)

  const set = (k) => (e) => {
    setForm((current) => ({ ...current, [k]: e.target.value }))
    setStatus('')
    if (k === 'registration') setRegistrationTouched(true)
  }
  const setRegistrationCountry = (e) => {
    setForm((current) => ({ ...current, country: e.target.value, registration: '' }))
    setTaxDocument(null)
    setIdentityDocument(null)
    setRegistrationTouched(false)
    setStatus('')
  }
  const countryCode = registrationCountryCode(form.country)
  const registrationRule = registrationRules[countryCode]
  const isUnsupportedRegistrationCountry = Boolean(form.country.trim() && !registrationRule)
  const registrationValue = form.registration.trim().toUpperCase().replace(/[\s-]/g, '')
  const registrationError = registrationRule && registrationTouched
    ? !registrationValue
      ? `Enter your ${registrationRule.label}.`
      : registrationRule.validate(registrationValue)
        ? ''
        : registrationRule.error
    : ''
  const countryCodeName = countryCode || ''
  const taxDocumentLabel = countryCodeName === 'IN'
    ? 'Tax / GST Registration Certificate'
    : 'Business Tax Registration Certificate'
  const identityDocumentLabel = countryCodeName === 'IN'
    ? 'Company or Director PAN Card'
    : 'Company or Director ID Card'
  const documentAccept = '.pdf,.jpg,.jpeg,.png'

  const updateDocument = (setter) => (event) => {
    const file = event.target.files?.[0] || null
    setter(file)
    setStatus('')
  }

  const validateDocument = (file) => {
    if (!file) return 'Upload all required verification documents.'
    if (file.size > 10 * 1024 * 1024) return 'Each document must be 10 MB or smaller.'
    if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
      return 'Upload documents as PDF, JPG or PNG.'
    }
    return ''
  }

  const submit = async (e) => {
    e.preventDefault()
    setRegistrationTouched(true)
    if (!form.biz.trim() || !form.person.trim() || !form.phoneCode || !form.phone.trim() || !form.country.trim()) {
      setStatus('Add your business name, contact name, country of registration, and phone number with a country code.')
      return
    }
    if (registrationRule && !registrationValue) {
      setStatus(`Enter your ${registrationRule.label}.`)
      return
    }
    if (registrationRule && !registrationRule.validate(registrationValue)) {
      setStatus(registrationRule.error)
      return
    }
    const taxDocumentError = validateDocument(taxDocument)
    if (taxDocumentError) {
      setStatus(taxDocumentError)
      return
    }
    const identityDocumentError = validateDocument(identityDocument)
    if (identityDocumentError) {
      setStatus(identityDocumentError)
      return
    }

    const phoneCode = phoneCodes.find((option) => option.value === form.phoneCode)
    if (!phoneCode) {
      setStatus('Choose a valid phone country code.')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await submitForm('account', {
        businessName: form.biz,
        contactName: form.person,
        phone: `${phoneCode.dialCode} ${form.phone.trim()}`,
        country: form.country,
        registration: registrationValue,
        creditLine: form.line,
        taxDocument: {
          name: taxDocument.name,
          type: taxDocument.type,
          size: taxDocument.size,
        },
        identityDocument: {
          name: identityDocument.name,
          type: identityDocument.type,
          size: identityDocument.size,
        },
      }, {
        files: { taxDocument, identityDocument },
      })
      if (result?.emailSent === false) {
        setStatus(result.emailError
          ? `Application saved, but email failed: ${result.emailError}`
          : 'Application saved, but the notification email could not be sent.')
      } else {
        setStatus('Your account application has been submitted. Our team will be in touch.')
      }
    } catch (error) {
      setStatus(error.message)
    } finally {
      setIsSubmitting(false)
    }
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
              <input id="biz" autoComplete="organization" placeholder="e.g. Northstar Trading" required value={form.biz} onChange={set('biz')} />
            </div>
            <div className="two">
              <div className="f">
                <label htmlFor="person">Your name</label>
                <input id="person" autoComplete="name" required value={form.person} onChange={set('person')} />
              </div>
              <div className="f">
                <label htmlFor="phone">Phone (WhatsApp)</label>
                <div className="phone-input">
                  <select
                    aria-label="Phone country code"
                    autoComplete="tel-country-code"
                    required
                    value={form.phoneCode}
                    onChange={set('phoneCode')}
                  >
                    <option value="">Code</option>
                    {phoneCodes.map((option) => (
                      <option key={option.value} value={option.value} title={option.label}>{option.shortLabel}</option>
                    ))}
                  </select>
                  <input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="Phone number" value={form.phone} onChange={set('phone')} />
                </div>
              </div>
            </div>
            <div className="two registration-row">
              <div className="f">
                <label htmlFor="country">Country of registration</label>
                <input
                  id="country"
                  list="registration-countries"
                  autoComplete="country-name"
                  placeholder="Search countries"
                  required
                  value={form.country}
                  onChange={setRegistrationCountry}
                />
                <datalist id="registration-countries">
                  <option value="India" />
                  <option value="USA" />
                  <option value="UK" />
                  {countries.map((country) => <option key={country.code} value={country.name} />)}
                </datalist>
              </div>
              <div className="f">
                <label htmlFor="registration">
                  {registrationRule?.label || 'Business / tax registration ID'}
                  {registrationRule && <span aria-hidden="true"> *</span>}
                </label>
                <input
                  id="registration"
                  autoCapitalize="characters"
                  autoComplete="off"
                  placeholder={registrationRule?.placeholder || 'Enter your local registration ID'}
                  required={Boolean(registrationRule)}
                  aria-invalid={Boolean(registrationError)}
                  aria-describedby={registrationError ? 'registration-error' : undefined}
                  value={form.registration}
                  onChange={set('registration')}
                  onBlur={() => setRegistrationTouched(true)}
                />
              </div>
            </div>
            {form.country.trim() && (
              <fieldset className="verification-documents">
                <legend>Company & tax verification</legend>
                <p>Upload both documents for the 48-hour approval review.</p>
                <div className="verification-document-grid">
                  <label className="document-upload" htmlFor="tax-document">
                    <span>{taxDocumentLabel} <strong>*</strong></span>
                    <input
                      id="tax-document"
                      className="document-file-input"
                      type="file"
                      accept={documentAccept}
                      required
                      onChange={updateDocument(setTaxDocument)}
                    />
                    <span className="document-file-button">{taxDocument ? 'Change file' : 'Choose file'}</span>
                    <small>{taxDocument ? taxDocument.name : 'PDF, JPG or PNG · max 10 MB'}</small>
                  </label>
                  <label className="document-upload" htmlFor="identity-document">
                    <span>{identityDocumentLabel} <strong>*</strong></span>
                    <input
                      id="identity-document"
                      className="document-file-input"
                      type="file"
                      accept={documentAccept}
                      required
                      onChange={updateDocument(setIdentityDocument)}
                    />
                    <span className="document-file-button">{identityDocument ? 'Change file' : 'Choose file'}</span>
                    <small>{identityDocument ? identityDocument.name : 'PDF, JPG or PNG · max 10 MB'}</small>
                  </label>
                </div>
              </fieldset>
            )}
            <div className="registration-error-slot" aria-live="polite">
              {registrationError && <p className="field-error" id="registration-error" role="alert">{registrationError}</p>}
              {isUnsupportedRegistrationCountry && (
                <p className="registration-notice">
                  <strong>Need help?</strong> Please contact us and we’ll add your country’s tax ID format.
                </p>
              )}
            </div>
            <div className="f">
              <label htmlFor="line">Credit line needed (USD)</label>
              <select id="line" value={form.line} onChange={set('line')}>
                {lines.map((l) => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Open an account'}
            </button>
            <p className="status" role="status" hidden={!status}>{status}</p>
          </form>
        </div>
      </section>
    </div>
  )
}
