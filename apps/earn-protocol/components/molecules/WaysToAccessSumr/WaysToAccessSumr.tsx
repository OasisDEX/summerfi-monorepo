import { Button, DataBlock, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import { SectionCard } from '@/components/molecules/CardVariants/SectionCard'

import waysToAccessSumrStyles from './WaysToAccessSumr.module.css'

export const WaysToAccessSumr = ({ className }: { className?: string }) => {
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
              value="Up to 35%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="ETH APY"
              value="3-5%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <Button variant="primarySmallColorful">Deposit</Button>
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
              value="Up to 35%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="USDC/USDT APY"
              value="7-19%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <Button variant="primarySmallColorful">Deposit</Button>
        </SectionCard>
        <SectionCard className={waysToAccessSumrStyles.box}>
          <div className={waysToAccessSumrStyles.boxHeader}>
            <Icon iconName="sumr" size={35} />
            <Text variant="h4">Buy SUMR</Text>
          </div>
          <div className={waysToAccessSumrStyles.boxData}>
            <DataBlock
              title="SUMR Rewards"
              value="Up to 35%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
            <DataBlock
              title="USD Yield"
              value="5.9%"
              valueStyle={{ color: 'white' }}
              wrapperStyles={{ width: '100%' }}
            />
          </div>
          <Button variant="primarySmallColorful">Buy</Button>
        </SectionCard>
      </div>
    </div>
  )
}
