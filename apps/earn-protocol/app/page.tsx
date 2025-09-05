import {
  getVaultsProtocolsList,
  REVALIDATION_TAGS,
  REVALIDATION_TIMES,
} from '@summerfi/app-earn-ui'
import { configEarnAppFetcher, getVaultsApy, getVaultsInfo } from '@summerfi/app-server-handlers'
import {
  formatCryptoBalance,
  parseServerResponseToClient,
  subgraphNetworkToId,
  supportedSDKNetwork,
  zero,
} from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'
import { headers } from 'next/headers'

import { getVaultsList } from '@/app/server-handlers/sdk/get-vaults-list'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const EarnAllVaultsPage = async () => {
  const [{ vaults }, configRaw, vaultsInfoRaw] = await Promise.all([
    getVaultsList(),
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
    })(),
    unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
      revalidate: REVALIDATION_TIMES.VAULTS_LIST,
    })(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const [vaultsApyByNetworkMap] = await Promise.all([
    getVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const vaultsInfo = parseServerResponseToClient(vaultsInfoRaw)

  return (
    <VaultListViewComponent
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      vaultsList={vaultsWithConfig}
      vaultsInfo={vaultsInfo}
    />
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [{ vaults }, headersList, params] = await Promise.all([
    getVaultsList(),
    headers(),
    searchParams,
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const tvl = formatCryptoBalance(
    vaults.reduce((acc, vault) => acc.plus(vault.totalValueLockedUSD), zero),
  )
  const protocolsSupported = getVaultsProtocolsList(vaults)

  let ogImageUrl = ''

  if (typeof params.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vaults-list?tvl=${tvl}&protocols=${protocolsSupported.length}`
  }

  return {
    title: `Lazy Summer Protocol - $${tvl} TVL with ${protocolsSupported.length} protocols supported`,
    description:
      "Get effortless access to crypto's best DeFi yields. Continually rebalanced by AI powered Keepers to earn you more while saving you time and reducing costs.",
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
    keywords: getSeoKeywords(),
  }
}

export default EarnAllVaultsPage
