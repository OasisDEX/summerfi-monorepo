import { cookies } from 'next/headers'

import { checkLoginSignature } from '@/app/server-handlers/check-login-signature'
import {
  LOGIN_COOKIE_HTTP_ONLY,
  LOGIN_COOKIE_MAX_AGE,
  LOGIN_COOKIE_NAME,
  LOGIN_COOKIE_NAME_CHAIN,
  LOGIN_COOKIE_PATH,
  LOGIN_COOKIE_SAME_SITE,
  LOGIN_COOKIE_SECURE,
} from '@/constants/login-cookie'

export const POST = async (req: Request) => {
  const cookieStore = await cookies()

  try {
    const { userWalletAddress, loginSignature, chainId, logOut } = await req.json()

    if (logOut) {
      cookieStore.delete(LOGIN_COOKIE_NAME)
      cookieStore.delete(LOGIN_COOKIE_NAME_CHAIN)

      return new Response('Login cookie deleted successfully', { status: 200 })
    }

    if (!userWalletAddress || !loginSignature || !chainId) {
      return new Response('Missing required fields', { status: 400 })
    }

    const isValidSignature = await checkLoginSignature({
      userWalletAddress,
      loginSignature,
      chainId,
    })

    if (!isValidSignature) {
      return new Response('Invalid login signature', { status: 401 })
    }
    const commonCookieOptions = {
      maxAge: LOGIN_COOKIE_MAX_AGE,
      httpOnly: LOGIN_COOKIE_HTTP_ONLY,
      secure: LOGIN_COOKIE_SECURE,
      path: LOGIN_COOKIE_PATH,
      sameSite: LOGIN_COOKIE_SAME_SITE,
    }

    // we set TWO COOKIES
    // one is for the signature itself
    // the other is for the chain ID which is needed to verify the signature later
    cookieStore.set({
      value: loginSignature,
      name: LOGIN_COOKIE_NAME,
      ...commonCookieOptions,
    })
    cookieStore.set({
      value: chainId,
      name: LOGIN_COOKIE_NAME_CHAIN,
      ...commonCookieOptions,
    })

    return new Response('Login cookie set successfully', { status: 200 })
  } catch (error) {
    return new Response('Invalid request body', { status: 400 })
  }
}
