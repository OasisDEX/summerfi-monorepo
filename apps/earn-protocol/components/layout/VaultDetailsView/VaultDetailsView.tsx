'use client'

import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type SDKVaultishType,
  type SDKVaultsListType,
} from '@summerfi/app-types'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurity } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurity'
import { VaultDetailsYields } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYields'

interface VaultDetailsViewProps {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  arksInterestRates: GetInterestRatesReturnType
  totalRebalanceActions: number
  totalUsers: number
}

export const VaultDetailsView: FC<VaultDetailsViewProps> = ({
  arksHistoricalChartData,
  summerVaultName,
  vault,
  vaults,
  arksInterestRates,
  totalRebalanceActions,
  totalUsers,
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
      <VaultDetailsSecurity
        vault={vault}
        vaults={vaults}
        totalRebalanceActions={totalRebalanceActions}
        totalUsers={totalUsers}
      />
      <VaultDetailsFaq />
    </>
  )
}
