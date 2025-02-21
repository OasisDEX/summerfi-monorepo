import { type FC } from 'react'
import { type SDKNetwork } from '@summerfi/app-types'
import { redirect } from 'next/navigation'

interface EarnVaultDetailsPageProps {
  params: Promise<{
    network: SDKNetwork
    vaultId: string
  }>
}

const EarnVaultDetailsPage: FC<EarnVaultDetailsPageProps> = () => {
  return redirect('/sumr')
}

export default EarnVaultDetailsPage
