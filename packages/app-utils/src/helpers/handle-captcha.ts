/* eslint-disable no-console */
export const RECAPTCHA_SITE_KEY = '6LclS4UrAAAAAO40QI5fdqonhbNUpepJ77HWfaNd'

declare global {
  const grecaptcha: {
    ready: (cb: () => void) => void
    execute: (
      siteKey: string,
      params: {
        action: string
      },
    ) => Promise<string>
  }
}

export const handleCaptcha = async ({
  formValues,
  formEndpoint,
  resetForm,
  setIsSubmitting,
  setIsSubmitted,
  setFormErrors,
}: {
  formValues: {
    [key: string]: string[] | string | number | { [key: string]: string[] | string | number }
  }
  formEndpoint: string
  resetForm: () => void
  setIsSubmitting: (isSubmitting: boolean) => void
  setIsSubmitted: (isSubmitted: boolean) => void
  setFormErrors: (errors: Partial<{ [key: string]: string[] }>) => void
}): Promise<boolean> => {
  return await new Promise((resolve) => {
    setIsSubmitting(true)
    setIsSubmitted(false)
    setFormErrors({})
    // eslint-disable-next-line consistent-return
    grecaptcha.ready(() => {
      try {
        // Execute reCAPTCHA
        grecaptcha
          .execute(RECAPTCHA_SITE_KEY, { action: 'submit' })
          // eslint-disable-next-line consistent-return
          .then(async (token) => {
            if (!token) {
              setFormErrors({
                global: ['reCAPTCHA verification failed. Please try again.'],
              })
              setIsSubmitting(false)

              return resolve(false)
            }
            // Submit form with token
            const response = await fetch(formEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...formValues, token }),
            })

            if (response.status !== 200) {
              setFormErrors({
                global: ['An unexpected error occurred. Please try again later.'],
              })
              setIsSubmitting(false)

              return resolve(false)
            }

            const data = await response.json()

            // Handle success
            if (data.success) {
              resetForm()
              setIsSubmitted(true)
              setFormErrors({})
              resolve(true)
            } else {
              setFormErrors({
                global: data.errors || ['An unexpected error occurred. Please try again later.'],
              })
              console.error('Form submission failed:', data.errors)
              setIsSubmitting(false)
              resolve(false)
            }
          })
          .catch((error) => {
            console.error('reCAPTCHA execution failed:', error)
            setFormErrors({
              global: ['reCAPTCHA execution failed. Please try again later.'],
            })
            setIsSubmitting(false)

            return resolve(false)
          })
      } catch (error) {
        console.error('Error during form submission:', error)
        setFormErrors({
          global: ['An unexpected error occurred. Please try again later.'],
        })
        resolve(false)
      } finally {
        setIsSubmitting(false)
      }
    })
  })
}
