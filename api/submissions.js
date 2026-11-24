import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { registrationCountryCode, registrationRules } from '../src/data/registrationRules.js'

const submissionsTable = 'form_submissions'
const documentsBucket = 'account-application-documents'
const emailRecipients = [
  'valueworkers.global@gmail.com',
]
const maxDocumentSize = 10 * 1024 * 1024
const documentTypes = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
}

const createSupabaseAdmin = () => {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

const getResendConfig = () => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM_EMAIL
  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY and RESEND_FROM_EMAIL are required.')
  }
  const testMode = String(process.env.RESEND_TEST_MODE || '').toLowerCase() === 'true'
  const testTo = (process.env.RESEND_TEST_TO_EMAIL || '').trim()
  return { apiKey, from, testMode, testTo }
}

const getEmailRecipients = () => {
  const { testMode, testTo } = getResendConfig()
  if (testMode) {
    if (!testTo) throw new Error('RESEND_TEST_TO_EMAIL is required when RESEND_TEST_MODE=true.')
    return [testTo]
  }
  return emailRecipients
}

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

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

const isValidDocument = (file) => (
  file &&
  typeof file.name === 'string' &&
  Boolean(file.name.trim()) &&
  file.name.length <= 255 &&
  Object.prototype.hasOwnProperty.call(documentTypes, file.type) &&
  Number.isInteger(file.size) &&
  file.size > 0 &&
  file.size <= maxDocumentSize
)

const buildSubmission = (formType, data) => {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null

  if (formType === 'account') {
    const businessName = readText(data, 'businessName', { required: true, max: 200 })
    const contactName = readText(data, 'contactName', { required: true, max: 200 })
    const phone = readText(data, 'phone', { required: true, max: 50 })
    const country = readText(data, 'country', { required: true, max: 100 })
    const registration = readText(data, 'registration', { max: 100 })
    const creditLine = readText(data, 'creditLine', { required: true, max: 100 })
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
      !isValidDocument(data.taxDocument) ||
      !isValidDocument(data.identityDocument) ||
      (rule && (!normalizedRegistration || !rule.validate(normalizedRegistration)))
    ) return null

    const fields = {
      business_name: businessName,
      contact_name: contactName,
      phone,
      country_of_registration: country,
      credit_line_needed: creditLine,
    }
    if (registration) fields.tax_registration_id = registration
    return fields
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

    const fields = {
      request_type: request === 'onboarding'
        ? 'Onboard my business as a supplier'
        : 'Recommend an existing supplier',
      supplier_name: supplierName,
      products,
      supplier_location: location,
      supplier_country: country,
      supplier_province: province,
      supplier_address: address,
      contact_name: contactName,
      contact_email: email,
    }
    if (website) fields.website = website
    return fields
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

    const fields = {
      full_name: name,
      email,
      enquiry_type: enquiry,
      message,
    }
    if (phone) fields.phone = phone
    if (company) fields.company = company
    if (country) fields.country = country
    return fields
  }

  return null
}

const buildDocumentPlan = (submissionId, data) => (
  [
    { field: 'taxDocument', label: 'Tax registration document' },
    { field: 'identityDocument', label: 'Identity document' },
  ].map(({ field, label }) => {
    const file = data[field]
    return {
      field,
      label,
      name: file.name.trim(),
      type: file.type,
      size: file.size,
      path: `${submissionId}/${field}-${randomUUID()}.${documentTypes[file.type]}`,
    }
  })
)

const getEmailRows = (formType, fields = {}, documents = []) => {
  const known = {
    account: [
      ['business_name', 'Business name'],
      ['contact_name', 'Contact name'],
      ['phone', 'Phone'],
      ['country_of_registration', 'Country of registration'],
      ['tax_registration_id', 'Tax registration ID'],
      ['credit_line_needed', 'Credit line needed'],
    ],
    supplier: [
      ['request_type', 'Request'],
      ['supplier_name', 'Supplier or company name'],
      ['website', 'Website'],
      ['products', 'Products or categories'],
      ['supplier_location', 'Supplier location'],
      ['supplier_country', 'Country'],
      ['supplier_province', 'Province or state'],
      ['supplier_address', 'Address'],
      ['contact_name', 'Contact name'],
      ['contact_email', 'Email'],
    ],
    contact: [
      ['full_name', 'Full name'],
      ['email', 'Email'],
      ['phone', 'Phone'],
      ['company', 'Company'],
      ['country', 'Country'],
      ['enquiry_type', 'Enquiry type'],
      ['message', 'Message'],
    ],
  }

  const labels = known[formType] || []
  const used = new Set(labels.map(([key]) => key))
  const rows = labels.map(([key, label]) => ({
    label,
    value: fields[key] ? String(fields[key]) : 'Not provided',
  }))

  // Include any extra stored fields so nothing submitted is missing from the email.
  for (const [key, value] of Object.entries(fields)) {
    if (used.has(key) || value == null || value === '') continue
    rows.push({
      label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      value: String(value),
    })
  }

  for (const document of documents) {
    rows.push({
      label: document.label || 'Document',
      value: document.name || 'Uploaded file',
      href: document.signedUrl,
    })
  }

  return rows
}

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const sendNotificationEmail = async (formType, fields, documents = []) => {
  const { apiKey, from } = getResendConfig()
  const formNames = {
    account: 'Open Account',
    supplier: 'Supplier',
    contact: 'Contact Us',
  }
  const rows = getEmailRows(formType, fields, documents)
  const text = rows.map(({ label, value, href }) => (
    `${label}: ${value}${href ? `\nSecure link (expires in 24 hours): ${href}` : ''}`
  )).join('\n\n')
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#222;line-height:1.5;font-size:15px">
      <h2 style="margin:0 0 16px;font-size:20px">New ZinoBNPL ${escapeHtml(formNames[formType])} submission</h2>
      <p style="margin:0 0 16px;color:#555">A new form was submitted. Details below:</p>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${rows.map(({ label, value, href }) => `
          <tr>
            <th align="left" style="padding:10px 12px;border:1px solid #e5e5e5;background:#f7f7f7;width:38%;vertical-align:top">${escapeHtml(label)}</th>
            <td style="padding:10px 12px;border:1px solid #e5e5e5;vertical-align:top;white-space:pre-wrap">${escapeHtml(value)}${href
              ? `<br><a href="${escapeHtml(href)}">Open securely (link expires in 24 hours)</a>`
              : ''}</td>
          </tr>
        `).join('')}
      </table>
    </div>
  `
  const replyTo = formType === 'supplier'
    ? fields.contact_email
    : formType === 'contact'
      ? fields.email
      : undefined

  const to = getEmailRecipients()
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to,
      ...(replyTo ? { reply_to: replyTo } : {}),
      subject: `New ZinoBNPL ${formNames[formType]} submission`,
      text,
      html,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    console.error(`Resend rejected ${formType} notification with status ${response.status}.`, detail)
    let reason = `Resend HTTP ${response.status}`
    try {
      const parsed = JSON.parse(detail)
      if (parsed?.message) reason = parsed.message
    } catch {
      if (detail) reason = detail.slice(0, 300)
    }
    throw new Error(reason)
  }
}

const updateEmailStatus = async (supabase, id, emailStatus) => {
  const { error } = await supabase
    .from(submissionsTable)
    .update({ email_status: emailStatus })
    .eq('id', id)
  if (error) console.error(`Could not update email status for submission ${id}:`, error.message)
}

const sendAndRespond = async (res, supabase, record, documents = []) => {
  try {
    getResendConfig()
    await sendNotificationEmail(record.form_type, record.fields, documents)
  } catch (error) {
    await updateEmailStatus(supabase, record.id, 'failed')
    console.error(`Notification email failed for ${record.form_type} submission ${record.id}:`, error.message)
    const testMode = String(process.env.RESEND_TEST_MODE || '').toLowerCase() === 'true'
    return res.status(201).json({
      submitted: true,
      emailSent: false,
      warning: 'Submission saved. Notification email could not be sent.',
      ...(testMode ? { emailError: error.message } : {}),
    })
  }

  await updateEmailStatus(supabase, record.id, 'sent')
  return res.status(201).json({ submitted: true, emailSent: true })
}

const prepareAccountSubmission = async (req, res, supabase, data) => {
  const fields = buildSubmission('account', data)
  if (!fields) return res.status(400).json({ error: 'Check the required fields and try again.' })

  const id = randomUUID()
  const documents = buildDocumentPlan(id, data)
  const { error: insertError } = await supabase
    .from(submissionsTable)
    .insert({
      id,
      form_type: 'account',
      fields,
      documents,
      status: 'uploading',
      email_status: 'pending',
    })
  if (insertError) {
    console.error('Could not save account submission in Supabase:', insertError.message)
    const missingTable = /schema cache|does not exist|PGRST205/i.test(insertError.message || '')
    return res.status(502).json({
      error: missingTable
        ? 'Database setup is incomplete: create the form_submissions table in Supabase, then try again.'
        : 'We could not save your application. Please try again.',
    })
  }

  try {
    const uploads = []
    for (const document of documents) {
      const { data: signedUpload, error } = await supabase
        .storage
        .from(documentsBucket)
        .createSignedUploadUrl(document.path)
      if (error || !signedUpload?.token) {
        throw new Error(`Could not prepare ${document.label} upload.`)
      }
      uploads.push({ field: document.field, path: document.path, token: signedUpload.token })
    }
    return res.status(201).json({ prepared: true, submissionId: id, uploads })
  } catch (error) {
    const { error: deleteError } = await supabase.from(submissionsTable).delete().eq('id', id)
    if (deleteError) console.error(`Could not remove incomplete submission ${id}:`, deleteError.message)
    console.error(`Could not prepare account document uploads for ${id}:`, error.message)
    return res.status(502).json({ error: 'We could not prepare secure document uploads. Please try again.' })
  }
}

const abortAccountSubmission = async (res, supabase, submissionId) => {
  if (typeof submissionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(submissionId)) {
    return res.status(400).json({ error: 'Invalid submission reference.' })
  }
  const { data: record, error: lookupError } = await supabase
    .from(submissionsTable)
    .select('id, form_type, documents, status')
    .eq('id', submissionId)
    .maybeSingle()
  if (lookupError) {
    console.error('Could not check incomplete account submission:', lookupError.message)
    return res.status(502).json({ error: 'We could not clean up the incomplete upload.' })
  }
  if (!record) return res.status(200).json({ aborted: true })
  if (record.form_type !== 'account' || record.status !== 'uploading') {
    return res.status(409).json({ error: 'This submission can no longer be cancelled.' })
  }

  const paths = (record.documents || []).map((document) => document.path)
  const { error: storageError } = await supabase.storage.from(documentsBucket).remove(paths)
  if (storageError) {
    console.error(`Could not remove incomplete account documents for ${submissionId}:`, storageError.message)
    return res.status(502).json({ error: 'We could not clean up the incomplete upload.' })
  }
  const { error: deleteError } = await supabase.from(submissionsTable).delete().eq('id', submissionId)
  if (deleteError) {
    console.error(`Could not remove incomplete submission ${submissionId}:`, deleteError.message)
    return res.status(502).json({ error: 'We could not clean up the incomplete upload.' })
  }
  return res.status(200).json({ aborted: true })
}

const completeAccountSubmission = async (res, supabase, submissionId) => {
  if (typeof submissionId !== 'string' || !/^[0-9a-f-]{36}$/i.test(submissionId)) {
    return res.status(400).json({ error: 'Invalid submission reference.' })
  }
  const { data: record, error: lookupError } = await supabase
    .from(submissionsTable)
    .select('id, form_type, fields, documents, status')
    .eq('id', submissionId)
    .maybeSingle()
  if (lookupError) {
    console.error('Could not load account submission:', lookupError.message)
    return res.status(502).json({ error: 'We could not finish your application. Please contact support.' })
  }
  if (!record || record.form_type !== 'account') {
    return res.status(404).json({ error: 'Application not found.' })
  }
  if (record.status !== 'uploading') {
    return res.status(409).json({ error: 'This application has already been processed.' })
  }

  const documents = []
  for (const document of record.documents || []) {
    const { data: signedFile, error } = await supabase
      .storage
      .from(documentsBucket)
      .createSignedUrl(document.path, 60 * 60 * 24)
    if (error || !signedFile?.signedUrl) {
      console.error(`Could not confirm uploaded file ${document.field} for ${submissionId}:`, error?.message || 'No signed URL returned.')
      return res.status(400).json({ error: 'A required document upload is missing. Please try submitting again.' })
    }
    documents.push({ ...document, signedUrl: signedFile.signedUrl })
  }
  if (documents.length !== 2) {
    return res.status(400).json({ error: 'Required application documents are missing.' })
  }

  const submittedAt = new Date().toISOString()
  const { error: updateError } = await supabase
    .from(submissionsTable)
    .update({ status: 'submitted', submitted_at: submittedAt })
    .eq('id', submissionId)
    .eq('status', 'uploading')
  if (updateError) {
    console.error(`Could not finalize account submission ${submissionId}:`, updateError.message)
    return res.status(502).json({ error: 'We could not finish your application. Please contact support.' })
  }

  return sendAndRespond(res, supabase, { ...record, status: 'submitted' }, documents)
}

const submitFormWithoutFiles = async (req, res, supabase, formType, data) => {
  if (!['supplier', 'contact'].includes(formType)) {
    return res.status(400).json({ error: 'Use the secure upload flow for account applications.' })
  }
  const fields = buildSubmission(formType, data)
  if (!fields) return res.status(400).json({ error: 'Check the required fields and try again.' })

  const { data: record, error } = await supabase
    .from(submissionsTable)
    .insert({
      form_type: formType,
      fields,
      documents: [],
      status: 'submitted',
      email_status: 'pending',
      submitted_at: new Date().toISOString(),
    })
    .select('id, form_type, fields')
    .single()
  if (error) {
    console.error(`Could not save ${formType} submission in Supabase:`, error.message)
    return res.status(502).json({ error: 'We could not save your details. Please try again.' })
  }

  return sendAndRespond(res, supabase, record)
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
    originHost = new URL(origin).host.toLowerCase()
  } catch {
    return res.status(403).json({ error: 'Request origin not allowed.' })
  }
  if (!host || originHost !== host) {
    return res.status(403).json({ error: 'Request origin not allowed.' })
  }

  let supabase
  try {
    supabase = createSupabaseAdmin()
  } catch (error) {
    console.error('Supabase submission service is not configured:', error.message)
    return res.status(503).json({ error: 'The submission service is temporarily unavailable.' })
  }

  const body = req.body && typeof req.body === 'object' ? req.body : {}
  const action = body.action || 'submit'
  if (action === 'abort') {
    return abortAccountSubmission(res, supabase, body.submissionId)
  }

  if (action === 'prepare') {
    if (body.formType !== 'account') {
      return res.status(400).json({ error: 'Only account applications use document uploads.' })
    }
    return prepareAccountSubmission(req, res, supabase, body.data)
  }
  if (action === 'complete') {
    return completeAccountSubmission(res, supabase, body.submissionId)
  }
  if (action === 'submit') {
    return submitFormWithoutFiles(req, res, supabase, body.formType, body.data)
  }
  return res.status(400).json({ error: 'Unsupported submission action.' })
}
