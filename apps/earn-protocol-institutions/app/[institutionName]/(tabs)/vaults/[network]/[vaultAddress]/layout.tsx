import { type ReactNode } from 'react'
import {
  formatCryptoBalance,
  getHumanReadableFleetName,
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { getInstitutionData } from '@/app/server-handlers/institution/institution-data'
import { getInstitutionVaultFeeRevenueConfig } from '@/app/server-handlers/institution/institution-vault-fee-revenue-config'
import {
  getInstitutionVault,
  getInstitutionVaults,
} from '@/app/server-handlers/institution/institution-vaults'
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
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params
  const [institutionData, institutionVaults, institutionVault, institutionVaultFeeRevenueConfig] =
    await Promise.all([
      getInstitutionData(institutionName),
      getInstitutionVaults({ institutionName }),
      getInstitutionVault({
        institutionName,
        network: humanNetworktoSDKNetwork(network),
        vaultAddress,
      }),
      getInstitutionVaultFeeRevenueConfig({
        institutionName,
        network: humanNetworktoSDKNetwork(network),
        vaultAddress,
      }),
    ])

  if (!institutionName) {
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
  const vaultSelector = `${institutionVault.vault.id}-${subgraphNetworkToId(supportedSDKNetwork(institutionVault.vault.protocol.network))}`

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
            institutionName={institutionName}
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
          liveApy={
            institutionVaults.vaultsAdditionalInfo.vaultApyMap[vaultSelector].apyLive
              ? institutionVaults.vaultsAdditionalInfo.vaultApyMap[vaultSelector].apyLive / 100
              : undefined
          }
          nav={
            institutionVaults.vaultsAdditionalInfo.vaultSharePriceMap[vaultSelector]
              ? formatCryptoBalance(
                  institutionVaults.vaultsAdditionalInfo.vaultSharePriceMap[vaultSelector],
                )
              : 'n/a'
          }
          aum={aum}
          fee={(institutionVaultFeeRevenueConfig?.vaultFeeAmount.value.valueOf() ?? 0) / 100}
          inception={inception}
        />
      }
    >
      {children}
    </DashboardContentLayout>
  )
}
