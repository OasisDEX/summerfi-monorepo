import { DataBlock, Icon, SkeletonLine, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { BuySumrModal } from '@/components/molecules/BuySumrModal/BuySumrModal'
import { SectionCard } from '@/components/molecules/CardVariants/SectionCard'

import waysToAccessSumrStyles from './WaysToAccessSumr.module.css'

export const WaysToAccessSumr = ({
  className,
  isLoading,
  sumrRewardApy,
  maxApy,
}: {
  className?: string
  apyRanges?: {
    eth: { minApy: number; maxApy: number }
    stablecoins: { minApy: number; maxApy: number }
  }
  sumrRewards?: {
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
