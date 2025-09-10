import { type ReactNode } from 'react'
import {
  getHumanReadableFleetName,
  humanNetworktoSDKNetwork,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { getInstitutionData } from '@/app/server-handlers/institution-data'
import { getInstitutionVault, getInstitutionVaults } from '@/app/server-handlers/institution-vaults'
import { DashboardContentLayout } from '@/components/layout/DashboardContentLayout/DashboardContentLayout'
import { VaultsDropdownWrapper } from '@/components/layout/VaultsDropdownWrapper/VaultsDropdownWrapper'
import { VaultsPanelNavigationWrapper } from '@/components/layout/VaultsPanelNavigationWrapper/VaultsPanelNavigationWrapper'
import { DashboardVaultHeader } from '@/features/dashboard/components/DashboardVaultHeader/DashboardVaultHeader'

import institutionVaultLayoutStyles from './InstitutionVaultLayout.module.css'

export default async function InstitutionVaultLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, vaultAddress, network } = await params
  const [institutionData, institutionVaults, institutionVault] = await Promise.all([
    getInstitutionData(institutionId),
    getInstitutionVaults({ institutionId }),
    getInstitutionVault({
      institutionId,
      network: humanNetworktoSDKNetwork(network),
      vaultAddress,
    }),
  ])

  if (!institutionId) {
    return <div>Institution ID not provided.</div>
  }

  if (!vaultAddress) {
    return <div>Vault ID not provided.</div>
  }

  if (!institutionData) {
    return <div>Institution not found.</div>
  }

  if (!institutionVaults) {
    return <div>No vaults available for this institution.</div>
  }

  if (!institutionVault?.vault) {
    return <div>Vault not found.</div>
  }

  const inception = Number(Number(institutionVault.vault.createdTimestamp) * 1000)
  const aum = new BigNumber(institutionVault.vault.inputTokenBalance.toString())
    .div(ten.pow(institutionVault.vault.inputToken.decimals))
    .toNumber()

  return (
    <DashboardContentLayout
      panel={
        <div className={institutionVaultLayoutStyles.dashboardVaultsPanelWrapper}>
          <VaultsDropdownWrapper
            institution={institutionData}
            vaults={institutionVaults.vaults}
            selectedVault={institutionVault.vault}
          />
          <VaultsPanelNavigationWrapper
            institutionId={institutionId}
            selectedVault={institutionVault.vault}
          />
        </div>
      }
      header={
        <DashboardVaultHeader
          vaultName={getHumanReadableFleetName(
            supportedSDKNetwork(institutionVault.vault.protocol.network),
            institutionVault.vault.name,
          )}
          asset={institutionVault.vault.inputToken.symbol}
          nav={0}
          aum={aum}
          fee={0}
          inception={inception}
        />
      }
    >
      {children}
    </DashboardContentLayout>
  )
}
