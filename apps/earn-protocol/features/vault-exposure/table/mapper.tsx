import {
  getDisplayToken,
  Icon,
  TableCellNodes,
  TableCellText,
  TableRowAccent,
  type TableSortedColumn,
  Text,
  WithArrow,
} from '@summerfi/app-earn-ui'
import { type SDKNetwork, type SDKVaultType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import BigNumber from 'bignumber.js'
import Link from 'next/link'

import { vaultExposureSorter } from '@/features/vault-exposure/table/sorter'
import { getColor } from '@/helpers/get-color'
import { getProtocolLabel } from '@/helpers/get-protocol-label'

import { arkDetailsMap } from './ark-details'

export const vaultExposureMapper = (
  vault: SDKVaultType,
  arksInterestRates?: { [key: string]: number },
  sortConfig?: TableSortedColumn<string>,
) => {
  const vaultInputToken = vault.inputTokenBalance

  const extendedArks = vault.arks.map((ark) => {
    const arkInterestRate = arksInterestRates?.[ark.name as string]

    const apy = isNaN(Number(arkInterestRate))
      ? new BigNumber(0)
      : new BigNumber(arkInterestRate ?? 0).div(100)

    return {
      ...ark,
      apy,
    }
  })

  const sortedArks = vaultExposureSorter({ extendedArks, sortConfig })

  const vaultNetwork = vault.protocol.network as
    | SDKNetwork.Mainnet
    | SDKNetwork.ArbitrumOne
    | SDKNetwork.Base

  return sortedArks.map((item) => {
    const allocationRaw = new BigNumber(item.inputTokenBalance.toString()).shiftedBy(
      -vault.inputToken.decimals,
    )
    const allocation =
      vaultInputToken.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(vaultInputToken.toString())
        : '0'

    const cap =
      item.depositLimit.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(item.depositLimit.toString())
        : '0'

    const protocol = item.name?.split('-') ?? ['n/a']
    const protocolLabel = getProtocolLabel(protocol)

    let arkDetails

    try {
      arkDetails = arkDetailsMap[vaultNetwork][item.id]
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Error fetching ark details for ${item.id} on ${vaultNetwork}`, error)
    }

    return {
      content: {
        vault: (
          <TableCellNodes>
            <TableRowAccent backgroundColor={getColor(protocolLabel)} />
            <Icon
              tokenName={getDisplayToken(item.inputToken.symbol) as TokenSymbolsList}
              variant="s"
            />
            <TableCellText>{protocolLabel}</TableCellText>
          </TableCellNodes>
        ),
        allocation: <TableCellText>{formatDecimalAsPercent(allocation)}</TableCellText>,
        currentApy: <TableCellText>{formatDecimalAsPercent(item.apy)}</TableCellText>,
        liquidity: <TableCellText>{formatCryptoBalance(allocationRaw)}</TableCellText>,
        cap: <TableCellText>{formatDecimalAsPercent(cap)}</TableCellText>,
      },
      details: arkDetails ? (
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
            {arkDetails.description}
          </Text>
          {arkDetails.link && (
            <Link href={arkDetails.link} target="_blank" rel="noreferrer">
              <WithArrow
                as="p"
                variant="p4semi"
                style={{ color: 'var(--earn-protocol-primary-100)' }}
              >
                Learn more
              </WithArrow>
            </Link>
          )}
        </div>
      ) : (
        <div
          style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-space-medium)' }}
        >
          No data available
        </div>
      ),
    }
  })
}
