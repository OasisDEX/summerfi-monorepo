'use client'

import { useState } from 'react'
import { Button, Text, WithArrow } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import higherYieldsBlockStyles from './HigherYieldsBlock.module.scss'

import continousAutoRebalancingImage from '@/public/img/landing-page/higher-yields_continous-auto-rebalancing.png'
import howYouEarnMoreImage from '@/public/img/landing-page/higher-yields_how-you-earn-more.png'
import howYouSaveCostsImage from '@/public/img/landing-page/higher-yields_how-you-save-costs.png'

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
      <Image src={imageSrc} alt={title} />
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
        title="DeFi’s best yield, all of the time."
        description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
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
  'continouse-auto-rebalancing': {
    title: 'Continuous Auto-Rebalancing',
    content: (
      <HigherYieldsSection
        title="Everything, optimized and automated."
        description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
        ctaLabel="Get started"
        ctaUrl="/"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/"
        imageSrc={continousAutoRebalancingImage}
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
  'how-you-save-costs': {
    title: 'How you save costs',
    content: (
      <HigherYieldsSection
        title="No more chasing yields and paying unnecessary fees  "
        description="With Summer, effortlessly earn the best yields and grow your capital faster. We automatically rebalance your assets to top protocols, maximizing your returns."
        ctaLabel="Deposit"
        ctaUrl="/"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/"
        imageSrc={howYouSaveCostsImage}
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

  const handleSetActiveSection = (sectionKey: keyof typeof higherYieldsBlockSections) => {
    if (fadingOut) return
    setFadingOut(true)
    setTimeout(() => {
      setActiveSection(sectionKey)
      setFadingOut(false)
    }, 200)
  }

  return (
    <div>
      <div className={higherYieldsBlockStyles.higherYieldsHeaderWrapper}>
        <Text variant="h2" className={higherYieldsBlockStyles.higherYieldsHeader}>
          Sustainably higher yields, automatically.
        </Text>
      </div>
      <div className={higherYieldsBlockStyles.higherYieldsDetailsWrapper}>
        <div className={higherYieldsBlockStyles.higherYieldsDetailsButtons}>
          {higherYieldsBlockSectionsKeys.map((sectionKey) => (
            <Button
              variant="unstyled"
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
          {higherYieldsBlockSections[activeSection].content}
        </div>
      </div>
    </div>
  )
}
