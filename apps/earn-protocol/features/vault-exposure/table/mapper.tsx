/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  getDisplayToken,
  Icon,
  TableCellAllocationCap,
  TableCellAllocationCapTooltipDataBlock,
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
import dayjs from 'dayjs'
import Link from 'next/link'

import { type GetInterestRatesReturnType } from '@/app/server-handlers/interest-rates'
import { vaultExposureSorter } from '@/features/vault-exposure/table/sorter'
import { getColor } from '@/helpers/get-color'
import { getProtocolLabel } from '@/helpers/get-protocol-label'
import { mapArkLatestInterestRates } from '@/helpers/map-ark-interest-rates'

import { arkDetailsMap } from './ark-details'

type YieldRange = {
  low: BigNumber
  high: BigNumber
}

type ExtendedArk = SDKVaultType['arks'][0] & {
  apy: BigNumber
  avgApy30d: BigNumber
  avgApy1y: BigNumber
  yearlyYieldRange: YieldRange
}

const calculateAverageApy = (rates: { averageRate: number; date: number }[], days: number) => {
  const now = dayjs().unix()
  // eslint-disable-next-line no-mixed-operators
  const cutoffDate = now - days * 24 * 60 * 60
  const relevantRates = rates.filter((rate) => rate.date >= cutoffDate)

  if (relevantRates.length === 0) return new BigNumber(0)

  const sum = relevantRates.reduce(
    (acc, rate) => acc.plus(new BigNumber(rate.averageRate).div(100)),
    new BigNumber(0),
  )

  const avgApy = sum.div(relevantRates.length)

  return avgApy.isNaN() ? new BigNumber(0) : avgApy
}

const calculateYearlyYieldRange = (rates: { averageRate: number; date: number }[]): YieldRange => {
  const now = dayjs().unix()
  // eslint-disable-next-line no-mixed-operators
  const oneYearAgo = now - 365 * 24 * 60 * 60
  const yearlyRates = rates.filter((rate) => rate.date >= oneYearAgo)

  if (yearlyRates.length === 0) return { low: new BigNumber(0), high: new BigNumber(0) }

  const apyValues = yearlyRates.map((rate) => new BigNumber(rate.averageRate).div(100))

  const low = BigNumber.min(...apyValues)
  const high = BigNumber.max(...apyValues)

  return {
    low: low.isNaN() ? new BigNumber(0) : low,
    high: high.isNaN() ? new BigNumber(0) : high,
  }
}

export const vaultExposureMapper = (
  vault: SDKVaultType,
  arksInterestRates: GetInterestRatesReturnType,
  sortConfig?: TableSortedColumn<string>,
) => {
  const vaultInputTokenBalance = vault.inputTokenBalance

  const arksLatestInterestRates = mapArkLatestInterestRates(arksInterestRates)

  const extendedArks = vault.arks.map((ark) => {
    const currentApy = arksLatestInterestRates[ark.name as string]
    const arkRates = arksInterestRates[ark.name as string]

    const apy = isNaN(Number(currentApy))
      ? new BigNumber(0)
      : new BigNumber(currentApy ?? 0).div(100)

    const avgApy30d = calculateAverageApy(arkRates.dailyInterestRates ?? [], 30)
    const avgApy1y = calculateAverageApy(arkRates.dailyInterestRates ?? [], 365)
    const yearlyYieldRange = calculateYearlyYieldRange(arkRates.dailyInterestRates ?? [])

    const extendedArk: ExtendedArk = {
      ...ark,
      apy,
      avgApy30d,
      avgApy1y,
      yearlyYieldRange,
    }

    return extendedArk
  })

  const sortedArks = vaultExposureSorter({ extendedArks, sortConfig })

  const vaultNetwork = vault.protocol.network as
    | SDKNetwork.Mainnet
    | SDKNetwork.ArbitrumOne
    | SDKNetwork.Base

  return sortedArks.map((item) => {
    const arkTokenSymbol = item.inputToken.symbol
    const maxPercentageTVL = new BigNumber(item.maxDepositPercentageOfTVL.toString()).shiftedBy(
      -18 - 2, // -18 because its 'in wei' and then -2 because we want to use formatDecimalAsPercent
    )
    const arkTokenTVL = new BigNumber(item.inputTokenBalance.toString()).shiftedBy(
      -vault.inputToken.decimals,
    )
    const allocationRatio =
      vaultInputTokenBalance.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(vaultInputTokenBalance.toString())
        : '0'
    const capRatio =
      item.depositLimit.toString() !== '0'
        ? new BigNumber(item.inputTokenBalance.toString()).div(item.depositLimit.toString())
        : '0'
    const absoluteAllocationCap =
      item.depositCap.toString() !== '0'
        ? new BigNumber(item.depositCap.toString()).shiftedBy(-item.inputToken.decimals).toString()
        : '0'

    const vaultTvlAllocationCap = new BigNumber(
      new BigNumber(vaultInputTokenBalance.toString()).shiftedBy(-vault.inputToken.decimals),
    ).times(maxPercentageTVL)
    const mainAllocationCap = BigNumber.minimum(absoluteAllocationCap, vaultTvlAllocationCap)

    const protocol = item.name?.split('-') ?? ['n/a']
    const protocolLabel = getProtocolLabel(protocol)
    const isBuffer = protocolLabel === 'Buffer'

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
            <Icon tokenName={getDisplayToken(arkTokenSymbol) as TokenSymbolsList} variant="m" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <TableCellText>{protocolLabel}</TableCellText>
              <TableCellText small style={{ color: 'var(--color-text-secondary)' }}>
                {formatDecimalAsPercent(allocationRatio)} allocated
              </TableCellText>
            </div>
          </TableCellNodes>
        ),
        liveApy: <TableCellText>{isBuffer ? '-' : formatDecimalAsPercent(item.apy)}</TableCellText>,
        avgApy30d: <TableCellText>{formatDecimalAsPercent(item.avgApy30d)}</TableCellText>,
        avgApy1y: <TableCellText>{formatDecimalAsPercent(item.avgApy1y)}</TableCellText>,
        yearlyLow: (
          <TableCellText>{formatDecimalAsPercent(item.yearlyYieldRange.low)}</TableCellText>
        ),
        yearlyHigh: (
          <TableCellText>{formatDecimalAsPercent(item.yearlyYieldRange.high)}</TableCellText>
        ),
        allocated: <TableCellText>{formatCryptoBalance(arkTokenTVL)}</TableCellText>,
        allocationCap: (
          <TableCellNodes>
            <TableCellAllocationCap
              isBuffer={isBuffer}
              capPercent={isBuffer ? 'n/a' : formatDecimalAsPercent(capRatio)}
              tooltipContent={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--general-space-24)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--spacing-space-2x-small)',
                    }}
                  >
                    <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
                      Allocation cap
                    </Text>
                    <Text variant="p3semiColorful" style={{ color: 'var(--color-text-secondary)' }}>
                      {formatCryptoBalance(mainAllocationCap)} {arkTokenSymbol}
                    </Text>
                    <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
                      This is the maximum amount that can be allocated to this strategy within this
                      Vault. It is calculated as the minimum of the absolute and TVL exposure based
                      caps (as shown below).
                    </Text>
                  </div>
                  <div style={{ height: '1px', backgroundColor: 'var(--color-border)' }} />
                  <TableCellAllocationCapTooltipDataBlock
                    title="Absolute allocation cap"
                    value={`${formatCryptoBalance(absoluteAllocationCap)} ${arkTokenSymbol}`}
                  />
                  <TableCellAllocationCapTooltipDataBlock
                    title="TVL allocation cap %"
                    value={`${formatDecimalAsPercent(maxPercentageTVL)} (${formatCryptoBalance(vaultTvlAllocationCap)})`}
                  />
                  <TableCellAllocationCapTooltipDataBlock
                    title="Cap utilisation"
                    value={`${formatDecimalAsPercent(capRatio)} (${formatCryptoBalance(arkTokenTVL)} / ${formatCryptoBalance(mainAllocationCap)})`}
                  />
                </div>
              }
            />
          </TableCellNodes>
        ),
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
