'use client'

import { useCallback, useEffect, useState } from 'react'
import { formatPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'

import { MAX_MULTIPLE } from '@/constants/sumr-staking-v2'
import { useAppSDK } from '@/hooks/use-app-sdk'

export const useSumrStakingRewards = (sumrPriceUsd: number) => {
  const sdk = useAppSDK()
  const [maxApy, setMaxApy] = useState<number>(0)
  const [sumrRewardApy, setSumrRewardApy] = useState<string | undefined>()
  const [isLoadingRewardRates, setIsLoadingRewardRates] = useState<boolean>(true)

  const fetchStakingData = useCallback(async () => {
    try {
      setIsLoadingRewardRates(true)
      // Fetch all data in parallel
      const [rewardRates] = await Promise.all([
        sdk.getStakingRewardRatesV2({
          sumrPriceUsd,
        }),
      ])

      setMaxApy(rewardRates.maxApy.value)
      const summerRewardApyValue = formatPercent(
        new BigNumber(rewardRates.summerRewardYield.value).times(MAX_MULTIPLE),
        {
          precision: 2,
        },
      )

      setSumrRewardApy(summerRewardApyValue)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to fetch staking data:', error)
    } finally {
      setIsLoadingRewardRates(false)
    }
  }, [sdk, sumrPriceUsd])

  // Fetch all staking data on mount
  useEffect(() => {
    void fetchStakingData()
  }, [fetchStakingData])

  return { maxApy, sumrRewardApy, isLoadingRewardRates }
}
