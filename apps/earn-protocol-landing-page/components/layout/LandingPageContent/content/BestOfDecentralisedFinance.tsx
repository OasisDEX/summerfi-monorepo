import { type ReactNode } from 'react'
import { BigGradientBox, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import bestOfDecentralizedFinanceChart1 from '@/public/img/landing-page/best-of-decentralised-finance_chart-1.svg'
import bestOfDecentralizedFinanceChart2 from '@/public/img/landing-page/best-of-decentralised-finance_chart-2.svg'
import bestOfDecentralizedFinanceProtocols from '@/public/img/landing-page/best-of-decentralised-finance_protocols.svg'

import bestOfDecentralizedFinanceStyles from '@/components/layout/LandingPageContent/content/BestOfDecentralizedFinance.module.scss'

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
          The very best of Decentralised Finance (DeFi)
        </Text>
      </div>
      <div className={bestOfDecentralizedFinanceStyles.bestOfDecentralizedFinanceBlockWrapper}>
        <BigGradientBox className={bestOfDecentralizedFinanceStyles.gradientLeftBox}>
          <BestOfDecentralizedFinanceBlock
            tag="Transparent"
            title="Never second guess the source of your yield"
            description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
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
            tag="Liquid"
            title="Exit anytime, no matter your size"
            description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
            content={
              <div className={bestOfDecentralizedFinanceStyles.ui}>
                <Image src={bestOfDecentralizedFinanceUI} alt="Exit anytime, no matter your size" />
              </div>
            }
          />
        </BigGradientBox>
        <BigGradientBox className={bestOfDecentralizedFinanceStyles.gradientRightBox}>
          <BestOfDecentralizedFinanceBlock
            tag="Permissionless"
            title="No black boxes. Fully on-chain."
            description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
            content={
              <div className={bestOfDecentralizedFinanceStyles.protocols}>
                <Image
                  src={bestOfDecentralizedFinanceProtocols}
                  alt="Exit anytime, no matter your size"
                />
              </div>
            }
          />
        </BigGradientBox>
      </div>
    </div>
  )
}
