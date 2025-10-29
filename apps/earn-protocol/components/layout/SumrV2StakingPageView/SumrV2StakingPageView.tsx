'use client'
import { type FC } from 'react'
import { Button, Card, GradientBox, Text } from '@summerfi/app-earn-ui'
import { formatCryptoBalance } from '@summerfi/app-utils'
import { SDKContextProvider } from '@summerfi/sdk-client-react'

import { SumrV2PageHeader } from '@/components/layout/SumrV2PageHeader/SumrV2PageHeader'
import { sdkApiUrl } from '@/constants/sdk'

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
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <SumrV2PageHeader />
      <div className={sumrV2PageStyles.sumrPageV2Wrapper}>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <GradientBox selected style={{ cursor: 'auto' }}>
            <Card className={sumrV2PageStyles.cardCentered}>
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
          <Card className={sumrV2PageStyles.cardCentered}>
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
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card>SUMR Staking USD Yield</Card>
          <Card>SUMR Staking APY</Card>
        </div>
        <div className={sumrV2PageStyles.twoCardsWrapper}>
          <Card>Lazy Summer Annulized Revenue</Card>
          <Card>Revenue share paid to Stakers</Card>
        </div>
      </div>
    </SDKContextProvider>
  )
}
