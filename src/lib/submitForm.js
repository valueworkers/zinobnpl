export async function submitForm(formType, data) {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ formType, data }),
  })

  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) {
    const message = result?.error || 'We could not submit your details. Please try again.'
    throw new Error(result?.reference ? `${message} (Reference: ${result.reference})` : message)
  }
  if (!result || result.submitted !== true) {
    throw new Error('We could not confirm your submission. Please try again.')
  }
}
