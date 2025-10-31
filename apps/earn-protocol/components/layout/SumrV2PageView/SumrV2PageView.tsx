import {
  Button,
  Card,
  CountDown,
  FaqSection,
  GradientBox,
  Icon,
  SectionTabs,
  Text,
  WithArrow,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import dayjs from 'dayjs'
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
          SUMR: DeFi’s productive asset that powers the leading yield aggregator.
        </Text>
        <Text as="p" variant="p1">
          Description of SUMR and supporting text to title
        </Text>
        <div className={sumrv2PageViewStyles.leftBlockButtons}>
          <Button variant="primarySmall">Buy SUMR</Button>
          <Button variant="textSecondarySmall">Stake SUMR</Button>
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
                SUMR USDC
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
          <div className={sumrv2PageViewStyles.rightBlockBottomBorder} />
          <div className={sumrv2PageViewStyles.rightBlockCountdown}>
            <Text variant="p2semi">Trade SUMR in:</Text>
            <CountDown
              futureTimestamp={dayjs('2025-11-18T00:00:00Z').toISOString()}
              itemVariant="small"
            />
          </div>
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
                <Link href={link}>
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

export const SumrV2PageView = () => {
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
                    <Text variant="p2semi">Curate the best of DeFi</Text>
                    <Text as="p" variant="p3">
                      Approve or off board markets, ensuring only the best and safest yield
                      opportunities are available.
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">Curate the best of DeFi</Text>
                    <Text as="p" variant="p3">
                      Approve or off board markets, ensuring only the best and safest yield
                      opportunities are available.
                    </Text>
                  </div>
                  <div className={sumrv2PageViewStyles.factsSectionText}>
                    <Text variant="p2semi">Curate the best of DeFi</Text>
                    <Text as="p" variant="p3">
                      Approve or off board markets, ensuring only the best and safest yield
                      opportunities are available.
                    </Text>
                  </div>
                </SectionCard>
                <Button variant="primarySmall">Stake SUMR</Button>
              </div>
            ),
          },
          {
            id: 'timeline',
            title: 'Timeline',
            content: (
              <SectionCard>
                <Image
                  src={sumrStakingDiagram}
                  alt="SUMR Staking Diagram"
                  quality={100}
                  style={{ maxWidth: '85%' }}
                />
                Huh?
              </SectionCard>
            ),
          },
          {
            id: 'faq',
            title: 'FAQ',
            content: (
              <SectionCard>
                <Image
                  src={sumrStakingDiagram}
                  alt="SUMR Staking Diagram"
                  quality={100}
                  style={{ maxWidth: '85%' }}
                />
                Huh?
              </SectionCard>
            ),
          },
        ]}
      />
      <NewsList
        newsItems={[
          {
            title: 'Lazy Summer SUMR token has surged over 200% since launch',
            description:
              'With rising TVL, active governance, and expanding institutional adoption, SUMR aligns incentives across depositors and delegates—powering product growth while rewarding long-term participation.',
            link: '#',
          },
          {
            title: 'BlackRock partnership brings new scale to Lazy Summer’s DeFi ecosystem',
            description:
              'Prototech Labs, formed of some of the original engineers who built the Maker Protocol, is a DeFi & Web3 professional services consultancy helping businesses, DAOs, and protocols implement innovative blockchain solutions.',
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
                        Approve or off board markets, ensuring only the best and safest yield
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
                  <Button variant="primarySmall">Go to Governance</Button>
                  <WithArrow variant="p3semi" style={{ marginLeft: '20px', alignSelf: 'center' }}>
                    <Link href="Huh?">
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
            content: <SectionCard>Huh?</SectionCard>,
          },
        ]}
      />
      <WaysToAccessSumr className={sumrv2PageViewStyles.waysToAccessSumrSection} />
      <SectionCard className={sumrv2PageViewStyles.understandingSumr}>
        <div className={sumrv2PageViewStyles.understandingSumrText}>
          <Text as="h2" variant="h2">
            Understanding <span>$SUMR</span>
          </Text>
          <Text variant="p1">
            $SUMR is the governance token for the Lazy Summer Protocol. A DeFi yield optimization
            protocol that earns DeFi’s highest quality yields, all of the time, for everyone.
          </Text>
          <Button variant="primaryLarge">Read the SUMR thesis</Button>
        </div>
        <Image src={sumrTokenBubbles} alt="SUMR Token Bubbles" />
      </SectionCard>
      <FaqSection
        wrapperClassName={sumrv2PageViewStyles.faqSection}
        data={[
          {
            title: 'What is the $SUMR token airdrop?',
            content: 'Huuh?',
          },
          {
            title: 'Who qualifies for the $SUMR token airdrop?',
            content: 'Huuh? Whaat?',
          },
          {
            title: 'When will the $SUMR tokens start trading?',
            content: 'Huuh? Whaat? Yes?',
          },
          {
            title: 'Will the conversion rate for $RAYS in Season 2 be the same as Season 1?',
            content: 'Huuh? Whaat? Yes? No?',
          },
        ]}
      />
    </div>
  )
}
