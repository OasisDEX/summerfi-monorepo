'use client'

import { type FC } from 'react'
import {
  type ArksHistoricalChartData,
  type InterestRates,
  type SDKVaultishType,
  type SDKVaultsListType,
  type VaultApyData,
} from '@summerfi/app-types'

import { VaultDetailsFaq } from '@/features/vault-details/components/VaultDetailsFaq/VaultDetailsFaq'
import { VaultDetailsHowItWorks } from '@/features/vault-details/components/VaultDetailsHowItWorks/VaultDetailsHowItWorks'
import { VaultDetailsSecurity } from '@/features/vault-details/components/VaultDetailsSecurity/VaultDetailsSecurity'
import { VaultDetailsYields } from '@/features/vault-details/components/VaultDetailsYields/VaultDetailsYields'

interface VaultDetailsViewProps {
  arksHistoricalChartData: ArksHistoricalChartData
  summerVaultName: string
  vault: SDKVaultishType
  vaults: SDKVaultsListType
  arksInterestRates: InterestRates
  totalRebalanceActions: number
  totalUsers: number
  vaultApyData: VaultApyData
}

export const VaultDetailsView: FC<VaultDetailsViewProps> = ({
  arksHistoricalChartData,
  summerVaultName,
  vault,
  vaults,
  arksInterestRates,
  totalRebalanceActions,
  totalUsers,
  vaultApyData,
}) => {
  return (
    <>
      <VaultDetailsHowItWorks />
      <VaultDetailsYields
        arksHistoricalChartData={arksHistoricalChartData}
        summerVaultName={summerVaultName}
        vault={vault}
        arksInterestRates={arksInterestRates}
        vaultApyData={vaultApyData}
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
