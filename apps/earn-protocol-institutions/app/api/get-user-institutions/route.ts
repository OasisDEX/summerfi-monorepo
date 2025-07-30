import { cookies } from 'next/headers'

import { checkLoginSignature } from '@/app/server-handlers/check-login-signature'
import { getUserInstitutionView } from '@/app/server-handlers/get-user-institution-view'
import { LOGIN_COOKIE_NAME, LOGIN_COOKIE_NAME_CHAIN } from '@/constants/login-cookie'

export const GET = async (request: Request) => {
  const url = new URL(request.url)
  const userWalletAddress = url.searchParams.get('userWalletAddress')
  // this is optional, if not provided, it will return the first institution (after logging in)
  const institutionId = url.searchParams.get('institutionId')

  // This check needs to be on every route with access to user/institution data [start]
  const cookieStore = await cookies()
  const loginSignature = cookieStore.get(LOGIN_COOKIE_NAME)?.value
  const loginChainId = cookieStore.get(LOGIN_COOKIE_NAME_CHAIN)?.value

  if (!loginSignature || !loginChainId || !userWalletAddress) {
    return new Response('Unauthorized - Missing required parameters', { status: 401 })
  }

  const chainId = Number(loginChainId)

  const isValidSignature = await checkLoginSignature({
    userWalletAddress,
    loginSignature,
    chainId,
  })

  if (!isValidSignature) {
    return new Response('Unauthorized - Invalid signature', { status: 401 })
  }
  // This check needs to be on every route with access to user/institution data [end]

  try {
    const { institution } = await getUserInstitutionView({
      userWalletAddress,
      institutionId,
    })

    return new Response(JSON.stringify({ institution }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'

    return new Response(errorMessage, { status: 500 })
  }
}
