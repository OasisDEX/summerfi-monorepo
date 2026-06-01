'use client'
import { type FC } from 'react'
import { type SDKVaultishType, type SupportedSDKNetworks } from '@summerfi/app-types'

import { useVaultDetailsContentQuery } from '@/components/layout/VaultDetailsView/useVaultDetailsQuery'
import { VaultDetailsContentLoading } from '@/components/layout/VaultDetailsView/VaultDetailsContentLoading'
import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurity } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurity'
import { VaultDetailsYields } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYields'

interface VaultDetailsContentProps {
  network: SupportedSDKNetworks
  vaultId: string
  vault: SDKVaultishType
}

export const VaultDetailsContent: FC<VaultDetailsContentProps> = ({ network, vaultId, vault }) => {
  // Below-the-fold sections stream in independently of the page shell: hydrated on first render,
  // or fetched via the API route fallback (showing VaultDetailsContentLoading) if the prefetch
  // failed to dehydrate. HowItWorks + FAQ only need `vault`, so they render straight away.
  const { data: content } = useVaultDetailsContentQuery(network, vaultId)

  return (
    <>
      <VaultDetailsHowItWorks vault={vault} />
      {content ? (
        <>
          <VaultDetailsYields
            arksHistoricalChartData={content.arksHistoricalChartData}
            summerVaultName={content.summerVaultName}
            vault={vault}
            arksInterestRates={content.arksInterestRates}
            vaultApyData={content.vaultApyData}
          />
          <VaultDetailsSecurity
            vault={vault}
            totalRebalanceActions={content.totalRebalanceActions}
            totalUsers={content.totalUsers}
            tvl={content.tvl}
          />
        </>
      ) : (
        <VaultDetailsContentLoading />
      )}
      <VaultDetailsFaq />
    </>
  )
}
