import { type FC } from 'react'
import {
  type NetworkIds,
  type RiskType,
  type SDKNetwork,
  type SDKVaultType,
} from '@summerfi/app-types'
import { getVaultRiskTooltipLabel } from '@summerfi/app-utils'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import type TextVariants from '@/components/atoms/Text/Text.module.css'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { riskColors } from '@/helpers/risk-colors'

interface VaultTitleWithRiskProps {
  risk: RiskType
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  selected?: boolean
  isVaultCard?: boolean
  titleVariant?: keyof typeof TextVariants
}

export const VaultTitleWithRisk: FC<VaultTitleWithRiskProps> = ({
  symbol,
  risk,
  networkId,
  networkName,
  selected,
  isVaultCard,
  titleVariant = 'h4semi',
}) => {
  const color = riskColors[risk]
  const riskTooltipLabel = getVaultRiskTooltipLabel({
    risk,
  })

  return (
    <VaultTitle
      symbol={symbol}
      networkId={networkId}
      selected={selected}
      titleVariant={titleVariant}
      isVaultCard={isVaultCard}
      /* networkName should work 99% of the time, because SDKVault returns very similar results for that */
      networkName={networkName}
      value={
        <>
          <Risk risk={risk} variant="p3semi" />
          <Tooltip
            tooltip={riskTooltipLabel}
            tooltipWrapperStyles={{ minWidth: '300px' }}
            stopPropagation
          >
            <Icon iconName="question_o" variant="s" color={color} />
          </Tooltip>
        </>
      }
    />
  )
}
