export const validateCaptcha = async (token: string): Promise<boolean> => {
  if (process.env.NODE_ENV !== 'production') {
    return true // Bypass captcha validation in non-production environments
  }

  if (!token) {
    throw new Error('Captcha token is required')
  }

  const captchaSecretkey = process.env.RECAPTCHA_SECRET_KEY

  if (!captchaSecretkey) {
    throw new Error('RECAPTCHA_SECRET_KEY is not defined')
  }

  const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      secret: captchaSecretkey,
      response: token,
    }),
  })

  const recaptchaData = await recaptchaResponse.json()

  return recaptchaData.success
}
