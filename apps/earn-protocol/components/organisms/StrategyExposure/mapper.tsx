import { TableCellText, Text, TokensGroup, WithArrow } from '@summerfi/app-earn-ui'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { type StrategyExposureRawData } from '@/components/organisms/StrategyExposure/StrategyExposure'

export const strategyExposureMapper = (rawData: StrategyExposureRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        strategy: (
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}
          >
            <TokensGroup
              tokens={[item.strategy.primaryToken, item.strategy.secondaryToken]}
              variant="s"
            />
            <TableCellText>{item.strategy.label}</TableCellText>
          </div>
        ),
        allocation: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.allocation))}</TableCellText>
        ),
        currentApy: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.currentApy))}</TableCellText>
        ),
        liquidity: (
          <TableCellText>{formatCryptoBalance(new BigNumber(item.liquidity))}</TableCellText>
        ),
        type: <TableCellText>{item.type}</TableCellText>,
      },
      details: (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Why this strategy?
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{ color: 'var(--earn-protocol-secondary-100)', fontWeight: '500' }}
          >
            MetaMorpho Gauntlet MKR Blended was chosen for it’s performance track record, risk
            approach and asset exposure.
          </Text>
          <Link href="/">
            <WithArrow
              as="p"
              variant="p4semi"
              style={{ color: 'var(--earn-protocol-primary-100)' }}
            >
              Learn more
            </WithArrow>
          </Link>
        </div>
      ),
    }
  })
}
