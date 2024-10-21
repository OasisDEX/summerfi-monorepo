import { type FC } from 'react'
import {
  type NetworkIds,
  type NetworkNames,
  type Risk,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { StrategyTitle } from '@/components/molecules/StrategyTitle/StrategyTitle.tsx'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { riskColors } from '@/helpers/risk-colors.ts'

interface StrategyTitleWithRiskProps {
  symbol: TokenSymbolsList
  networkId?: NetworkIds
  networkName?: NetworkNames
  risk: Risk
}

export const StrategyTitleWithRisk: FC<StrategyTitleWithRiskProps> = ({
  symbol,
  risk,
  networkId,
  networkName,
}) => {
  const color = riskColors[risk]

  return (
    <StrategyTitle
      symbol={symbol}
      networkId={networkId}
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
