import { registrationCountryCode, registrationRules } from '../src/data/registrationRules.js'

const formIds = {
  account: 'd71694ac-4bad-445f-a0f9-c167fd1f49e6',
  supplier: '6ffdc3db-60de-40fa-9566-32438d22508e',
  contact: 'b0f5e829-2a12-4316-8ea3-864c9d05903d',
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
const getWixErrorCode = async (response) => {
  try {
    const body = await response.json()
    const code = body?.details?.applicationError?.code || body?.code || body?.errorCode
    return typeof code === 'string' && /^[A-Za-z0-9_.-]{1,80}$/.test(code) ? code : null
  } catch {
    return null
  }
}

const readText = (data, key, { required = false, max = 500 } = {}) => {
  const value = typeof data[key] === 'string' ? data[key].trim() : ''
  if ((required && !value) || value.length > max) return null
  return value
}

const isValidWebsite = (value) => {
  if (!value) return true
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const buildSubmission = (formType, data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null

  if (formType === 'account') {
    const businessName = readText(data, 'businessName', { required: true, max: 200 })
    const contactName = readText(data, 'contactName', { required: true, max: 200 })
    const phone = readText(data, 'phone', { required: true, max: 50 })
    const country = readText(data, 'country', { required: true, max: 100 })
    const registration = readText(data, 'registration', { max: 100 })
    const creditLine = readText(data, 'creditLine', { required: true, max: 100 })
    const taxDocument = data.taxDocument
    const identityDocument = data.identityDocument
    const countryCode = registrationCountryCode(country || '')
    const rule = registrationRules[countryCode]
    const normalizedRegistration = (registration || '').toUpperCase().replace(/[\s-]/g, '')

    if (
      businessName === null ||
      contactName === null ||
      phone === null ||
      !/^\+[0-9][0-9\s()-]{6,24}$/.test(phone) ||
      country === null ||
      registration === null ||
      creditLine === null ||
      !['Up to USD 10,000', 'USD 10,000–25,000', 'USD 25,000–100,000', 'Above USD 100,000'].includes(creditLine) ||
      !taxDocument ||
      typeof taxDocument.name !== 'string' ||
      !taxDocument.name.trim() ||
      !identityDocument ||
      typeof identityDocument.name !== 'string' ||
      !identityDocument.name.trim() ||
      (rule && (!normalizedRegistration || !rule.validate(normalizedRegistration)))
    ) return null

    const submission = {
      business_name: businessName,
      contact_name: contactName,
      phone,
      country_of_registration: country,
      credit_line_needed: creditLine,
    }
    if (registration) submission.tax_registration_id = registration
    return submission
  }

  if (formType === 'supplier') {
    const request = readText(data, 'request', { required: true, max: 50 })
    const supplierName = readText(data, 'supplierName', { required: true, max: 200 })
    const website = readText(data, 'website', { max: 500 })
    const products = readText(data, 'products', { required: true, max: 500 })
    const location = readText(data, 'location', { required: true, max: 500 })
    const country = readText(data, 'country', { required: true, max: 100 })
    const province = readText(data, 'province', { required: true, max: 100 })
    const address = readText(data, 'address', { required: true, max: 500 })
    const contactName = readText(data, 'contactName', { required: true, max: 200 })
    const email = readText(data, 'email', { required: true, max: 254 })

    if (
      !['recommendation', 'onboarding'].includes(request) ||
      supplierName === null ||
      website === null ||
      !isValidWebsite(website) ||
      products === null ||
      location === null ||
      country === null ||
      province === null ||
      address === null ||
      contactName === null ||
      email === null ||
      !isEmail(email)
    ) return null

    const submission = {
      request_type: request === 'onboarding'
        ? 'Onboard my business as a supplier'
        : 'Recommend an existing supplier',
      supplier_name: supplierName,
      products,
      supplier_country: country,
      supplier_province: province,
      supplier_address: address,
      supplier_location: location,
      contact_name: contactName,
      contact_email: email,
    }
    if (website) submission.website = website
    return submission
  }

  if (formType === 'contact') {
    const name = readText(data, 'name', { required: true, max: 200 })
    const email = readText(data, 'email', { required: true, max: 254 })
    const phone = readText(data, 'phone', { max: 50 })
    const company = readText(data, 'company', { max: 200 })
    const country = readText(data, 'country', { max: 100 })
    const enquiry = readText(data, 'enquiry', { required: true, max: 100 })
    const message = readText(data, 'message', { required: true, max: 5000 })

    if (
      name === null ||
      email === null ||
      !isEmail(email) ||
      phone === null ||
      company === null ||
      country === null ||
      enquiry === null ||
      message === null
    ) return null

    const submission = {
      full_name: name,
      email,
      enquiry_type: enquiry,
      message,
    }
    if (phone) submission.phone = phone
    if (company) submission.company = company
    if (country) submission.country = country
    return submission
  }

  return null
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const origin = req.headers.origin
  const host = (req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim().toLowerCase()
  let originHost = ''
  try {
    originHost = new URL(origin).host
  } catch {
    return res.status(403).json({ error: 'Request origin not allowed.' })
  }
  if (!host || originHost.toLowerCase() !== host) {
    return res.status(403).json({ error: 'Request origin not allowed.' })
  }

  const { formType, data } = req.body || {}
  const submission = buildSubmission(formType, data)
  if (!submission) return res.status(400).json({ error: 'Check the required fields and try again.' })

  const apiKey = process.env.WIX_API_KEY
  const siteId = process.env.WIX_SITE_ID
  if (!apiKey || !siteId) {
    console.error('Wix submission is not configured: WIX_API_KEY or WIX_SITE_ID is missing.')
    return res.status(503).json({ error: 'The submission service is temporarily unavailable.' })
  }

  let wixResponse
  try {
    wixResponse = await fetch('https://www.wixapis.com/form-submission-service/v4/submissions', {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
        'wix-site-id': siteId,
      },
      body: JSON.stringify({
        submission: {
          formId: formIds[formType],
          submissions: submission,
        },
      }),
    })
  } catch (error) {
    console.error(`Wix submission request failed for ${formType}:`, error.message)
    return res.status(502).json({ error: 'We could not submit your details. Please try again.' })
  }

  if (!wixResponse.ok) {
    const errorCode = await getWixErrorCode(wixResponse)
    console.error(`Wix rejected ${formType} submission with status ${wixResponse.status}${errorCode ? ` (${errorCode})` : ''}.`)
    return res.status(502).json({
      error: 'We could not submit your details. Please try again.',
      reference: errorCode,
    })
  }

  return res.status(201).json({ submitted: true })
}
