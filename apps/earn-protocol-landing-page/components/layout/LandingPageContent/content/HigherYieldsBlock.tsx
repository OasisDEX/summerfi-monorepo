'use client'

import { useMemo } from 'react'
import { Button, getVaultsProtocolsList, SectionTabs, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKVaultsListType } from '@summerfi/app-types'
import {
  formatFiatBalance,
  formatWithSeparators,
  getRebalanceSavedGasCost,
  getRebalanceSavedTimeInHours,
} from '@summerfi/app-utils'
import Image, { type StaticImageData } from 'next/image'
import Link from 'next/link'

import higherYieldsBlockStyles from '@/components/layout/LandingPageContent/content/HigherYieldsBlock.module.css'

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

type HigherYieldsSectionContentProps = {
  savedGasCost: number
  savedTimeInHours: number
  totalRebalances: number
  totalVaultsCount: number
  totalAssets: number
  totalLiquidity: number
  supportedProtocolsCount: number
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
        <Link href={ctaUrl} prefetch={false}>
          <Button variant="primarySmall">{ctaLabel}</Button>
        </Link>
        <Link
          prefetch={false}
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
          <div key={item.description} className={higherYieldsBlockStyles.higherYieldsSectionStats}>
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
    content: ({
      totalAssets,
      totalLiquidity,
      supportedProtocolsCount,
    }: HigherYieldsSectionContentProps) => (
      <HigherYieldsSection
        title="You’re earning DeFi’s highest yields, all of the time."
        description="With Lazy Summer Protocol, your deposits are continuously monitored and reallocated across the top protocols, ensuring you are earning the best available yields."
        ctaLabel="Get started"
        ctaUrl="/earn"
        secondaryCtaLabel="View Yields"
        secondaryCtaUrl="/earn"
        imageSrc={howYouEarnMoreImage}
        statsList={[
          {
            title: `$${formatFiatBalance(totalAssets)}`,
            description: 'Total Assets',
          },
          {
            title: `$${formatFiatBalance(totalLiquidity)}`,
            description: 'Liquidity',
          },
          {
            title: supportedProtocolsCount.toString(),
            description: 'Protocols Used',
          },
        ]}
      />
    ),
  },
  'how-we-use-ai': {
    title: 'How we use AI to outperform',
    content: ({
      savedTimeInHours,
      totalRebalances,
      totalVaultsCount,
    }: HigherYieldsSectionContentProps) => (
      <HigherYieldsSection
        title="Always optimized, zero effort."
        description="Summer.fi's AI-powered keeper network requires a majority of AI Agents to agree on a single strategy to automatically rebalance your portfolio. It continually optimizes rebalancing strategies to maximize long-term yields."
        ctaLabel="Get started"
        ctaUrl="/earn"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/earn"
        imageSrc={howWeUseAi}
        statsList={[
          {
            title: formatWithSeparators(totalRebalances),
            description: 'Rebalance Transactions',
          },
          {
            title: `${formatWithSeparators(savedTimeInHours)} hours`,
            colorful: true,
            description: 'User time saved',
          },
          {
            title: totalVaultsCount.toString(),
            description: 'DeFi Strategies Optimized',
          },
        ]}
      />
    ),
  },
  'how-you-save-time-and-costs': {
    title: 'How you save time and costs',
    content: ({
      savedGasCost,
      totalVaultsCount,
      supportedProtocolsCount,
    }: HigherYieldsSectionContentProps) => (
      <HigherYieldsSection
        title="Save Time, Cut Complexity and forget about Gas Costs"
        description="With Summer.fi, there is no need to keep a spreadsheet, check different apps and sign multiple transactions, chasing the best yields and seeing your profit disappear with gas fees. All rebalances are included in the 1% Annualized AUM Fee...sit back, relax and earn more the lazy way."
        ctaLabel="Deposit"
        ctaUrl="/earn"
        secondaryCtaLabel="Learn more"
        secondaryCtaUrl="/earn"
        imageSrc={howYouSaveTimeAndCostsImage}
        statsList={[
          {
            title: totalVaultsCount.toString(),
            description: 'DeFi Strategies Optimized',
          },
          {
            title: `$${formatFiatBalance(savedGasCost)}`,
            colorful: true,
            description: 'Gas Cost Savings',
          },
          {
            title: supportedProtocolsCount.toString(),
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

interface HigherYieldsBlockProps {
  vaultsList?: SDKVaultsListType
  totalRebalances?: number
}

export const HigherYieldsBlock: React.FC<HigherYieldsBlockProps> = ({
  vaultsList,
  totalRebalances,
}) => {
  const totalLiquidity = useMemo(() => {
    return vaultsList?.reduce((acc, vault) => acc + Number(vault.withdrawableTotalAssetsUSD), 0)
  }, [vaultsList])

  const totalVaultsCount = vaultsList?.length

  const savedTimeInHours = useMemo(
    () => getRebalanceSavedTimeInHours(totalRebalances ?? 0),
    [totalRebalances],
  )
  const savedGasCost = useMemo(() => getRebalanceSavedGasCost(vaultsList ?? []), [vaultsList])

  const totalAssets = useMemo(() => {
    return vaultsList?.reduce((acc, vault) => acc + Number(vault.totalValueLockedUSD), 0)
  }, [vaultsList])

  const supportedProtocolsCount = getVaultsProtocolsList(vaultsList ?? []).length

  const sectionTabs = useMemo(() => {
    if (!vaultsList || !totalAssets || !totalRebalances || !totalVaultsCount || !totalLiquidity) {
      return false
    }

    return higherYieldsBlockSectionsKeys.map((sectionKey) => ({
      id: sectionKey,
      title: higherYieldsBlockSections[sectionKey].title,
      content: higherYieldsBlockSections[sectionKey].content({
        savedGasCost,
        savedTimeInHours,
        totalRebalances,
        totalVaultsCount,
        totalAssets,
        totalLiquidity,
        supportedProtocolsCount,
      }),
    }))
  }, [
    savedGasCost,
    savedTimeInHours,
    supportedProtocolsCount,
    totalAssets,
    totalLiquidity,
    totalRebalances,
    totalVaultsCount,
    vaultsList,
  ])

  return (
    <div>
      <div className={higherYieldsBlockStyles.higherYieldsHeaderWrapper}>
        <Text variant="h2" className={higherYieldsBlockStyles.higherYieldsHeader}>
          Sustainably higher yields, <br className={higherYieldsBlockStyles.lineBreak} /> optimized{' '}
          <br className={higherYieldsBlockStyles.lineBreak2} />
          with AI.
        </Text>
      </div>
      {sectionTabs ? <SectionTabs sections={sectionTabs} /> : null}
    </div>
  )
}
