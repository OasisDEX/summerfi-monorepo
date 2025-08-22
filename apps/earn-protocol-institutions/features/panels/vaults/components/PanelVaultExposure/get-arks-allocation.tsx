import { type FC, type ReactNode } from 'react'
import { getProtocolLabel, getUniqueColor, Text } from '@summerfi/app-earn-ui'
import { type SDKVaultType } from '@summerfi/app-types'
import { formatDecimalAsPercent } from '@summerfi/app-utils'

interface AllocationItem {
  label: string
  percentage: number
  color: string
  tooltip?: ReactNode
}

interface AggregatedTooltipProps {
  items: { label: string; percentage: number }[]
}

const AggregatedTooltip: FC<AggregatedTooltipProps> = ({ items }) => {
  return (
    <div>
      <Text as="div" variant="p4semi" style={{ marginBottom: '8px' }}>
        Other Protocols:
      </Text>
      {items.map((item, index) => (
        <Text key={index} as="div" variant="p4semi">
          {item.label}{' '}
          <Text as="span" variant="p4semiColorful">
            {formatDecimalAsPercent(item.percentage)}
          </Text>
        </Text>
      ))}
    </div>
  )
}

/**
 * Calculates the allocation of each Ark in a vault.
 * Arks with allocation percentage lower than 2% are aggregated into a single "Other Protocols" item.
 *
 * @param vault - The vault object containing Arks and their input token balances.
 * @returns An array of objects, each representing an Ark's allocation with label, percentage, color, and optional tooltip.
 */
export const getArksAllocation = (vault: SDKVaultType): AllocationItem[] => {
  const totalAllocation = vault.arks.reduce((acc, ark) => acc + Number(ark.inputTokenBalance), 0)

  const allArks = vault.arks
    .filter((ark) => Number(ark.inputTokenBalance) > 0)
    .map((ark) => {
      const protocol = ark.name?.split('-') ?? ['n/a']
      const protocolLabel = getProtocolLabel(protocol)

      return {
        label: protocolLabel,
        percentage: Number(ark.inputTokenBalance) / Number(totalAllocation),
        color: getUniqueColor(protocolLabel),
      }
    })
    .sort((a, b) => b.percentage - a.percentage)

  const threshold = 0.02 // 2%
  const significantArks = allArks.filter((ark) => ark.percentage >= threshold)
  const smallArks = allArks.filter((ark) => ark.percentage < threshold)

  const result: AllocationItem[] = significantArks.map((ark) => ({
    ...ark,
  }))

  // Add aggregated item for small allocations if any exist
  if (smallArks.length > 0) {
    const totalSmallPercentage = smallArks.reduce((acc, ark) => acc + ark.percentage, 0)

    // If the total small percentage is less than 0.01, set it to 0.01 to ensure it's visible
    // in the allocation bar
    const resolvedSmallPercentage = totalSmallPercentage < 0.01 ? 0.01 : totalSmallPercentage

    result.push({
      label: 'Other Protocols',
      percentage: resolvedSmallPercentage,
      color: '#6B7280', // Gray color for aggregated items
      tooltip: <AggregatedTooltip items={smallArks} />,
    })
  }

  return result
}
