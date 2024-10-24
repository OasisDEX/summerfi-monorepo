import { Icon, TableCellText, WithArrow } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatFiatBalance, timeAgo } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { type YieldSourcesRawData } from '@/features/strategy-details/components/StrategyDetailsYieldSources/config'

export const yieldSourcesMapper = (rawData: YieldSourcesRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        strategy: (
          <Link href={item.strategy.href}>
            <WithArrow as="p" variant="p3" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              {item.strategy.label}
            </WithArrow>
          </Link>
        ),
        allocation: (
          <TableCellText>{formatDecimalAsPercent(new BigNumber(item.allocation))}</TableCellText>
        ),
        protocol: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8' }}>
            <Icon tokenName={item.protocol.icon} variant="s" /> {item.protocol.label}
          </div>
        ),
        protocolNetDeposits: (
          <TableCellText>
            {formatFiatBalance(new BigNumber(item.protocolNetDeposits))}
          </TableCellText>
        ),
        longevity: (
          <TableCellText>
            {timeAgo({ to: new Date(Number(item.longevity)) }).split(' ago')[0]}
          </TableCellText>
        ),
      },
    }
  })
}
