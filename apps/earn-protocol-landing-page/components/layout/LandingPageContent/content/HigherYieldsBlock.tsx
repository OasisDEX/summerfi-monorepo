'use client'

import { useCallback, useState } from 'react'
import { Button, Text, WithArrow } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import higherYieldsBlockStyles from '@/components/layout/LandingPageContent/content/HigherYieldsBlock.module.scss'

import howWeUseAi from '@/public/img/landing-page/higher-yields_how-we-use-ai.png'
import howYouEarnMoreImage from '@/public/img/landing-page/higher-yields_how-you-earn-more.png'
import howYouSaveTimeAndCostsImage from '@/public/img/landing-page/higher-yields_how-you-save-costs.png'

type HigherYieldsSectionProps = {
  title: string
  description: string
  ctaLabel: string
  ctaUrl: string
  secondaryCtaLabel: string
  secondaryCtaUrl: string
  imageSrc: StaticImageData
  statsList: {
    title: string
    description: string
    colorful?: boolean
  }[]
}

const HigherYieldsSection = ({
  title,
  description,
  ctaLabel,
  ctaUrl,
  secondaryCtaLabel,
  secondaryCtaUrl,
  imageSrc,
  statsList,
}: HigherYieldsSectionProps) => {
  return (
    <div className={higherYieldsBlockStyles.higherYieldsSection}>
      <Text as="h5" variant="h5" className={higherYieldsBlockStyles.higherYieldsSectionTitle}>
        {title}
      </Text>
      <Text as="p" variant="p1" className={higherYieldsBlockStyles.higherYieldsSectionDescription}>
        {description}
      </Text>
      <div className={higherYieldsBlockStyles.higherYieldsSectionCTA}>
        <Link href={ctaUrl}>
          <Button variant="primarySmall">{ctaLabel}</Button>
        </Link>
        <Link
          href={secondaryCtaUrl}
          className={higherYieldsBlockStyles.higherYieldsSectionSecondaryButton}
        >
          <WithArrow>
            <Text variant="p3semi">{secondaryCtaLabel}</Text>
          </WithArrow>
        </Link>
      </div>
      <Image src={imageSrc} alt={title} placeholder="blur" unoptimized />
      <div className={higherYieldsBlockStyles.higherYieldsSectionStatsWrapper}>
        {statsList.map((item) => (
          <div key={item.title} className={higherYieldsBlockStyles.higherYieldsSectionStats}>
            <Text variant={item.colorful ? 'h4colorful' : 'h4'} as="span">
              {item.title}
            </Text>
            <Text variant="p3semi" as="p">
              {item.description}
            </Text>
          </div>
        ))}
      </div>
    </div>
  )
}

const higherYieldsBlockSections = {
  'how-you-earn-more': {
    title: 'How you earn more',
    content: (
      <HigherYieldsSection
        title="You’re earning DeFi’s highest yields, all of the time."
        description="With Summer, your deposits are continuously monitored and reallocated across the top protocols, ensuring you are earning the best available yields."
        ctaLabel="Get started"
        ctaUrl="/"
        secondaryCtaLabel="View Yields"
        secondaryCtaUrl="/"
        imageSrc={howYouEarnMoreImage}
        statsList={[
          {
            title: '500m',
            description: 'Total Assets',
          },
          {
            title: '20b+',
            description: 'Liquidity',
          },
          {
            title: '6',
            description: 'Protocols Used',
          },
        ]}
      />
    ),
  },
  'how-we-use-ai': {
    title: 'How we use AI to outperform',
    content: (
      <HigherYieldsSection
        title="Always optimized, zero effort."
        description="Summer's AI-powered keeper network requires a majority of AI Agents to agree on a single strategy to automatically rebalance your portfolio. It continually optimizes rebalancing strategies to maximize long-term yields."
        ctaLabel="Get started"
        ctaUrl="/"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/"
        imageSrc={howWeUseAi}
        statsList={[
          {
            title: '45.2K',
            description: 'Rebalance Transactions',
          },
          {
            title: '2,184 hours',
            colorful: true,
            description: 'User time saved',
          },
          {
            title: '14',
            description: 'DeFi Strategies Optimized',
          },
        ]}
      />
    ),
  },
  'how-you-save-time-and-costs': {
    title: 'How you save time and costs',
    content: (
      <HigherYieldsSection
        title="Save Time, Cut Complexity and forget about Gas Costs"
        description="With Summer, there is no need to keep a spreadsheet, check different apps and sign multiple transactions, chasing the best yields and seeing your profit disappear with gas fees. All rebalances are included in the 1% Annualized AUM Fee...sit back, relax and earn more the lazy way."
        ctaLabel="Deposit"
        ctaUrl="/"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/"
        imageSrc={howYouSaveTimeAndCostsImage}
        statsList={[
          {
            title: '14',
            description: 'DeFi Strategies Optimized',
          },
          {
            title: '$1.23M',
            colorful: true,
            description: 'Gas Cost Savings',
          },
          {
            title: '6',
            description: 'Protocol Used',
          },
        ]}
      />
    ),
  },
}

const higherYieldsBlockSectionsKeys = Object.keys(
  higherYieldsBlockSections,
) as (keyof typeof higherYieldsBlockSections)[]

export const HigherYieldsBlock = () => {
  const [fadingOut, setFadingOut] = useState(false)
  const [activeSection, setActiveSection] = useState(higherYieldsBlockSectionsKeys[0])

  const handleSetActiveSection = useCallback(
    (sectionKey: keyof typeof higherYieldsBlockSections) => {
      if (fadingOut) return
      setFadingOut(true)
      setTimeout(() => {
        setActiveSection(sectionKey)
        setFadingOut(false)
      }, 200)
    },
    [fadingOut],
  )

  return (
    <div>
      <div className={higherYieldsBlockStyles.higherYieldsHeaderWrapper}>
        <Text variant="h2" className={higherYieldsBlockStyles.higherYieldsHeader}>
          Sustainably higher yields, optimized with AI.
        </Text>
      </div>
      <div className={higherYieldsBlockStyles.higherYieldsDetailsWrapper}>
        <div className={higherYieldsBlockStyles.higherYieldsDetailsButtons}>
          {higherYieldsBlockSectionsKeys.map((sectionKey) => (
            <Button
              key={`higher-yields-section-${sectionKey}`}
              onClick={() => handleSetActiveSection(sectionKey)}
              className={clsx(higherYieldsBlockStyles.higherYieldsDetailsButton, {
                [higherYieldsBlockStyles.higherYieldsDetailsButtonActive]:
                  activeSection === sectionKey,
              })}
            >
              <Text variant={activeSection === sectionKey ? 'p1semiColorful' : 'p1semi'}>
                {higherYieldsBlockSections[sectionKey].title}
              </Text>
            </Button>
          ))}
        </div>
        <div
          className={clsx(higherYieldsBlockStyles.higherYieldsDetailsContent, {
            [higherYieldsBlockStyles.higherYieldsDetailsContentFadingOut]: fadingOut,
          })}
        >
          {higherYieldsBlockSectionsKeys.map((sectionKey) => (
            <div
              key={`higher-yields-section-${sectionKey}`}
              style={{
                // needs this to prevent flash of old image when switching sections
                display: activeSection === sectionKey ? 'block' : 'none',
              }}
            >
              {higherYieldsBlockSections[sectionKey].content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
