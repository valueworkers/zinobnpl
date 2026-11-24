import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((l) => !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      let v = l.slice(i + 1)
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
      return [l.slice(0, i), v]
    }),
)

for (const [k, v] of Object.entries(env)) process.env[k] = v

const sb = createClient(
  process.env.VITE_SUPABASE_URL.replace(/\/$/, ''),
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

const { data: rows } = await sb
  .from('form_submissions')
  .select('id, email_status, fields, documents, created_at')
  .order('created_at', { ascending: false })
  .limit(3)

console.log('recent', rows.map((r) => ({ id: r.id, email_status: r.email_status, at: r.created_at })))

const rec = rows[0]
const docs = []
for (const d of rec.documents || []) {
  const { data, error } = await sb.storage
    .from('account-application-documents')
    .createSignedUrl(d.path, 86400)
  console.log('signed', d.field, error?.message || 'ok')
  docs.push({ ...d, signedUrl: data?.signedUrl })
}

const text = Object.entries(rec.fields).map(([k, v]) => `${k}: ${v}`).join('\n')
const html = `<h2>Debug submission</h2><pre>${text}</pre><ul>${docs
  .map((d) => `<li>${d.label}: <a href="${d.signedUrl}">${d.name}</a></li>`)
  .join('')}</ul>`

const res = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: process.env.RESEND_FROM_EMAIL,
    to: [process.env.RESEND_TEST_TO_EMAIL],
    subject: 'Debug ZinoBNPL submission email',
    text,
    html,
  }),
})

console.log('resend', res.status, await res.text())
