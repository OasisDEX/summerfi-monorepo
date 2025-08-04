import { redirect } from 'next/navigation'

import { getWalletInstitutions } from '@/app/server-handlers/wallet-institutions'
import { InstitutionsLoginPageClient } from '@/components/layout/LoginPage/LoginPageClient'
import { getUserCookies } from '@/helpers/get-user-cookies'

export const InstitutionsPageServer = async () => {
  const { signatureCookie, walletCookie } = await getUserCookies()

  if (signatureCookie && typeof walletCookie === 'undefined') {
    throw new Error('Wallet cookie is required when signature cookie is present')
  }

  if (signatureCookie && walletCookie) {
    // If both cookies are present, we assume the user is logged in
    // and we can fetch the default institution data
    const institutionsList = await getWalletInstitutions(walletCookie)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!institutionsList || institutionsList.length === 0) {
      throw new Error('No institutions found for the provided wallet')
    }

    const [defaultWalletInstitution] = institutionsList

    // redirect to the default institution page
    redirect(`/${defaultWalletInstitution.id}/overview`)
  }

  return <InstitutionsLoginPageClient signatureCookie={signatureCookie} />
}
