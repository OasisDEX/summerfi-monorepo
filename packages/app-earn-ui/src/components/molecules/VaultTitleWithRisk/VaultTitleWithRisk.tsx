import { type FC } from 'react'
import { type NetworkIds, type Risk, type SDKNetwork, type SDKVaultType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { riskColors } from '@/helpers/risk-colors'

import { type ClassNames as TextVariants } from '@/components/atoms/Text/Text.module.scss'

interface VaultTitleWithRiskProps {
  risk: Risk
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  selected?: boolean
  titleVariant?: TextVariants
}

export const VaultTitleWithRisk: FC<VaultTitleWithRiskProps> = ({
  symbol,
  risk,
  networkId,
  networkName,
  selected,
  titleVariant = 'h4',
}) => {
  const color = riskColors[risk]

  return (
    <VaultTitle
      symbol={symbol}
      networkId={networkId}
      selected={selected}
      titleVariant={titleVariant}
      /* networkName should work 99% of the time, because SDKVault returns very similar results for that */
      networkName={networkName}
      value={
        <>
          <Text as="p" variant="p3" style={{ color }}>
            {capitalize(risk)} Risk
          </Text>
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
