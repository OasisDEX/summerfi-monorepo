import { SUMR_CAP, type SumrNetApyConfig } from '@summerfi/app-earn-ui'
import { type EarnAppConfigType, type TokenPriceData } from '@summerfi/app-types'

import { defaultSumrMarketCap } from '@/helpers/sumr-market-cap'

export const getEstimatedSumrPrice = ({
  config,
  sumrPrice,
  sumrNetApyConfig,
}: {
  config: Partial<EarnAppConfigType>
  sumrPrice: TokenPriceData['usd']
  sumrNetApyConfig: Partial<SumrNetApyConfig>
}) => {
  const isSumrPriceEnabled = config.features?.UseSumrCoingeckoPrice ?? false

  const estimatedSumrPrice = isSumrPriceEnabled
    ? sumrPrice
    : Number(sumrNetApyConfig.dilutedValuation ?? defaultSumrMarketCap) / SUMR_CAP

  return estimatedSumrPrice
}
