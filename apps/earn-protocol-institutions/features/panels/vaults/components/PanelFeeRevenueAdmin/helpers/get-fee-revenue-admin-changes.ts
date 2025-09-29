import { formatDecimalAsPercent } from '@summerfi/app-utils'

import { type PanelFeeRevenueAdminState } from '@/providers/PanelFeeRevenueAdminProvider/PanelFeeRevenueAdminProvider'
import {
  type InstitutionVaultFeeRevenueItem,
  type InstitutionVaultThirdPartyCost,
} from '@/types/institution-data'

/**
 * Helper function to get the changes in the fee revenue admin
 * @param state - State of the fee revenue admin
 * @param feeRevenueData - Raw data for the fee revenue
 * @param thirdPartyCostsData - Raw data for the third party costs
 * @returns {Array} Array of changes in the fee revenue admin
 */
export const getFeeRevenueAdminChanges = ({
  state,
  feeRevenueData,
  thirdPartyCostsData,
}: {
  state: PanelFeeRevenueAdminState
  feeRevenueData: InstitutionVaultFeeRevenueItem[]
  thirdPartyCostsData: InstitutionVaultThirdPartyCost[]
}) => {
  const feeRevenueChange = state.feeRevenueItems.map((item) => {
    const from = feeRevenueData.find((i) => i.name === item.name)?.aumFee ?? 'n/a'

    return {
      title: item.name,
      from: formatDecimalAsPercent(from),
      to: formatDecimalAsPercent(item.aumFee),
    }
  })

  const thirdPartyCostsAggregatedChange = state.thirdPartyCostsItems.reduce<{
    [key: string]: {
      type: string
      changes: { title: string; from: string; to: string }[]
    }
  }>((acc, item) => {
    const originalItem = thirdPartyCostsData.find((i) => i.type === item.type)

    if (!acc[item.type]) {
      acc[item.type] = {
        type: item.type,
        changes: [],
      }
    }

    // check each field for changes
    if (originalItem) {
      if (originalItem.fee !== item.fee) {
        acc[item.type].changes.push({
          title: 'Fee',
          from: formatDecimalAsPercent(originalItem.fee),
          to: formatDecimalAsPercent(item.fee),
        })
      }

      if (originalItem.address !== item.address) {
        acc[item.type].changes.push({
          title: 'Address',
          from: originalItem.address,
          to: item.address,
        })
      }
    }

    return acc
  }, {})

  const thirdPartyCostsChange = Object.entries(thirdPartyCostsAggregatedChange)
    .filter(([_, data]) => data.changes.length > 0)
    .map(([_, data]) => ({
      title: data.type,
      items: data.changes,
    }))

  return [...feeRevenueChange, ...thirdPartyCostsChange]
}
