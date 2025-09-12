import { formatDecimalAsPercent, formatWithSeparators } from '@summerfi/app-utils'

import { type MarketRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/types'
import { type VaultRiskParameters } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/types'
import { type PanelRiskParametersState } from '@/providers/PanekRiskParametersProvider/PanelRiskParametersProvider'

/**
 * Helper function to get the changes in the panel risk parameters
 * @param state - State of the panel risk parameters
 * @param vaultRiskRawData - Raw data for the vault risk parameters
 * @param marketRiskRawData - Raw data for the market risk parameters
 * @returns {Array} Array of changes in the panel risk parameters
 */

export const getPanelRiskChanges = ({
  state,
  vaultRiskRawData,
  marketRiskRawData,
}: {
  state: PanelRiskParametersState
  vaultRiskRawData: VaultRiskParameters[]
  marketRiskRawData: MarketRiskParameters[]
}) => {
  const vaultChange = state.vaultRiskItems.map((item) => {
    const from = vaultRiskRawData.find((i) => i.id === item.id)?.value ?? 'n/a'

    return {
      title: item.parameter,
      from: formatWithSeparators(from),
      to: formatWithSeparators(item.value),
    }
  })

  // aggregate market changes by market ID
  const marketChangesByMarket = state.marketRiskItems.reduce<{
    [key: string]: {
      marketName: string
      changes: { title: string; from: string; to: string }[]
    }
  }>((acc, item) => {
    const originalItem = marketRiskRawData.find((i) => i.id === item.id)

    if (!acc[item.id]) {
      acc[item.id] = {
        marketName: item.market,
        changes: [],
      }
    }

    // check each field for changes
    if (originalItem) {
      if (originalItem.marketCap !== item.marketCap) {
        acc[item.id].changes.push({
          title: 'Market Cap',
          from: formatWithSeparators(originalItem.marketCap),
          to: formatWithSeparators(item.marketCap),
        })
      }

      if (originalItem.maxPercentage !== item.maxPercentage) {
        acc[item.id].changes.push({
          title: 'Max Percentage',
          from: formatDecimalAsPercent(originalItem.maxPercentage, { precision: 1 }),
          to: formatDecimalAsPercent(item.maxPercentage, { precision: 1 }),
        })
      }

      if (originalItem.impliedCap !== item.impliedCap) {
        acc[item.id].changes.push({
          title: 'Implied Cap',
          from: formatWithSeparators(originalItem.impliedCap),
          to: formatWithSeparators(item.impliedCap),
        })
      }
    }

    return acc
  }, {})

  // convert aggregated changes to the format expected by EditSummary
  const marketChange = Object.entries(marketChangesByMarket)
    .filter(([_, data]) => data.changes.length > 0)
    .map(([_, data]) => ({
      title: data.marketName,
      items: data.changes,
    }))

  return [...vaultChange, ...marketChange]
}
