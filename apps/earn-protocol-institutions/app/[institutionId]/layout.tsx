import { cookies } from 'next/headers'

import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { getWalletInstitutions } from '@/app/server-handlers/wallet-institutions'
import { InstitutionPageDataBlocks } from '@/components/layout/InstitutionPageDataBlocks/InstitutionPageDataBlocks'
import { InstitutionPageHeader } from '@/components/layout/InstitutionPageHeader/InstitutionPageHeader'
import { LOGIN_COOKIE_WALLET_NAME } from '@/constants/login-cookie'

import institutionMainLayoutStyles from './InstitutionMainLayout.module.css'

export default async function InstitutionMainLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ institutionId: string }>
}) {
  const [{ institutionId }, awaitedCookies] = await Promise.all([params, cookies()])
  const walletAddress = awaitedCookies.get(LOGIN_COOKIE_WALLET_NAME)?.value

  if (!walletAddress) {
    throw new Error('Wallet address is not available in cookies')
  }

  const institution = await getInstitutionData(institutionId)
  const walletInstitutionsList = await getWalletInstitutions(walletAddress)

  return (
    <div className={institutionMainLayoutStyles.institutionPageView}>
      <InstitutionPageHeader
        selectedInstitution={institution}
        institutionsList={walletInstitutionsList}
      />
      <InstitutionPageDataBlocks
        totalValue={institution.totalValue}
        numberOfVaults={institution.numberOfVaults}
        thirtyDayAvgApy={institution.thirtyDayAvgApy}
        allTimePerformance={institution.allTimePerformance}
      />
      {children}
    </div>
  )
}
