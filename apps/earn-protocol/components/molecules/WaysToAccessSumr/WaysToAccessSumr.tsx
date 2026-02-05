import { Button, DataBlock, Icon, SkeletonLine, Text, Tooltip } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatPercent } from '@summerfi/app-utils'
import clsx from 'clsx'
import Link from 'next/link'

import { BuySumrModal } from '@/components/molecules/BuySumrModal/BuySumrModal'
import { SectionCard } from '@/components/molecules/CardVariants/SectionCard'

import waysToAccessSumrStyles from './WaysToAccessSumr.module.css'

export const WaysToAccessSumr = ({
  className,
  apyRanges,
  sumrRewards,
  isLoading,
  sumrRewardApy,
  maxApy,
}: {
  className?: string
  apyRanges: {
    eth: { minApy: number; maxApy: number }
    stablecoins: { minApy: number; maxApy: number }
  }
  sumrRewards: {
    eth: number
    stablecoins: number
  }
  isLoading?: boolean
  sumrRewardApy?: string
  maxApy?: string
}) => {
  return (
    <div className={clsx(waysToAccessSumrStyles.wrapper, className)}>
      <div className={waysToAccessSumrStyles.header}>
        <Icon iconName="stars_colorful" size={50} />
        <Text variant="h3">Multiple ways to access SUMR</Text>
      </div>
      <div className={waysToAccessSumrStyles.boxes}>
        <SectionCard className={waysToAccessSumrStyles.box}>
          <div className={waysToAccessSumrStyles.boxHeader}>
            <Icon iconName="ether_circle_color" size={44} />
            <Text variant="h4">ETH</Text>
          </div>
          <div className={waysToAccessSumrStyles.boxData}>
            <DataBlock
              title="SUMR Rewards"
              value={
                isLoading ? (
                  <SkeletonLine height="18px" width="60px" style={{ margin: '5px 0' }} />
                ) : (
                  `${formatDecimalAsPercent(sumrRewards.eth, { precision: 2, noPercentSign: true })}%`
                )
              }
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="ETH APY"
              value={`${formatPercent(apyRanges.eth.minApy, {
                noPercentSign: true,
                precision: 2,
              })}% - ${formatPercent(apyRanges.eth.maxApy, {
                noPercentSign: true,
                precision: 2,
              })}%`}
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <Link href="/?assets=ETH">
            <Button variant="primarySmallColorful">Deposit</Button>
          </Link>
        </SectionCard>
        <SectionCard className={waysToAccessSumrStyles.box}>
          <div className={waysToAccessSumrStyles.boxHeader}>
            <div className={waysToAccessSumrStyles.tokenPairIcon}>
              <Icon iconName="usdc_circle_color" size={25} />
              <Icon iconName="usdt_circle_color" size={25} />
            </div>
            <Text variant="h4">Stable coins</Text>
          </div>
          <div className={waysToAccessSumrStyles.boxData}>
            <DataBlock
              title="SUMR Rewards"
              value={
                isLoading ? (
                  <SkeletonLine height="18px" width="60px" style={{ margin: '5px 0' }} />
                ) : (
                  `${formatDecimalAsPercent(sumrRewards.stablecoins, { precision: 2, noPercentSign: true })}%`
                )
              }
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="USDC/USDT APY"
              value={`${formatPercent(apyRanges.stablecoins.minApy, {
                noPercentSign: true,
                precision: 2,
              })}% - ${formatPercent(apyRanges.stablecoins.maxApy, {
                noPercentSign: true,
                precision: 2,
              })}%`}
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <Link href="/?assets=EURC%2CUSDC%2CUSDC.E%2CUSDT">
            <Button variant="primarySmallColorful">Deposit</Button>
          </Link>
        </SectionCard>
        <SectionCard className={waysToAccessSumrStyles.box}>
          <div className={waysToAccessSumrStyles.boxHeader}>
            <Icon iconName="sumr" size={35} />
            <Text variant="h4">Buy SUMR</Text>
          </div>
          <div className={waysToAccessSumrStyles.boxData}>
            <DataBlock
              title="SUMR Rewards"
              value={
                isLoading ? (
                  <SkeletonLine height="18px" width="60px" style={{ margin: '5px 0' }} />
                ) : (
                  sumrRewardApy
                )
              }
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="USDC Yield"
              value={
                isLoading ? (
                  <SkeletonLine height="18px" width="60px" style={{ margin: '5px 0' }} />
                ) : (
                  maxApy
                )
              }
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <BuySumrModal buttonVariant="primarySmallColorful" />
        </SectionCard>
      </div>
    </div>
  )
}
