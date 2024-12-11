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

export const arkNameMap: { [key: string]: string } = {
  BufferArk: 'Buffer',
  AaveV3: 'Aave V3',
  CompoundV3: 'Compound V3',
  PendlePt: 'Pendle',
}

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
    const allocation = new BigNumber(item.inputTokenBalance.toString()).div(
      vaultInputToken.toString(),
    )

    const apr = new BigNumber(item.calculatedApr.toString()).div(100)

    // temporary mapping, we need something more robust from subgraph
    const protocol = item.name?.split('-') ?? ['n/a']

    // New mapping logic
    const formatActionName = (nameParts: string[]) => {
      const cleanedName = nameParts.slice(0, -1).join('-');

      const baseName = cleanedName.split('-')[0];
      if (baseName === 'MetaMorpho' || baseName === 'MorphoVault') {
        return "Morpho " + cleanedName.split('-').slice(2).join(' ').replace(/_/g, ' ');
      } else if (baseName === 'ERC4626') {
        const secondPart = cleanedName.split('-')[1];
        return secondPart.charAt(0).toUpperCase() + secondPart.slice(1);
      }
      return arkNameMap[baseName] ?? baseName;
    }

    const protocolLabel = formatActionName(protocol);

    return {
      content: {
        vault: (
          <TableCellNodes>
            <TableRowAccent backgroundColor="var(--earn-protocol-accent-1-100)" />
            <Icon tokenName={item.inputToken.symbol as TokenSymbolsList} variant="s" />
            <TableCellText>{protocolLabel}</TableCellText>
          </TableCellNodes>
        ),
        allocation: <TableCellText>{formatDecimalAsPercent(allocation)}</TableCellText>,
        currentApy: <TableCellText>{formatDecimalAsPercent(apr)}</TableCellText>,
        liquidity: <TableCellText>{formatCryptoBalance(allocationRaw)}</TableCellText>,
        type: <TableCellText>TBD</TableCellText>,
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
