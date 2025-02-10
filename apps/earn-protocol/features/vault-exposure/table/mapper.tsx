import {
  Icon,
  TableCellNodes,
  TableCellText,
  TableRowAccent,
  type TableSortedColumn,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKVaultType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { rebalanceActivitySorter } from '@/features/vault-exposure/table/sorter'
import { getColor } from '@/helpers/get-color'
import { getProtocolLabel } from '@/helpers/get-protocol-label'

export const vaultExposureMapper = (
  vault: SDKVaultType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const vaultInputToken = vault.inputTokenBalance
  const sortedArks = rebalanceActivitySorter({ vault, sortConfig })

  return sortedArks.map((item) => {
    const allocationRaw = new BigNumber(item.inputTokenBalance.toString()).shiftedBy(
      -vault.inputToken.decimals,
    )
    const allocation =
      vaultInputToken.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(vaultInputToken.toString())
        : '0'

    const arkInterestRate = vault.customFields?.arksInterestRates?.[item.name as string]

    const apr = isNaN(Number(arkInterestRate))
      ? new BigNumber(0)
      : new BigNumber(arkInterestRate ?? 0).div(100)

    const cap =
      item.depositLimit.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(item.depositLimit.toString())
        : '0'

    const protocol = item.name?.split('-') ?? ['n/a']
    const protocolLabel = getProtocolLabel(protocol)

    return {
      content: {
        vault: (
          <TableCellNodes>
            <TableRowAccent backgroundColor={getColor(protocolLabel)} />
            <Icon tokenName={item.inputToken.symbol as TokenSymbolsList} variant="s" />
            <TableCellText>{protocolLabel}</TableCellText>
          </TableCellNodes>
        ),
        allocation: <TableCellText>{formatDecimalAsPercent(allocation)}</TableCellText>,
        currentApy: <TableCellText>{formatDecimalAsPercent(apr)}</TableCellText>,
        liquidity: <TableCellText>{formatCryptoBalance(allocationRaw)}</TableCellText>,
        cap: <TableCellText>{formatDecimalAsPercent(cap)}</TableCellText>,
      },
      details: (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          <Text as="p" variant="p4semi" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
            Why this vault?
          </Text>
          <Text
            as="p"
            variant="p3"
            style={{ color: 'var(--earn-protocol-secondary-100)', fontWeight: '500' }}
          >
            MetaMorpho Gauntlet MKR Blended was chosen for it’s performance track record, risk
            approach and asset exposure.
          </Text>
          <Link href="/apps/earn-protocol/public">
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
