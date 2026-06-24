import { Text } from '@summerfi/app-earn-ui'
import { humanNetworktoSDKNetwork, subgraphNetworkToId } from '@summerfi/app-utils'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedInstitutionBasicData,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { PanelOverview } from '@/features/panels/vaults/components/PanelOverview/PanelOverview'
import { getInstiVaultNiceName } from '@/helpers/get-insti-vault-nice-name'
import { getVaultConfigCustomFields } from '@/helpers/rwa'

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

  return (
    <PanelOverview
      vaultAddress={parsedVaultAddress}
      summerVaultName={summerVaultName}
      institutionBasicData={institutionBasicData}
      institutionName={institutionName}
      network={network}
    />
  )
}
