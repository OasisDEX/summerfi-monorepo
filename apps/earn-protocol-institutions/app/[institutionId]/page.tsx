import { redirect } from 'next/navigation'

import { checkLoginSignature } from '@/app/server-handlers/check-login-signature'
import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { InstitutionPageView } from '@/components/layout/InstitutionPageView/InstitutionPageView'
import { getUserCookies } from '@/helpers/get-user-cookies'

const InstitutionPage = async ({ params }: { params: { institutionId: string } }) => {
  const { institutionId } = await params
  const { signatureCookie, walletCookie } = await getUserCookies()
  const isLoggedIn = await checkLoginSignature({
    userWalletAddress: walletCookie,
    loginSignature: signatureCookie,
  })

  if (!isLoggedIn) {
    // If the user is not logged in, redirect to the login page
    return redirect('/')
  }

  const institution = await getInstitutionData(institutionId)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!institution) {
    return redirect('/not-found')
  }

  return (
    <InstitutionPageView
      institutionName={institution.institutionName}
      totalValue={institution.totalValue}
      numberOfVaults={institution.numberOfVaults}
      thirtyDayAvgApy={institution.thirtyDayAvgApy}
      allTimePerformance={institution.allTimePerformance}
      vaultData={institution.vaultData}
    />
  )
}

export default InstitutionPage
