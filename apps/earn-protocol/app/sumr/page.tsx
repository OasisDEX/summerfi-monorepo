import { REVALIDATION_TAGS, REVALIDATION_TIMES } from '@summerfi/app-earn-ui'
import { configEarnAppFetcher, getVaultsInfo } from '@summerfi/app-server-handlers'
import { parseServerResponseToClient } from '@summerfi/app-utils'
import { type Metadata } from 'next'
import { unstable_cache as unstableCache } from 'next/cache'

import { SumrPageView } from '@/components/layout/SumrPageView/SumrPageView'
import { SumrV2PageView } from '@/components/layout/SumrV2PageView/SumrV2PageView'

const SumrPage = async () => {
  const [configRaw, vaultsInfo] = await Promise.all([
    unstableCache(configEarnAppFetcher, [REVALIDATION_TAGS.CONFIG], {
      revalidate: REVALIDATION_TIMES.CONFIG,
      tags: [REVALIDATION_TAGS.CONFIG],
    })(),
    unstableCache(getVaultsInfo, [REVALIDATION_TAGS.VAULTS_LIST], {
      revalidate: REVALIDATION_TIMES.VAULTS_LIST,
      tags: [REVALIDATION_TAGS.VAULTS_LIST],
    })(),
  ])
  const systemConfig = parseServerResponseToClient(configRaw)
  const apyRanges: {
    eth: { minApy: number; maxApy: number }
    stablecoins: { minApy: number; maxApy: number }
  } = vaultsInfo.reduce(
    (ranges, vault) => {
      const isEthVault = vault.assetToken.symbol === 'ETH' || vault.assetToken.symbol === 'WETH'
      const apy = Number(vault.apy?.value.toString() ?? '0')

      if (isEthVault) {
        ranges.eth.minApy = Math.min(ranges.eth.minApy === 0 ? apy : ranges.eth.minApy, apy)
        ranges.eth.maxApy = Math.max(ranges.eth.maxApy, apy)
      } else {
        ranges.stablecoins.minApy = Math.min(
          ranges.stablecoins.minApy === 0 ? apy : ranges.stablecoins.minApy,
          apy,
        )
        ranges.stablecoins.maxApy = Math.max(ranges.stablecoins.maxApy, apy)
      }

      return ranges
    },
    {
      eth: { minApy: 0, maxApy: 0 },
      stablecoins: { minApy: 0, maxApy: 0 },
    },
  )

  const sumrRewards: {
    eth: number
    stablecoins: number
  } = vaultsInfo.reduce(
    (rewards, vault) => {
      const isEthVault = vault.assetToken.symbol === 'ETH' || vault.assetToken.symbol === 'WETH'
      const sumrApy = vault.rewardsApys?.find((reward) => reward.token.symbol === 'SUMR')?.apy
        ? Number(vault.rewardsApys.find((reward) => reward.token.symbol === 'SUMR')?.apy?.value)
        : 0

      if (isEthVault) {
        rewards.eth = Math.max(rewards.eth, sumrApy)
      } else {
        rewards.stablecoins = Math.max(rewards.stablecoins, sumrApy)
      }

      return rewards
    },
    {
      eth: 0,
      stablecoins: 0,
    },
  )

  return systemConfig.features?.StakingV2 ? (
    <SumrV2PageView apyRanges={apyRanges} sumrRewards={sumrRewards} />
  ) : (
    <SumrPageView />
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Lazy Summer Protocol - $SUMR Token`,
    description:
      'Check if you are eligible for $SUMR - the token that powers DeFi’s best yield optimizer.',
  }
}

export default SumrPage
