'use client'
import { type FC } from 'react'
import {
  Button,
  Card,
  DataBlock,
  FaqSection,
  GradientBox,
  Icon,
  Text,
  Tooltip,
  YieldSourceLabel,
} from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'
import Link from 'next/link'

import { SumrV2PageHeader } from '@/components/layout/SumrV2PageHeader/SumrV2PageHeader'
import { SumrPriceBar } from '@/components/molecules/SumrPriceBar/SumrPriceBar'
import { sdkApiUrl } from '@/constants/sdk'
import { useHandleTooltipOpenEvent } from '@/hooks/use-mixpanel-event'

import sumrV2PageStyles from './SumrV2StakingPageView.module.css'

interface SumrV2StakingPageViewProps {}

const mockData = {
  // TODOStakingV2
  sumrInWallet: 98300,
  sumrStaked: 125000,
  sumrAvailableToClaim: 5420,
  sumrPrice: 0.0412,
}

export const SumrV2StakingPageView: FC<SumrV2StakingPageViewProps> = () => {
  const tooltipEventHandler = useHandleTooltipOpenEvent()

  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2PageHeader />
      <div className={sumrV2PageStyles.sumrPageV2Wrapper}>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <GradientBox selected style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered} variant="cardSecondary">
              <Text as="p" variant="p3semi">
                SUMR in your wallet and available to stake
              </Text>
              <Text as="h4" variant="h4">
                {formatCryptoBalance(mockData.sumrInWallet)} SUMR
                <Text as="span" variant="p4semi">
                  ${formatCryptoBalance(mockData.sumrInWallet * mockData.sumrPrice)}
                </Text>
              </Text>
              <Button variant="primarySmall">Stake your SUMR</Button>
            </Card>
          </GradientBox>
          <GradientBox style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered} variant="cardSecondary">
              <Text as="p" variant="p3semi">
                SUMR available to claim
              </Text>
              <Text as="h4" variant="h4">
                {formatCryptoBalance(mockData.sumrAvailableToClaim)} SUMR
                <Text as="span" variant="p4semi">
                  ${formatCryptoBalance(mockData.sumrAvailableToClaim * mockData.sumrPrice)}
                </Text>
              </Text>
              <Button variant="secondarySmall">Claim your SUMR</Button>
            </Card>
          </GradientBox>
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="usdc_circle_color" variant="s" />
                  <Text as="p" variant="p2semi">
                    SUMR Staking USD Yield
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        $SUMR available to claim across all networks. Mainet, Base, and Arbitrum
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-staking-usd-yield-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h5">up to</Text>&nbsp;
                  <Text variant="h4">7.32%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue="Up to $25,323 /Year"
              subValueType="positive"
            />
            <YieldSourceLabel label="Yield source 1" />
          </Card>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="sumr" variant="s" />
                  <Text as="p" variant="p2semi">
                    SUMR Staking APY
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        Huh?
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-staking-apy-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h5">up to</Text>&nbsp;
                  <Text variant="h4">5.32%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue="Up to 11.18k $SUMR /Year ($13,322.83)"
              subValueType="positive"
            />
            <YieldSourceLabel label="Yield source 2" />
          </Card>
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Text as="p" variant="p2semi">
                    Lazy Summer Annulized Revenue
                  </Text>
                  <Tooltip
                    tooltip={
                      <Text as="p" variant="p4semi">
                        Huh?
                      </Text>
                    }
                    tooltipWrapperStyles={{ minWidth: '240px' }}
                    tooltipName="sumr-annulized-revenue-info"
                    onTooltipOpen={tooltipEventHandler}
                  >
                    <Icon iconName="info" variant="s" />
                  </Tooltip>
                </div>
              }
              value={
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h4">$2,323,322.32</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue="433m Lazy Summer TVL"
            />
            <Link href="#">
              <Button variant="textPrimaryMedium" style={{ paddingTop: '2px' }}>
                Simulate USD yield payoff
              </Button>
            </Link>
          </Card>
          <Card className={sumrV2PageStyles.cardDataBlock} variant="cardSecondary">
            <DataBlock
              title={
                <Text as="p" variant="p2semi">
                  Revenue share paid to Stakers
                </Text>
              }
              value={
                <div className={sumrV2PageStyles.cardDataBlockValue}>
                  <Text variant="h4">20%</Text>
                </div>
              }
              valueStyle={{
                color: 'white',
              }}
              subValue="$252,052 a year"
            />
          </Card>
        </div>
        <FaqSection
          customTitle=""
          wrapperClassName={sumrV2PageStyles.middleFaqSectionWrapper}
          data={[
            {
              title: (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <div className={sumrV2PageStyles.tokenPairIcon}>
                    <Icon iconName="sumr" size={20} />
                    <Icon iconName="usdc_circle_color" size={25} />
                  </div>
                  <Text variant="p2semi">How you earn 2 sources of yield USDC and SUMR?</Text>
                </div>
              ),
              content: 'Huh?',
            },
            {
              title: (
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-4)' }}
                >
                  <Icon iconName="sumr" size={20} />
                  <Text variant="p2semi">What is SUMR Staking?</Text>
                </div>
              ),
              content: 'Huh? Huuuh? Huuuuuh? What? Huh?',
            },
          ]}
        />
        <SumrPriceBar />
      </div>
    </SDKContextProvider>
  )
}
