import { Suspense } from 'react'
import { getDisplayToken, isVaultAtLeastDaysOld } from '@summerfi/app-earn-ui'
import { type SupportedSDKNetworks } from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  humanNetworktoSDKNetwork,
  subgraphNetworkToId,
  supportedSDKNetwork,
  ten,
} from '@summerfi/app-utils'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'
import { type Metadata } from 'next'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { isAddress } from 'viem'

import { getCachedConfig } from '@/app/server-handlers/cached/get-config'
import { getCachedIsVaultDaoManaged } from '@/app/server-handlers/cached/get-vault-dao-managed'
import { getCachedVaultDetails } from '@/app/server-handlers/cached/get-vault-details'
import { getCachedVaultsApy } from '@/app/server-handlers/cached/get-vaults-apy'
import { getVaultOpenCoreData } from '@/app/server-handlers/vault-open/get-vault-open-core-data'
import { getVaultOpenCoreQueryKey } from '@/components/layout/VaultOpenView/vault-open-query-keys'
import { VaultOpenLoadingView } from '@/components/layout/VaultOpenView/VaultOpenLoadingView'
import { VaultOpenView } from '@/components/layout/VaultOpenView/VaultOpenView'
import { getServerQueryClient } from '@/helpers/get-server-query-client'
import { getSeoKeywords } from '@/helpers/seo-keywords'
import {
  decorateVaultsWithConfig,
  getVaultCuratedBy,
  getVaultIdByVaultCustomName,
} from '@/helpers/vault-custom-value-helpers'

type EarnVaultOpenPageProps = {
  params: Promise<{
    vaultId: string // could be vault address or the vault name
    network: SupportedSDKNetworks
  }>
}

const VaultOpenWithData = async ({
  network,
  vaultId,
  isRwaVault,
  vaultCurator,
}: {
  network: SupportedSDKNetworks
  vaultId: string
  isRwaVault: boolean
  vaultCurator?: string
}) => {
  const queryClient = getServerQueryClient()

  // Only the core (shell) is prefetched + hydrated so the header + deposit sidebar paint instantly
  // from the server cache. The heavier details island (charts, vault exposure, activity tables) is
  // intentionally left to its own client query, which streams it into the section skeletons after
  // the shell — see useVaultOpenDetailsQuery / VaultOpenDetailsLoading.
  await queryClient.prefetchQuery({
    queryKey: getVaultOpenCoreQueryKey(network, vaultId),
    queryFn: () => getVaultOpenCoreData({ network, vaultId }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VaultOpenView
        network={network}
        vaultId={vaultId}
        isRwaVault={isRwaVault}
        vaultCurator={vaultCurator}
      />
    </HydrationBoundary>
  )
}

const EarnVaultOpenPage = async ({ params }: EarnVaultOpenPageProps) => {
  const { network, vaultId } = await params

  // Cheap, cached resolution (mirrors generateMetadata) to detect RWA-curated vaults so they can be
  // redirected away (see below). The heavier data prefetch lives inside the Suspense boundary so the
  // skeleton streams immediately.
  const systemConfig = await getCachedConfig()
  const parsedNetworkId = subgraphNetworkToId(humanNetworktoSDKNetwork(network))
  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)
  const vaultCurator = parsedVaultId
    ? getVaultCuratedBy(parsedVaultId, parsedNetworkId, systemConfig)
    : false
  const isRwaVault = !!vaultCurator

  // RWA (permissioned) vaults have been removed from the earn app. They are still detected via the
  // curator config so a direct/bookmarked RWA vault URL redirects to the regular vaults list
  // instead of rendering.
  if (isRwaVault) {
    redirect('/')
  }

  return (
    <Suspense
      fallback={
        <VaultOpenLoadingView
          isRwaVault={isRwaVault}
          vaultCurator={typeof vaultCurator === 'string' ? vaultCurator : undefined}
        />
      }
    >
      <VaultOpenWithData
        network={network}
        vaultId={vaultId}
        isRwaVault={isRwaVault}
        vaultCurator={typeof vaultCurator === 'string' ? vaultCurator : undefined}
      />
    </Suspense>
  )
}

export async function generateMetadata({
  params,
  searchParams,
}: EarnVaultOpenPageProps & {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const [{ network: paramsNetwork, vaultId }, systemConfig, headersList, searchParamsAwaited] =
    await Promise.all([params, getCachedConfig(), headers(), searchParams])
  const parsedNetwork = humanNetworktoSDKNetwork(paramsNetwork)
  const parsedNetworkId = subgraphNetworkToId(parsedNetwork)
  const prodHost = headersList.get('host')
  const baseUrl = new URL(`https://${prodHost}`)

  const parsedVaultId = isAddress(vaultId)
    ? vaultId.toLowerCase()
    : getVaultIdByVaultCustomName(vaultId, String(parsedNetworkId), systemConfig)

  if (!parsedVaultId) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  // RWA vaults are redirected away by the page; skip the standard vault fetch for them here so
  // metadata generation doesn't waste a lookup (or resolve against the wrong, non-RWA handler).
  if (getVaultCuratedBy(parsedVaultId, parsedNetworkId, systemConfig)) {
    return {
      title: 'Lazy Summer Protocol',
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  const [vault] = await Promise.all([
    getCachedVaultDetails({
      vaultAddress: parsedVaultId,
      network: parsedNetwork,
    }),
  ])

  if (!vault) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  const isDaoManaged = await getCachedIsVaultDaoManaged({
    fleetAddress: vault.id,
    network: supportedSDKNetwork(vault.protocol.network),
  })

  const [vaultWithConfig] = decorateVaultsWithConfig({
    vaults: [vault],
    systemConfig,
    daoManagedVaultsList: isDaoManaged ? [vault.id as `0x${string}`] : [],
  })

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!vaultWithConfig) {
    return {
      title: `Lazy Summer Protocol - Vault not found`,
      openGraph: {
        siteName: 'Lazy Summer Protocol',
      },
      keywords: getSeoKeywords(),
    }
  }

  const [vaultsApyRaw] = await Promise.all([
    getCachedVaultsApy({
      fleets: [vaultWithConfig].map(({ id, protocol: { network } }) => ({
        fleetAddress: id,
        chainId: subgraphNetworkToId(supportedSDKNetwork(network)),
      })),
    }),
  ])

  const vaultApyData =
    vaultsApyRaw[
      `${vaultWithConfig.id}-${subgraphNetworkToId(supportedSDKNetwork(vaultWithConfig.protocol.network))}`
    ]

  const totalValueLockedTokenParsed = formatCryptoBalance(
    new BigNumber(vault.inputTokenBalance.toString()).div(ten.pow(vault.inputToken.decimals)),
  )

  const isVaultAtLeast30dOld = isVaultAtLeastDaysOld({ vault: vaultWithConfig, days: 30 })

  const apy30d = isVaultAtLeast30dOld
    ? vaultApyData.sma30d
      ? formatDecimalAsPercent(vaultApyData.sma30d, { noPercentSign: true })
      : 'n/a'
    : 'New'

  let ogImageUrl = ''

  if (typeof searchParamsAwaited.game !== 'undefined') {
    ogImageUrl = `${baseUrl}earn/img/misc/yield_racer.png`
  } else {
    ogImageUrl = `${baseUrl}earn/api/og/vault?tvl=${totalValueLockedTokenParsed}&apy30d=${apy30d}&token=${vaultWithConfig.inputToken.symbol}`
  }

  return {
    title: `Lazy Summer Protocol - ${getDisplayToken(vault.inputToken.symbol)} on ${capitalize(paramsNetwork)}, $${totalValueLockedTokenParsed} TVL`,
    openGraph: {
      siteName: 'Lazy Summer Protocol',
      images: ogImageUrl,
    },
    keywords: getSeoKeywords(),
  }
}

export default EarnVaultOpenPage
