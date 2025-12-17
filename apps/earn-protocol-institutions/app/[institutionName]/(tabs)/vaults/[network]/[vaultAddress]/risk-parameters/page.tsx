import { configEarnAppFetcher } from '@summerfi/app-server-handlers'
import { type NetworkNames } from '@summerfi/app-types'
import { decorateWithFleetConfig, humanNetworktoSDKNetwork } from '@summerfi/app-utils'
import { unstable_cache as unstableCache } from 'next/cache'

import { getInstitutionVaultArksImpliedCapsMap } from '@/app/server-handlers/institution/institution-vaults'
import { getVaultDetails } from '@/app/server-handlers/sdk/get-vault-details'
import { ClientSideSdkWrapper } from '@/components/organisms/ClientSideSDKWrapper/ClientSideSDKWrapper'
import { INSTITUTIONS_CACHE_TAGS, INSTITUTIONS_CACHE_TIMES } from '@/constants/revalidation'
import { PanelRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters'

export default async function InstitutionVaultRiskParametersPage({
  params,
}: {
  params: Promise<{ institutionName: string; vaultAddress: string; network: NetworkNames }>
}) {
  const { institutionName, vaultAddress, network } = await params

  const parsedNetwork = humanNetworktoSDKNetwork(network)

  const cacheConfig = {
    revalidate: INSTITUTIONS_CACHE_TIMES.VAULT_DETAILS,
    tags: [
      INSTITUTIONS_CACHE_TAGS.VAULT_DETAILS,
      `vault-details-${institutionName}-${vaultAddress}`,
    ],
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
    unstableCache(configEarnAppFetcher, [], {
      revalidate: INSTITUTIONS_CACHE_TIMES.CONFIG,
      tags: [INSTITUTIONS_CACHE_TAGS.CONFIG],
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

  return (
    <ClientSideSdkWrapper>
      <PanelRiskParameters
        vault={vaultWithConfig}
        arksImpliedCapsMap={arksImpliedCapsMap}
        network={network}
        institutionName={institutionName}
      />
    </ClientSideSdkWrapper>
  )
}
