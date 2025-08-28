'use client'
import { type ReactNode } from 'react'
import { Button, Card, Icon, Text } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLandingPageData } from '@/contexts/LandingPageContext'
import { EarnProtocolEvents } from '@/helpers/mixpanel'

import startEarningNowStyles from '@/components/layout/LandingPageContent/content/StartEarningNow.module.css'

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
  const { landingPageData } = useLandingPageData()
  const pathname = usePathname()

  const migrationsEnabled = !!landingPageData?.systemConfig.features.Migrations

  const handleCtaClick = (buttonName: string) => () => {
    EarnProtocolEvents.buttonClicked({
      buttonName,
      page: pathname,
    })
  }

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
          title="Start earning in minutes and discover the power of Summer"
          points={[
            'Start earning without a crypto wallet',
            'Deposit with any token if you already have a wallet',
            'Deposit funds straight from your bank account',
            'Withdraw anytime',
          ]}
          cta={
            <Link
              href="/earn"
              prefetch={false}
              rel="noopener noreferrer"
              onClick={handleCtaClick(`lp-start-earning-cta-sign-up`)}
            >
              <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
                <Text variant="p3semi">Sign up</Text>
              </Button>
            </Link>
          }
        />
        <StartEarningNowBlock
          id="defiYieldEarners"
          tag={
            <Text variant="p3semiColorful" className={clsx(startEarningNowStyles.tag)}>
              For Existing DeFi Yield Earners
            </Text>
          }
          title="Migrate your existing DeFi positions to Summer in under a minute"
          points={[
            'Start earning optimized DeFi yields',
            'Keep some exposure to original strategy',
            'Diversify your exposure across protocols',
            'Withdraw anytime',
          ]}
          cta={
            migrationsEnabled ? (
              <Link
                href="/earn/migrate/user"
                prefetch={false}
                onClick={handleCtaClick(`lp-start-earning-cta-migrate`)}
              >
                <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
                  <Text variant="p3semi">Migrate</Text>
                </Button>
              </Link>
            ) : (
              <Button
                variant="secondarySmall"
                disabled
                className={clsx(
                  startEarningNowStyles.ctaButton,
                  startEarningNowStyles.ctaButtonDisabled,
                )}
              >
                <Text variant="p3semi">Coming soon</Text>
              </Button>
            )
          }
        />
        <StartEarningNowBlock
          id="institutions"
          tag={
            <Text
              variant="p3semi"
              className={clsx(startEarningNowStyles.tag, startEarningNowStyles.institutionsTag)}
            >
              HNW, Institutions & DAO Treasuries
            </Text>
          }
          title="Get a personalised onboarding experience"
          points={[
            'For those with at least $100,000 USD',
            'Personally onboarded with a member of the team through a Google Meet or Zoom call',
            'A key contact person for any future support',
            'Still able to withdraw at anytime',
          ]}
          cta={
            <Link
              href="https://cal.com/jordan-jackson-d278ib/summer.fi-support-call"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleCtaClick(`lp-start-earning-cta-set-up-a-call`)}
            >
              <Button variant="primarySmall" className={clsx(startEarningNowStyles.ctaButton)}>
                <Text variant="p3semi">Set up a call</Text>
              </Button>
            </Link>
          }
        />
      </div>
    </div>
  )
}
