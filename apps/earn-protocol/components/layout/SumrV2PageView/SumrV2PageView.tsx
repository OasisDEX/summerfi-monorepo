'use client'

import {
  Button,
  Card,
  FaqSection,
  GradientBox,
  Icon,
  SectionTabs,
  Text,
  useUserWallet,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'

import { SectionCard } from '@/components/molecules/CardVariants/SectionCard'
import { WaysToAccessSumr } from '@/components/molecules/WaysToAccessSumr/WaysToAccessSumr'
import sumrLogo from '@/public/img/branding/logo-dark.svg'
import sumrTokenBubbles from '@/public/img/sumr/sumr_token_bubbles.svg'

import sumrv2PageViewStyles from './SumrV2PageView.module.css'

import sumrStakingDiagram from '@/public/img/sumr/staking_diagram.png'

const TwoColumnHeader = () => {
  return (
    <div className={sumrv2PageViewStyles.twoColumnHeader}>
      <div
        className={clsx(sumrv2PageViewStyles.twoColumnHeaderBlock, sumrv2PageViewStyles.leftBlock)}
      >
        <Text as="h2" variant="h2">
          SUMR: DeFi’s productive asset that powers the leading yield aggregator
        </Text>
        <Text as="p" variant="p1">
          Earn dual yield sources by Staking SUMR to additional boosted SUMR rewards, and USDC
          derived from real protocol revenues.
        </Text>
        <div className={sumrv2PageViewStyles.leftBlockButtons}>
          <Link href="/staking/manage" prefetch>
            <Button variant="primarySmall">Stake SUMR</Button>
          </Link>
        </div>
      </div>
      <GradientBox selected>
        <Card
          className={clsx(
            sumrv2PageViewStyles.twoColumnHeaderBlock,
            sumrv2PageViewStyles.rightBlock,
          )}
        >
          <Image
            src={sumrLogo}
            alt="SUMR: DeFi’s productive asset that powers the leading yield aggregator."
            className={sumrv2PageViewStyles.rightBlockSumrLogo}
          />
          <div className={sumrv2PageViewStyles.rightBlockYieldSources}>
            <div className={sumrv2PageViewStyles.yieldSourceColumn}>
              <YieldSourceLabel label="Yield source 1" />
              <Text as="h3" variant="h3">
                Up to 7.2%
              </Text>
              <Text as="h5" variant="h5">
                USDC yield
              </Text>
            </div>
            <div className={sumrv2PageViewStyles.yieldSourceColumn}>
              <YieldSourceLabel label="Yield source 2" />
              <Text as="h3" variant="h3">
                Up to 3.5%
              </Text>
              <Text as="h5" variant="h5">
                SUMR APY
              </Text>
            </div>
          </div>
          {/* <div className={sumrv2PageViewStyles.rightBlockBottomBorder} />
          <div className={sumrv2PageViewStyles.rightBlockCountdown}>
            <Text variant="p2semi">Trade SUMR in:</Text>
            <CountDown
              futureTimestamp={dayjs('2025-11-18T00:00:00Z').toISOString()}
              itemVariant="small"
            />
          </div> */}
        </Card>
      </GradientBox>
    </div>
  )
}

const NewsList = ({
  newsItems,
}: {
  newsItems?: { title: string; description: string; link: string }[]
}) => {
  return (
    <Card variant="cardSecondary" className={sumrv2PageViewStyles.newsListWrapper}>
      <div className={sumrv2PageViewStyles.newsListHeader}>
        <Icon iconName="big_press" size={64} />
        <Text variant="h4">In the news</Text>
      </div>
      <div className={sumrv2PageViewStyles.newsListItems}>
        {newsItems?.length ? (
          newsItems.map(({ title, description, link }) => (
            <div key={title} className={sumrv2PageViewStyles.newsListItem}>
              <Text as="h5" variant="h5" className={sumrv2PageViewStyles.newsListItemTitle}>
                {title}
              </Text>
              <Text as="p" variant="p2" className={sumrv2PageViewStyles.newsListItemDescription}>
                {description}
              </Text>
              <WithArrow variant="p2semi">
                <Link href={link} target="_blank">
                  <Text variant="p2semi">Read more</Text>
                </Link>
              </WithArrow>
            </div>
          ))
        ) : (
          <Text as="p" variant="p3" style={{ margin: '40px', textAlign: 'center' }}>
            No news available at the moment. Please check back later.
          </Text>
        )}
      </div>
    </Card>
  )
}

export const SumrV2PageView = ({
  apyRanges,
}: {
  apyRanges: {
    eth: { minApy: number; maxApy: number }
    stablecoins: { minApy: number; maxApy: number }
  }
}) => {
  const { userWalletAddress } = useUserWallet()

  return (
    <div className={sumrv2PageViewStyles.wrapper}>
      <TwoColumnHeader />
      <Text
        as="h2"
        variant="h2"
        className={sumrv2PageViewStyles.innerHeader}
        style={{
          marginTop: '140px',
          marginBottom: '50px',
        }}
      >
        What you need to know
      </Text>
      <SectionTabs
        wrapperStyle={{
          margin: '0 auto',
        }}
        sections={[
          {
            id: 'facts',
            title: 'Facts',
            content: (
              <div className={sumrv2PageViewStyles.sectionCardWrapper}>
                <SectionCard>
                  <Image
                    src={sumrStakingDiagram}
                    alt="SUMR Staking Diagram"
                    quality={100}
                    style={{ maxWidth: '85%' }}
                  />
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">Govern Lazy Summer Protocol</Text>
                    <Text as="p" variant="p3">
                      Steer which yield sources and networks are onboarded, how capital is
                      allocated, and how contributors are rewarded.
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">Earn more SUMR</Text>
                    <Text as="p" variant="p3">
                      Stake SUMR tokens to receive additional SUMR emissions (longer lock = higher
                      share).
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">Share in protocol growth</Text>
                    <Text as="p" variant="p3">
                      Receive a share of protocol revenues as auto compounding USDC denominated LV
                      vault tokens.
                    </Text>
                  </div>
                </SectionCard>
                <Link href="/staking/manage" prefetch>
                  <Button variant="primarySmall">Stake SUMR</Button>
                </Link>
              </div>
            ),
          },
          {
            id: 'timeline',
            title: 'SUMR Transferability timeline',
            content: (
              <div className={sumrv2PageViewStyles.sectionCardWrapper}>
                <SectionCard>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">TBD Date Huh?</Text>
                    <Text as="p" variant="p3">
                      Staking v2 goes live. SUMR holders can now stake in v2 to earn additional SUMR
                      rewards and USDC.
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">January 21, 2026</Text>
                    <Text as="p" variant="p3">
                      SUMR starts trading and can be bought and sold freely. Based on the market
                      price SUMR APYs may fluctuate, earning you even more.
                    </Text>
                  </div>
                </SectionCard>
                <Link href="/staking/manage" prefetch>
                  <Button variant="primarySmall">Stake SUMR</Button>
                </Link>
              </div>
            ),
          },
        ]}
      />
      <NewsList
        newsItems={[
          {
            title: 'Lazy Summer and SUMR, a protocol with a business model, not just a token',
            description:
              'Lazy Summer Protocol makes DeFi’s best yield sources accessible through automation and risk curation. SUMR aligns users with the protocol’s growth, turning transparent yield access into a sustainable, governance-driven business model.',
            link: 'https://blog.summer.fi/lazy-summer-and-sumr-a-protocol-with-a-business-model-not-just-a-token/',
          },
          {
            title: 'SUMR Staking Launch and how to blog',
            description: 'Huh?',
            link: '#',
          },
        ]}
      />
      <Text
        as="h2"
        variant="h2"
        className={sumrv2PageViewStyles.innerHeader}
        style={{
          marginTop: '80px',
          marginBottom: '64px',
        }}
      >
        Governance power, tokenomic’s designed for value accrual
      </Text>
      <SectionTabs
        wrapperStyle={{
          margin: '0 auto',
        }}
        sections={[
          {
            id: 'governance',
            title: 'Govern Lazy Summer',
            content: (
              <div className={sumrv2PageViewStyles.sectionCardWrapper}>
                <Text variant="h3">The only way to govern Lazy Summer Protocol</Text>
                <SectionCard>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <Icon iconName="big_pot" size={64} />
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">Curate the best of DeFi</Text>
                      <Text as="p" variant="p2semi">
                        Approve or offboard markets, ensuring only the best and safest yield
                        opportunities are available.
                      </Text>
                    </div>
                  </div>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <Icon iconName="big_certificate" size={64} />
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">Keep contributors accountable</Text>
                      <Text as="p" variant="p2semi">
                        Monitor and hold third-party contributors (such as Keepers and Risk
                        Curators) accountable, ensuring consistent, responsible protocol management.
                      </Text>
                    </div>
                  </div>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <Icon iconName="big_reload" size={64} />
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">Allocate Protocol Capital</Text>
                      <Text as="p" variant="p2semi">
                        Decide on how to spend revenue, allocate SUMR token rewards and issue grants
                        to balance growth with long term sustainability.
                      </Text>
                    </div>
                  </div>
                </SectionCard>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <WithArrow variant="p3semi" style={{ marginLeft: '20px', alignSelf: 'center' }}>
                    <Link href={`/claim/${userWalletAddress}`}>
                      <Text variant="p3semi">Claim $SUMR</Text>
                    </Link>
                  </WithArrow>
                </div>
              </div>
            ),
          },
          {
            id: 'tokenomics',
            title: 'SUMR Tokenomic’s',
            content: (
              <div className={sumrv2PageViewStyles.sectionCardWrapper}>
                <Text variant="h3">A protocol with a business model, not just a token</Text>
                <SectionCard>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <Text variant="p1">
                      SUMR is the ownership and governance token of Lazy Summer Protocol, tied
                      directly to real revenue, real yield, and aligned incentives.
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">The revenue engine: fees on real DeFi yield</Text>
                      <Text as="p" variant="p2semi">
                        As TVL grows, protocol revenue scales, creating a clear economic engine
                        behind SUMR.
                      </Text>
                    </div>
                  </div>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">Staking: SUMR as a productive asset</Text>
                      <Text as="p" variant="p2semi">
                        Staking SUMR gives holders an **active claim on protocol growth**:
                        <br />
                        USDC from protocol revenue, Additional SUMR rewards and Governance power.
                      </Text>
                    </div>
                  </div>
                  <div className={sumrv2PageViewStyles.governanceSectionText}>
                    <div className={sumrv2PageViewStyles.governanceSectionDescription}>
                      <Text variant="h5">
                        Incentive alignment: Depositors, SUMR Holders & Lazy Summer Protocol.
                      </Text>
                      <Text as="p" variant="p2semi">
                        Depositors get automated DeFi yield, SUMR holders capture value via staking
                        rewards, USDC distributions, and control over the treasury.
                      </Text>
                    </div>
                  </div>
                </SectionCard>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Link href="https://gov.summer.fi/" target="_blank">
                    <Button variant="primarySmall">Go to Governance</Button>
                  </Link>
                  <WithArrow variant="p3semi" style={{ marginLeft: '20px', alignSelf: 'center' }}>
                    <Link href={`/claim/${userWalletAddress}`}>
                      <Text variant="p3semi">Claim $SUMR</Text>
                    </Link>
                  </WithArrow>
                </div>
              </div>
            ),
          },
        ]}
      />
      <WaysToAccessSumr
        className={sumrv2PageViewStyles.waysToAccessSumrSection}
        apyRanges={apyRanges}
      />
      <SectionCard className={sumrv2PageViewStyles.understandingSumr}>
        <div className={sumrv2PageViewStyles.understandingSumrText}>
          <Text as="h2" variant="h2">
            Understanding <span>$SUMR</span>
          </Text>
          <Text variant="p1">
            $SUMR is the governance token for the Lazy Summer Protocol. A DeFi yield optimization
            protocol that earns DeFi’s highest quality yields, all of the time, for everyone.
          </Text>
          <Link href="Huh?">
            <Button variant="primaryLarge">Read the SUMR thesis</Button>
          </Link>
        </div>
        <Image src={sumrTokenBubbles} alt="SUMR Token Bubbles" />
      </SectionCard>
      <FaqSection
        wrapperClassName={sumrv2PageViewStyles.faqSection}
        data={[
          {
            title: 'What is SUMR?',
            content:
              'SUMR is the governance token of Lazy Summer Protocol. SUMR holders steer the protocol (via Governance V2) and can share in protocol growth through staking rewards and revenue distributions.',
          },
          {
            title: 'How does SUMR capture value from Lazy Summer?',
            content:
              'Lazy Summer charges fees on yield generated in its vaults. A portion of this protocol revenue flows to the treasury, and from there to SUMR stakers (in USDC LV vault tokens) and ecosystem growth, as decided by governance.',
          },
          {
            title: 'Do I need SUMR to use Lazy Summer?',
            content:
              'No. Anyone can deposit into Lazy Summer vaults without holding SUMR. SUMR is for users who want governance influence and economic exposure to protocol growth on top of vault yield. Though, all depositors in Lazy Summer do earn SUMR.',
          },
          {
            title: 'What is SUMR Staking V2?',
            content:
              'It’s the upgraded SUMR staking & locking system that powers Governance V2. When you lock SUMR, you get governance power, ongoing SUMR emissions, and a share of protocol revenue paid in USDC (via LV vault tokens).',
          },
          {
            title: 'What’s new vs Staking V1?',
            content:
              'V1 only paid SUMR. V2 adds dual rewards (SUMR + USDC), conviction-weighted locking (longer lock → higher multiplier), capacity buckets per duration, and clear early withdrawal rules.',
          },
          {
            title: 'Why should I stake SUMR?',
            content: (
              <>
                Three reasons:
                <br />
                <br />
                1. Govern Lazy Summer (curate ARKs, allocate capital, hold contributors accountable)
                <br />
                2. Earn more SUMR via emissions
                <br />
                3. Share protocol revenue in auto-compounding USDC LV vault tokens.
              </>
            ),
          },
          {
            title: 'How do rewards work?',
            content: (
              <>
                You earn:
                <br />
                <br />- SUMR emissions proportional to your stake and lock multiplier
                <br />- USDC yield share currently 20% of protocol yield flows to lockers as LV
                vault tokens that keep compounding.
              </>
            ),
          },
          {
            title: 'How does locking & penalties work?',
            content:
              'You choose a lock duration from no lock up to ~3 years. Longer lock = more voting power + higher rewards. You can exit early but pay a penalty that decreases linearly as you approach the end of your lock.',
          },
          {
            title: 'How do I migrate from Staking V1 to V2?',
            content: (
              <>
                1. Go to Portfolio → SUMR Rewards / Staking
                <br />
                2. Unstake from V1 and claim any pending SUMR
                <br />
                3. Open Staking V2, choose amount + lock duration(s), and confirm the new stake.
              </>
            ),
          },
        ]}
      />
    </div>
  )
}
