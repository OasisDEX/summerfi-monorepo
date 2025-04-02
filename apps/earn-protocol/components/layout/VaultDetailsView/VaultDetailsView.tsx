'use client'

import { type FC } from 'react'
import { type ArksHistoricalChartData, type SDKVaultishType } from '@summerfi/app-types'

import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurity } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurity'
import { VaultDetailsYields } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYields'

interface VaultDetailsViewProps {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  arksInterestRates: { [key: string]: number }
}

export const VaultDetailsView: FC<VaultDetailsViewProps> = ({
  arksHistoricalChartData,
  summerVaultName,
  vault,
  arksInterestRates,
}) => {
  return (
    <>
      <VaultDetailsHowItWorks />
      <VaultDetailsYields
        arksHistoricalChartData={arksHistoricalChartData}
        summerVaultName={summerVaultName}
        vault={vault}
        arksInterestRates={arksInterestRates}
      />
      <VaultDetailsSecurity />
      <VaultDetailsFaq />
    </>
  )
}
