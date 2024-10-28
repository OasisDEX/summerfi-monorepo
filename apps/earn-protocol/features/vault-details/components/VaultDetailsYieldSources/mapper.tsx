import { Icon, TableCellText, WithArrow } from '@summerfi/app-earn-ui'
import { formatDecimalAsPercent, formatFiatBalance, timeAgo } from '@summerfi/app-utils'
import Link from 'next/link'

import { type YieldSourcesRawData } from '@/features/vault-details/components/VaultDetailsYieldSources/config'

export const yieldSourcesMapper = (rawData: YieldSourcesRawData[]) => {
  return rawData.map((item) => {
    return {
      content: {
        vault: (
          <Link href={item.vault.href}>
            <WithArrow as="p" variant="p3" style={{ color: 'var(--earn-protocol-primary-100)' }}>
              {item.vault.label}
            </WithArrow>
          </Link>
        ),
        allocation: <TableCellText>{formatDecimalAsPercent(item.allocation)}</TableCellText>,
        protocol: (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8' }}>
            <Icon tokenName={item.protocol.icon} variant="s" /> {item.protocol.label}
          </div>
        ),
        protocolNetDeposits: (
          <TableCellText>{formatFiatBalance(item.protocolNetDeposits)}</TableCellText>
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
