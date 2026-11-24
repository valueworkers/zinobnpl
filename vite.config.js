import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import submissionsHandler from './api/submissions.js'

const applyLocalEnv = (mode) => {
  const env = loadEnv(mode, process.cwd(), '')
  for (const key of [
    'WIX_API_KEY',
    'WIX_SITE_ID',
    'VITE_SUPABASE_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'RESEND_TEST_MODE',
    'RESEND_TEST_TO_EMAIL',
  ]) {
    if (env[key]) process.env[key] = env[key]
  }
  return env
}

export default defineConfig(({ command, mode }) => {
  if (command === 'serve') applyLocalEnv(mode)

  return {
    plugins: [
      react(),
      {
        name: 'local-wix-submissions',
        configureServer(server) {
          server.middlewares.use('/api/submissions', (req, res) => {
            // Reload .env on every request so key changes apply without a full restart.
            applyLocalEnv(mode)
            if (req.method !== 'POST') {
              res.statusCode = 405
              res.setHeader('Allow', 'POST')
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: 'Method not allowed.' }))
              return
            }

            const chunks = []
            let size = 0
            let tooLarge = false
            req.on('data', (chunk) => {
              size += chunk.length
              if (size > 20000) {
                tooLarge = true
                return
              }
              chunks.push(chunk)
            })
            req.on('end', async () => {
              if (tooLarge) {
                res.statusCode = 413
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Submission is too large.' }))
                return
              }

              try {
                req.body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              } catch {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ error: 'Invalid submission data.' }))
                return
              }

              const response = {
                setHeader: res.setHeader.bind(res),
                status(code) {
                  res.statusCode = code
                  return this
                },
                json(payload) {
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify(payload))
                },
              }

              try {
                await submissionsHandler(req, response)
              } catch (error) {
                console.error('Local Wix submission handler failed:', error.message)
                if (!res.headersSent) {
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ error: 'The submission service is temporarily unavailable.' }))
                }
              }
            })
          })
        },
      },
    ],
  }
})
