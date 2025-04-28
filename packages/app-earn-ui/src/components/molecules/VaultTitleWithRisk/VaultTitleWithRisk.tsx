import { type FC } from 'react'
import {
  type NetworkIds,
  type RiskType,
  type SDKNetwork,
  type SDKVaultType,
} from '@summerfi/app-types'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { riskColors } from '@/helpers/risk-colors'

import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

interface VaultTitleWithRiskProps {
  risk: RiskType
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  selected?: boolean
  isVaultCard?: boolean
  titleVariant?: TextVariants
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
            tooltip="Lower risk Vaults contain no exposure to peg or swap risk."
            tooltipWrapperStyles={{ minWidth: '200px' }}
          >
            <Icon iconName="question_o" variant="s" color={color} />
          </Tooltip>
        </>
      }
    />
  )
}
