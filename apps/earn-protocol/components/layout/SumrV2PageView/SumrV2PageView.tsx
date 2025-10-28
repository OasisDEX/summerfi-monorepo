import { Button, Card, CountDown, GradientBox, Text, YieldSourceLabel } from '@summerfi/app-earn-ui'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Image from 'next/image'

import sumrLogo from '@/public/img/branding/logo-dark.svg'

import sumrv2PageViewStyles from './SumrV2PageView.module.css'

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
    </div>
  )
}
