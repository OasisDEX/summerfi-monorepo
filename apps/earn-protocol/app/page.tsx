import { getVaultsProtocolsList, sumrNetApyConfigCookieName } from '@summerfi/app-earn-ui'
import {
  formatCryptoBalance,
  getServerSideCookies,
  networkNameToSDKId,
  parseServerResponseToClient,
  safeParseJson,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { cookies, headers } from 'next/headers'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedTvl } from '@/app/server-handlers/cached/get-tvl'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getCachedVaultsInfo } from '@/app/server-handlers/cached/get-vaults-info'
import { getCachedVaultsList } from '@/app/server-handlers/cached/get-vaults-list'
import {
  emptyWalletAssets,
  getCachedWalletAssets,
} from '@/app/server-handlers/cached/get-wallet-assets'
import { getCachedSumrPrice } from '@/app/server-handlers/sumr-price'
import { VaultListViewComponent } from '@/components/layout/VaultsListView/VaultListViewComponent'
import { getEstimatedSumrPrice } from '@/helpers/get-estimated-sumr-price'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import { decorateVaultsWithConfig } from '@/helpers/vault-custom-value-helpers'

const EarnAllVaultsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ walletAddress?: string }>
}) => {
  const { walletAddress } = await searchParams
  const [cookieRaw, { vaults }, configRaw, vaultsInfoRaw, sumrPrice, tvl, walletAssets] =
    await Promise.all([
      cookies(),
      getCachedVaultsList(),
      getCachedConfig(),
      getCachedVaultsInfo(),
      getCachedSumrPrice(),
      getCachedTvl(),
      walletAddress
        ? getCachedWalletAssets(walletAddress, true)
        : Promise.resolve(emptyWalletAssets),
    ])

  const systemConfig = parseServerResponseToClient(configRaw)

  const vaultsWithConfig = decorateVaultsWithConfig({
    systemConfig,
    vaults,
  })

  const daoManagedVaultsList = (
    await Promise.all(
      vaultsWithConfig.map(async (vault) => {
        const isDaoManaged = await getCachedIsVaultDaoManaged({
          fleetAddress: vault.id,
          network: supportedSDKNetwork(vault.protocol.network),
        })

        return isDaoManaged ? vault.id : false
      }),
    )
  ).filter(Boolean) as `0x${string}`[]

  const filteredWalletAssetsVaults = walletAddress
    ? vaultsWithConfig.filter((vault) => {
        return walletAssets.assets.some(
          (asset) =>
            asset.symbol.toLowerCase() === vault.inputToken.symbol.toLowerCase() &&
            networkNameToSDKId(asset.network) ===
              subgraphNetworkToSDKId(supportedSDKNetwork(vault.protocol.network)),
        )
      })
    : vaultsWithConfig

  const [vaultsApyByNetworkMap] = await Promise.all([
    getCachedVaultsApy({
      fleets: vaultsWithConfig.map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const vaultsInfo = parseServerResponseToClient(vaultsInfoRaw)
  const cookie = cookieRaw.toString()
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const sumrPriceUsd = getEstimatedSumrPrice({
    config: systemConfig,
    sumrPrice,
    sumrNetApyConfig: sumrNetApyConfig ?? {},
  })

  return (
    <VaultListViewComponent
      vaultsApyByNetworkMap={vaultsApyByNetworkMap}
      vaultsInfo={vaultsInfo}
      vaultsList={vaultsWithConfig}
      filteredWalletAssetsVaults={filteredWalletAssetsVaults}
      sumrPriceUsd={sumrPriceUsd}
      tvl={tvl}
      daoManagedVaultsList={daoManagedVaultsList}
    />
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const [{ vaults }, headersList, params, tvl] = await Promise.all([
    getCachedVaultsList(),
    headers(),
    searchParams,
    getCachedTvl(),
  ])
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const tvlFormatted = formatCryptoBalance(tvl)
  const { allVaultsProtocols: protocolsSupported } = getVaultsProtocolsList(vaults)

  let ogImageUrl = ''

  if (typeof params.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vaults-list?tvl=${tvlFormatted}&protocols=${protocolsSupported.length}`
  }

  return {
    title: `Lazy Summer Protocol - $${tvlFormatted} TVL with ${protocolsSupported.length} protocols supported`,
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
