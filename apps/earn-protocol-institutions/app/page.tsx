import { cookies } from 'next/headers'

import { InstitutionsLoginPageClient } from '@/components/layout/LoginPage/LoginPageClient'
import { LOGIN_COOKIE_NAME } from '@/constants/login-cookie'

const InstitutionsPageServer = async () => {
  const loginCookie = (await cookies()).get(LOGIN_COOKIE_NAME)?.value

  return <InstitutionsLoginPageClient loginCookie={loginCookie} />
}

export default InstitutionsPageServer
