import { Card, Text } from '@summerfi/app-earn-ui'

import { NewsletterWrapper } from '@/features/newsletter/components/NewsletterWrapper/NewsletterWrapper'
import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'

import classNames from './PortfolioRewardsCountdown.module.scss'

export const PortfolioRewardsCountdown = () => {
  return (
    <Card
      variant="cardSecondaryColorfulBorder"
      className={classNames.portfolioRewardsCountdownWrapper}
    >
      <div className={classNames.newsletterWrapper}>
        <Text as="h5" variant="h5" style={{ marginBottom: 'var(--general-space-4)' }}>
          You haven’t missed out on your chance to earn $SUMR.
        </Text>
        <Text
          as="p"
          variant="p3"
          style={{
            marginBottom: 'var(--general-space-16)',
            color: 'var(--earn-protocol-secondary-60)',
          }}
        >
          Lazy Summer Protocol is launching soon, its the best way to earn $SUMR. Get notified.
        </Text>
        <NewsletterWrapper
          wrapperClassName={classNames.customNewsletterSection}
          inputBtnLabel="Get updates"
        />
      </div>
      <Card className={classNames.countdownWrapper}>
        <SumrTransferabilityCounter wrapperStyles={{ marginTop: 0 }} />
      </Card>
    </Card>
  )
}