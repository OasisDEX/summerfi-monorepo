import { type FC, useMemo } from 'react'
import { EXTERNAL_LINKS, GlobalNoticeBanner } from '@summerfi/app-earn-ui'
import { type SDKVaultishType, type SDKVaultType } from '@summerfi/app-types'
import { ten } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

const REBALANCING_NOTICE_THRESHOLDS = {
  liquidityPercentage: 5, // 5%
}

export const RebalancingNoticeBanner: FC<{ vault: SDKVaultType | SDKVaultishType }> = ({
  vault,
}) => {
  const { liquidityPercentage } = useMemo(() => {
    if (!vault.inputTokenPriceUSD) {
      return {
        liquidityPercentage: new BigNumber(0),
      }
    }

    const liquidityUsdTemp = new BigNumber(vault.withdrawableTotalAssetsUSD)
    const tokenBalance = new BigNumber(vault.inputTokenBalance.toString()).div(
      ten.pow(vault.inputToken.decimals),
    )
    const tokenPrice = new BigNumber(vault.inputTokenPriceUSD.toString())

    const liquidityPercentageTemp = liquidityUsdTemp.div(tokenBalance.times(tokenPrice)).times(100)

    return {
      liquidityPercentage: liquidityPercentageTemp,
    }
  }, [vault])

  const isInWithdrawalQueue =
    liquidityPercentage.lt(REBALANCING_NOTICE_THRESHOLDS.liquidityPercentage) &&
    !!vault.inputTokenPriceUSD

  return isInWithdrawalQueue ? (
    <GlobalNoticeBanner
      message={
        <>
          Funds are currently being rebalanced from some protocols which have a withdrawal queue
          such as Fluid Lite, Syrup and Origin.
          <br />
          Withdrawals may be unavailable until instant liquidity is restored. For details keep an
          eye out on the rebalancing tab and contact us on{' '}
          <Link href={EXTERNAL_LINKS.DISCORD} style={{ textDecoration: 'underline' }}>
            Discord
          </Link>{' '}
          or{' '}
          <Link href="mailto:support@summer.fi" style={{ textDecoration: 'underline' }}>
            support@summer.fi
          </Link>
          .
        </>
      }
    />
  ) : null
}
