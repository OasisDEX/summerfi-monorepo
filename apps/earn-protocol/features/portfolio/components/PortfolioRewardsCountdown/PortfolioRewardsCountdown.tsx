import { Card, NewsletterWrapper, Text } from '@summerfi/app-earn-ui'
import { usePathname } from 'next/navigation'

import { SumrTransferabilityCounter } from '@/features/sumr-claim/components/SumrTransferabilityCounter/SumrTransferabilityCounter'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

import classNames from './PortfolioRewardsCountdown.module.css'

export const PortfolioRewardsCountdown = () => {
  const pathname = usePathname()
  const handleNewsletterEvent = ({
    eventType,
    errorMessage,
  }: {
    eventType: 'subscribe-submit' | 'subscribe-failure'
    errorMessage?: string
  }) => {
    if (eventType === 'subscribe-failure') {
      EarnProtocolEvents.errorOccurred({
        errorId: 'ep-newsletter-subscribe-failure',
        errorMessage,
        page: pathname,
      })
    } else {
      EarnProtocolEvents.buttonClicked({
        buttonName: 'ep-newsletter-subscribe',
        page: pathname,
      })
    }
  }

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
          Lazy Summer Protocol has launched - it&apos;s the best way to earn $SUMR. Get notified.
        </Text>
        <NewsletterWrapper
          wrapperClassName={classNames.customNewsletterSection}
          inputBtnLabel="Get updates"
          isEarnApp
          handleNewsletterEvent={handleNewsletterEvent}
        />
      </div>
      <Card className={classNames.countdownWrapper}>
        <SumrTransferabilityCounter
          wrapperStyles={{ marginTop: 0 }}
          counterId="portfolio-sumr-rewards"
        />
      </Card>
    </Card>
  )
}
