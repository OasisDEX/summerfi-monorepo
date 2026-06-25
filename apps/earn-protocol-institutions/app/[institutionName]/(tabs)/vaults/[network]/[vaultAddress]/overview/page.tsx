import { type ReactNode } from 'react'
import { Text } from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionBasicData,
  getCachedInstitutionVault,
  getCachedInstitutionVaultFleetFees,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'
import { PanelRwaMonitoring } from '@/features/panels/vaults/components/PanelRwaMonitoring/PanelRwaMonitoring'
import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'
import {
  getRwaClientIdForVault,
  getVaultConfigCustomFields,
  urlNetworkToChainId,
} from '@/helpers/rwa'

export default async function InstitutionVaultOverviewPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedVaultAddress = vaultAddress.toLowerCase()

  if (!isAddress(vaultAddress)) {
    redirect('/not-found')
  }

  // Core / above-the-fold only: the vault name + the contracts table. The NAV / AUM / ARK charts
  // (which need four heavy fetches) are deferred to a scroll-gated client query inside PanelOverview.
  const [vault, institutionBasicData, config] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
    getCachedInstitutionBasicData({
      institutionName,
      network: parsedNetwork,
    }),
    getCachedConfig(),
  ])

  if (!vault) {
    return (
      <Text>
        No vault found with the id {parsedVaultAddress} on the network {parsedNetwork}
      </Text>
    )
  }

  // `getVaultDetails` returns the raw (undecorated) vault, so resolve the configured display name
  // straight from the fleet config by address.
  const customName = getVaultConfigCustomFields({
    systemConfig: config,
    networkId: subgraphNetworkToId(parsedNetwork),
    vaultAddress: parsedVaultAddress,
  })?.name

  const summerVaultName = getInstiVaultNiceName({
    network: parsedNetwork,
    symbol: vault.inputToken.symbol,
    institutionName,
    customName,
  })

  // RWA vaults gain the former "RWA monitoring" tab's content at the bottom of the overview.
  // Standard vaults resolve no clientId, so this stays null and only the overview renders.
  const chainId = urlNetworkToChainId(network)
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: chainId,
    vaultAddress,
  })

  let rwaMonitoring: ReactNode = null

  if (rwaClientId) {
    const [rwaVault, fleetFees] = await Promise.all([
      getCachedInstitutionVault({ institutionName, network: parsedNetwork, vaultAddress }),
      getCachedInstitutionVaultFleetFees({ institutionName, network: parsedNetwork, vaultAddress }),
    ])
    const rwaVaultData = rwaVault?.vault
    const customFields = rwaVaultData?.customFields

    rwaMonitoring = (
      <ClientSideSdkWrapper>
        <PanelRwaMonitoring
          clientId={rwaClientId}
          vaultAddress={vaultAddress}
          network={network as NetworkNames}
          curatorName={customFields?.vaultCurator}
          curatorDescription={customFields?.vaultCuratorDescription}
          factSheetUrl={customFields?.vaultFactSheetUrl}
          navApy30d={rwaVaultData?.navApy30d}
          navApy30dPartialDays={rwaVaultData?.navApy30dPartialDays}
          navPriceChange24h={rwaVaultData?.navPriceChange24h}
          managementFee={fleetFees.managementFee}
          performanceFee={fleetFees.performanceFee}
        />
      </ClientSideSdkWrapper>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <PanelOverview
        vaultAddress={parsedVaultAddress}
        summerVaultName={summerVaultName}
        institutionBasicData={institutionBasicData}
        institutionName={institutionName}
        network={network}
      />
      {rwaMonitoring}
    </div>
  )
}
