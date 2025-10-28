import {
  Button,
  Card,
  CountDown,
  GradientBox,
  SectionTabs,
  Text,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Image from 'next/image'

import sumrLogo from '@/public/img/branding/logo-dark.svg'

import sumrv2PageViewStyles from './SumrV2PageView.module.css'

import sumrStakingDiagram from '@/public/img/sumr/staking_diagram.png'

const SectionCard = ({ children }: { children: React.ReactNode }) => {
  return <Card className={sumrv2PageViewStyles.sectionCard}>{children}</Card>
}

export const SumrV2PageView = () => {
  return (
    <div className={sumrv2PageViewStyles.wrapper}>
      <div className={sumrv2PageViewStyles.twoColumnHeader}>
        <div
          className={clsx(
            sumrv2PageViewStyles.twoColumnHeaderBlock,
            sumrv2PageViewStyles.leftBlock,
          )}
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
    </div>
  )
}
