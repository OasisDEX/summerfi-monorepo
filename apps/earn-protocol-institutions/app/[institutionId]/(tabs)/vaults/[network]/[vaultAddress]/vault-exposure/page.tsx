import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import {
  configEarnAppFetcher,
  getArksInterestRates,
  getVaultsApy,
} from '@summerfi/app-server-handlers'
import {
  decorateWithFleetConfig,
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { PanelVaultExposure } from '@/features/panels/vaults/components/PanelVaultExposure/PanelVaultExposure'

export default async function InstitutionVaultVaultExposurePage({
  params,
}: {
  params: Promise<{ institutionId: string; vaultAddress: string; network: string }>
}) {
  const { institutionId, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  // tags yet to be determined
  const cacheConfig = {
    revalidate: REVALIDATION_TIMES.PORTFOLIO_DATA,
    tags: [REVALIDATION_TAGS.PORTFOLIO_DATA, parsedNetwork],
  }

  const [vault, config] = await Promise.all([
    unstableCache(
      getVaultDetails,
      [parsedNetwork],
      cacheConfig,
    )({
      institutionID: institutionId,
      vaultAddress,
      network: parsedNetwork,
    }),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
  ])

  if (!vault) {
    return <div>Vault not found</div>
  }

  const vaultWithConfig = decorateWithFleetConfig([vault], config)

  const [arkInterestRates, vaultsApyRaw] = await Promise.all([
    vault.arks.length
      ? unstableCache(
          getArksInterestRates,
          [parsedNetwork],
          cacheConfig,
        )({
          network: parsedNetwork,
          arksList: vault.arks,
        })
      : Promise.resolve({}),
    unstableCache(
      getVaultsApy,
      [parsedNetwork],
      cacheConfig,
    )({
      fleets: vaultWithConfig.map(({ id, protocol: { network: vaultNetwork } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(vaultNetwork)),
      })),
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[`${vault.id}-${subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network))}`]

  return (
    <PanelVaultExposure
      vault={vault}
      arkInterestRates={arkInterestRates}
      vaultApyData={vaultApyData}
    />
  )
}
