import { cookies } from 'next/headers'

import { checkLoginSignature } from '@/app/server-handlers/check-login-signature'
import { LOGIN_COOKIE_SIGNATURE_NAME } from '@/constants/login-cookie'

export const cookieChecker = async ({
  userWalletAddress,
  institutionId,
  withInstitutionId = false,
}: {
  userWalletAddress?: string | null
  institutionId?: string | null
  withInstitutionId?: boolean
}): Promise<undefined | Response> => {
  const cookieStore = await cookies()
  const loginSignature = cookieStore.get(LOGIN_COOKIE_SIGNATURE_NAME)?.value

  if (!loginSignature || !userWalletAddress || (withInstitutionId && !institutionId)) {
    return new Response('Unauthorized - Missing required parameters', { status: 401 })
  }

  const isValidSignature = await checkLoginSignature({
    userWalletAddress,
    loginSignature,
  })

  if (!isValidSignature) {
    return new Response('Unauthorized - Invalid signature', { status: 401 })
  }

  // If the signature is valid, we can proceed without returning a response
  return undefined
}
