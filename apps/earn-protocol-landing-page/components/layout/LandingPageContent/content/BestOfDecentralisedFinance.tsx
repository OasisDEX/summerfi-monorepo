import { type ReactNode } from 'react'
import { BigGradientBox, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import bestOfDecentralizedFinanceChart1 from '@/public/img/landing-page/best-of-decentralised-finance_chart-1.svg'
import bestOfDecentralizedFinanceChart2 from '@/public/img/landing-page/best-of-decentralised-finance_chart-2.svg'
import bestOfDecentralizedFinancePermissionless from '@/public/img/landing-page/best-of-decentralised-finance_permissionless.svg'

import bestOfDecentralizedFinanceStyles from '@/components/layout/LandingPageContent/content/BestOfDecentralizedFinance.module.css'

import bestOfDecentralizedFinanceUI from '@/public/img/landing-page/best-of-decentralised-finance_ui.png'

const BestOfDecentralizedFinanceBlock = ({
  tag,
  title,
  description,
  content,
}: {
  tag: string
  title: string
  description: string
  content: ReactNode
}) => (
  <div className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceBlock}>
    <div className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceBlockDescription}>
      <Text variant="p3semiColorful">{tag}</Text>
      <Text variant="h5" as="h5">
        {title}
      </Text>
      <Text variant="p2" as="p">
        {description}
      </Text>
    </div>
    {content}
  </div>
)

export const BestOfDecentralizedFinance = () => {
  return (
    <div>
      <div className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceHeaderWrapper}>
        <Text
          variant="h2"
          className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceHeader}
        >
          The Power of DeFi, made accessible to everyone.
        </Text>
      </div>
      <div className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceBlockWrapper}>
        <BigGradientBox className={bestOfDecentralizedFinanceStyles.gradientLeftBox}>
          <BestOfDecentralizedFinanceBlock
            tag="Transparent by Design"
            title="Never second guess the source of your yield "
            description="Summer.fi ensures you never second guess the source of your yield. With our automated rebalances, every decision is fully traceable and optimized transparently."
            content={
              <div className={bestOfDecentralizedFinanceStyles.chart}>
                <Image
                  src={bestOfDecentralizedFinanceChart1}
                  width={220}
                  alt="Pie Chart - Never second guess the source of your yield"
                />
                <Image
                  src={bestOfDecentralizedFinanceChart2}
                  alt="Pie Chart Legend - Never second guess the source of your yield"
                />
              </div>
            }
          />
        </BigGradientBox>
        <BigGradientBox className={bestOfDecentralizedFinanceStyles.gradientCenterBox}>
          <BestOfDecentralizedFinanceBlock
            tag="Instant Liquidity"
            title="Exit anytime, no lockups or withdrawal delays"
            description="With Summer.fi, you can withdraw from your position at anytime as long as the capital is available from the underlying protocols (which is almost always). No queues or waiting for withdrawals to be processed."
            content={
              <div className={bestOfDecentralizedFinanceStyles.ui}>
                <Image
                  src={bestOfDecentralizedFinanceUI}
                  alt="Exit anytime, no lockups or withdrawal delays"
                />
              </div>
            }
          />
        </BigGradientBox>
        <BigGradientBox className={bestOfDecentralizedFinanceStyles.gradientRightBox}>
          <BestOfDecentralizedFinanceBlock
            tag="Permissionless"
            title="Always Non-Custodial, Always in Your Control"
            description="Built entirely on-chain, Summer.fi gives you unrestricted access and complete control over your assets—no middle-men and no opaque third parties with control over your capital."
            content={
              <div className={bestOfDecentralizedFinanceStyles.protocols}>
                <Image
                  src={bestOfDecentralizedFinancePermissionless}
                  alt="Always Non-Custodial, Always in Your Control"
                />
              </div>
            }
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
