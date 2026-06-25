import { getArksInterestRates, getVaultsApy } from '@summerfi/app-server-handlers'
import {
  decorateWithFleetConfig,
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCachedConfig } from '@/app/server-handlers/config'
import {
  getCachedArksDeployedOnChain,
  getCachedVaultDetails,
} from '@/app/server-handlers/institution/institution-vaults'
import { INSTITUTIONS_CACHE_TAGS, INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'
import { PanelVaultExposure } from '@/features/panels/vaults/components/PanelVaultExposure/PanelVaultExposure'
import { getRwaClientIdForVault, urlNetworkToChainId } from '@/helpers/rwa'

export default async function InstitutionVaultVaultExposurePage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)
  const parsedVaultAddress = vaultAddress.toLowerCase()

  const cacheConfig = {
    revalidate: INSTITUTIONS_CACHE_TIMES.VAULT_DETAILS,
    tags: [
      INSTITUTIONS_CACHE_TAGS.VAULT_DETAILS,
      `vault-details-${institutionName.toLowerCase()}-${parsedVaultAddress}`,
    ],
  }

  // Standard fleet-management tab — not applicable to RWA vaults (no multi-ark allocation). Bounce an
  // RWA vault (resolved from config by address) to its overview.
  const config = await getCachedConfig()
  const rwaClientId = getRwaClientIdForVault({
    systemConfig: config,
    networkId: urlNetworkToChainId(network),
    vaultAddress,
  })

  if (rwaClientId) {
    redirect(`/${institutionName}/vaults/${network}/${vaultAddress}/overview`)
  }

  const [vault, arksDeployedOnChain] = await Promise.all([
    getCachedVaultDetails({
      institutionName,
      vaultAddress: parsedVaultAddress,
      network: parsedNetwork,
    }),
    getCachedArksDeployedOnChain({ network: parsedNetwork }),
  ])

  if (!vault) {
    return <div>Vault not found</div>
  }

  const vaultWithConfig = decorateWithFleetConfig([vault], config)

  const [arkInterestRates, vaultsApyRaw] = await Promise.all([
    vault.arks.length
      ? getArksInterestRates({
          network: parsedNetwork,
          arksList: [...vault.arks, ...(arksDeployedOnChain as unknown as typeof vault.arks)],
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
      arksDeployedOnChain={arksDeployedOnChain}
    />
  )
}
