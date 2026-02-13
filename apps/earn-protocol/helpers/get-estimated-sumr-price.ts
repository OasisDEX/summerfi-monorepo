import { SUMR_CAP, type SumrNetApyConfig } from '@summerfi/app-earn-ui'
import { type EarnAppConfigType } from '@summerfi/app-types'

import { type TokenPriceData } from '@/app/server-handlers/token-price/types'
import { defaultSumrMarketCap } from '@/helpers/sumr-market-cap'

export const getEstimatedSumrPrice = ({
  config,
  sumrPrice,
  sumrNetApyConfig,
}: {
  config: Partial<EarnAppConfigType>
  sumrPrice: TokenPriceData
  sumrNetApyConfig: Partial<SumrNetApyConfig>
}) => {
  const isSumrPriceEnabled = config.features?.UseSumrCoingeckoPrice ?? false

  const estimatedSumrPrice = isSumrPriceEnabled
    ? sumrPrice.usd
    : Number(sumrNetApyConfig.dilutedValuation ?? defaultSumrMarketCap) / SUMR_CAP

  return estimatedSumrPrice
}
