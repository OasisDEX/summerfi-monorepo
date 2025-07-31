import { cookies } from 'next/headers'

import { LOGIN_COOKIE_SIGNATURE_NAME, LOGIN_COOKIE_WALLET_NAME } from '@/constants/login-cookie'

export const getUserCookies = async () => {
  const cookiesData = await cookies()
  const signatureCookie = cookiesData.get(LOGIN_COOKIE_SIGNATURE_NAME)?.value
  const walletCookie = cookiesData.get(LOGIN_COOKIE_WALLET_NAME)?.value

  return {
    signatureCookie,
    walletCookie,
  }
}
