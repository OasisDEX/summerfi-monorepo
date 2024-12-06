import { type FC } from 'react'
import { type NetworkIds, type Risk, type SDKNetwork, type SDKVaultType } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { riskColors } from '@/helpers/risk-colors'

interface VaultTitleWithRiskProps {
  risk: Risk
  symbol: SDKVaultType['inputToken']['symbol']
  networkId?: NetworkIds
  networkName?: SDKNetwork
  selected?: boolean
}

export const VaultTitleWithRisk: FC<VaultTitleWithRiskProps> = ({
  symbol,
  risk,
  networkId,
  networkName,
  selected,
}) => {
  const color = riskColors[risk]

  return (
    <VaultTitle
      symbol={symbol}
      networkId={networkId}
      selected={selected}
      /* networkName should work 99% of the time, because SDKVault returns very similar results for that */
      networkName={networkName}
      value={
        <>
          <Text as="p" variant="p3" style={{ color }}>
            {capitalize(risk)} risk
          </Text>
          <Tooltip tooltip="TBD">
            <Icon iconName="question_o" variant="s" color={color} />
          </Tooltip>
        </>
      }
    />
  )
}
