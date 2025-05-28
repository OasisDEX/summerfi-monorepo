import { BeachClubSteps, Card, Text } from '@summerfi/app-earn-ui'

import classNames from './BeachClubGetRewarded.module.css'

export const BeachClubGetRewarded = () => {
  return (
    <div className={classNames.beachClubGetRewardedWrapper}>
      <Text as="h3" variant="h3" style={{ marginBottom: 'var(--general-space-16)' }}>
        Get rewarded for sharing DeFi’s best yield
      </Text>
      <Text
        as="p"
        variant="p1"
        style={{
          color: 'var(--earn-protocol-secondary-60)',
          marginBottom: 'var(--general-space-32)',
        }}
      >
        “Beach Club” is a referral campaign where you can invite friends to Lazy Summer and earn
        more, effortlessly. Now everyone can earn more, save time and reduce costs in DeFi. Chill
        this Summer, don’t chase yields.
      </Text>
      <Card variant="cardSecondary" className={classNames.howItWorksWrapper}>
        <Text as="h5" variant="h5" style={{ marginBottom: 'var(--general-space-24)' }}>
          How it works
        </Text>
        <BeachClubSteps />
      </Card>
    </div>
  )
}
