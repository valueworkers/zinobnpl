import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((l) => !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i), l.slice(i + 1).replace(/^"|"$/g, '')]
    }),
)

const sb = createClient(
  (env.VITE_SUPABASE_URL || '').replace(/\/$/, ''),
  env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const { data: rec, error } = await sb
  .from('form_submissions')
  .select('*')
  .eq('form_type', 'account')
  .order('created_at', { ascending: false })
  .limit(1)
  .single()

if (error) {
  console.error(error.message)
  process.exit(1)
}

const docs = []
for (const d of rec.documents || []) {
  const { data } = await sb.storage
    .from('account-application-documents')
    .createSignedUrl(d.path, 60 * 60 * 24)
  docs.push({ ...d, signedUrl: data?.signedUrl })
}

const rows = [
  ['Business name', rec.fields.business_name],
  ['Contact name', rec.fields.contact_name],
  ['Phone', rec.fields.phone],
  ['Country of registration', rec.fields.country_of_registration],
  ['Tax registration ID', rec.fields.tax_registration_id || 'Not provided'],
  ['Credit line needed', rec.fields.credit_line_needed],
  ...docs.map((d) => [d.label, d.name, d.signedUrl]),
]

const text = rows
  .map(([label, value, href]) => `${label}: ${value}${href ? `\nSecure link (expires in 24 hours): ${href}` : ''}`)
  .join('\n')

const html = `
  <div style="font-family:Arial,sans-serif;color:#222;line-height:1.5">
    <h2 style="margin:0 0 16px">New ZinoBNPL Open Account submission</h2>
    <table style="border-collapse:collapse;width:100%;max-width:640px">
      ${rows.map(([label, value, href]) => `
        <tr>
          <th align="left" style="padding:10px 12px;border-bottom:1px solid #e5e5e5;background:#f7f7f7;width:38%;vertical-align:top">${label}</th>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e5e5;vertical-align:top">
            ${String(value || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
            ${href ? `<br><a href="${href}">Open securely (link expires in 24 hours)</a>` : ''}
          </td>
        </tr>
      `).join('')}
    </table>
  </div>
`

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: env.RESEND_FROM_EMAIL,
    to: [env.RESEND_TEST_TO_EMAIL],
    subject: 'New ZinoBNPL Open Account submission',
    text,
    html,
  }),
})

const body = await res.text()
console.log(res.status, body)
if (res.ok) {
  await sb.from('form_submissions').update({ email_status: 'sent' }).eq('id', rec.id)
  console.log('updated email_status for', rec.id)
}
