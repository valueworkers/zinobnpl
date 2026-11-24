const documentsBucket = 'account-application-documents'

const postSubmission = async (payload) => {
  const response = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const contentType = response.headers.get('content-type') || ''
  const result = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) {
    throw new Error(result?.error || 'We could not submit your details. Please try again.')
  }
  return result
}

export async function submitForm(formType, data, { files } = {}) {
  if (formType !== 'account') {
    const result = await postSubmission({ action: 'submit', formType, data })
    if (!result || result.submitted !== true) {
      throw new Error('We could not confirm your submission. Please try again.')
    }
    return
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Secure document uploads are not configured. Please contact support.')
  }
  if (!files?.taxDocument || !files?.identityDocument) {
    throw new Error('Upload all required verification documents.')
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  const prepared = await postSubmission({ action: 'prepare', formType, data })
  if (!prepared?.prepared || !prepared.submissionId || !Array.isArray(prepared.uploads)) {
    throw new Error('We could not prepare secure document uploads. Please try again.')
  }

  try {
    for (const upload of prepared.uploads) {
      const file = files[upload.field]
      if (!file) throw new Error('A required document is missing.')

      const { error } = await supabase.storage
        .from(documentsBucket)
        .uploadToSignedUrl(upload.path, upload.token, file, {
          contentType: file.type,
          upsert: false,
        })
      if (error) {
        throw new Error(`Could not securely upload ${file.name}. Please try again.`)
      }
    }
  } catch (error) {
    try {
      await postSubmission({ action: 'abort', submissionId: prepared.submissionId })
    } catch (cleanupError) {
      console.error('Could not clean up an incomplete account upload:', cleanupError.message)
    }
    throw error
  }

  const result = await postSubmission({
    action: 'complete',
    submissionId: prepared.submissionId,
  })
  if (!result || result.submitted !== true) {
    throw new Error('We could not confirm your submission. Please contact support.')
  }
  return result
}
