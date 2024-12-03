import { type ReactNode } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'

import startEarningNowStyles from '@/components/layout/LandingPageContent/content/StartEarningNow.module.scss'

const StartEarningNowBlock = ({
  id,
  tag,
  title,
  points,
  cta,
}: {
  id: string
  tag: ReactNode
  title: ReactNode
  points: string[]
  cta: ReactNode
}) => (
  <Card className={startEarningNowStyles.startEarningNowCard}>
    {tag}
    <Text variant="h5" as="h5">
      {title}
    </Text>
    <ul className={startEarningNowStyles.startEarningNowPoints}>
      {points.map((item) => (
        <Text variant="p2" as="li" key={`StartEarningNowPoint_${id}_${item}`}>
          <Icon iconName="checkmark_colorful_slim" size={20} />
          {item}
        </Text>
      ))}
    </ul>
    <div className={startEarningNowStyles.ctaWrapper}>{cta}</div>
  </Card>
)

export const StartEarningNow = () => {
  return (
    <div>
      <div className={startEarningNowStyles.startEarningNowHeaderWrapper}>
        <Text variant="h2" className={startEarningNowStyles.startEarningNowHeader}>
          Start earning now
        </Text>
      </div>
      <div className={startEarningNowStyles.startEarningNowBlockWrapper}>
        <StartEarningNowBlock
          id="individual"
          tag={
            <Text
              variant="p3semi"
              className={clsx(startEarningNowStyles.tag, startEarningNowStyles.individualTag)}
            >
              Individual
            </Text>
          }
          title="Start earning in minutes"
          points={[
            'Start earning without a crypto wallet',
            'Deposit with any token if you already have a wallet',
            'Deposit funds straight from your bank account',
            'Withdraw anytime',
          ]}
          cta={
            <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
              <Text variant="p3semi">Sign up</Text>
            </Button>
          }
        />
        <StartEarningNowBlock
          id="institutions"
          tag={
            <Text
              variant="p3semi"
              className={clsx(startEarningNowStyles.tag, startEarningNowStyles.institutionsTag)}
            >
              Institutions & DAO Treasuries
            </Text>
          }
          title="Streamline your DeFi yield strategy"
          points={[
            'Best in class security',
            'Deep liquidity',
            'Audited and open source code',
            'Withdraw anytime',
          ]}
          cta={
            <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
              <Text variant="p3semi">Set up a call</Text>
            </Button>
          }
        />
        <StartEarningNowBlock
          id="defiYieldEarners"
          tag={
            <Text variant="p3semiColorful" className={clsx(startEarningNowStyles.tag)}>
              For Existing DeFi Yield Earners
            </Text>
          }
          title="Migrate your position to Summer in 1 transaction"
          points={[
            'Start earning optimized DeFi yields',
            'Keep some exposure to original strategy',
            'Diversify your exposure across protocols',
            'Withdraw anytime',
          ]}
          cta={
            <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
              <Text variant="p3semi">Migrate</Text>
            </Button>
          }
        />
      </div>
    </div>
  )
}
