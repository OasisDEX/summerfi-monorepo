import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { decorateWithFleetConfig, humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionVaultArksImpliedCapsMap } from '@/app/server-handlers/institution/institution-vaults'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { PanelRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters'

export default async function InstitutionVaultRiskParametersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: string }>
}) {
  const { institutionName, vaultAddress, network } = await params

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
      institutionName,
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

  const [vaultWithConfig] = decorateWithFleetConfig([vault], config)

  const arksImpliedCapsMap = await unstableCache(
    getInstitutionVaultArksImpliedCapsMap,
    [institutionName, vaultAddress, parsedNetwork],
    cacheConfig,
  )({
    network: parsedNetwork,
    arksAddresses: vaultWithConfig.arks.map((ark) => ark.id),
    fleetCommanderAddress: vaultWithConfig.id,
  })

  return <PanelRiskParameters vault={vaultWithConfig} arksImpliedCapsMap={arksImpliedCapsMap} />
}
