import { type FC } from 'react'
import { type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash-es'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'

interface StrategyTitleWithRiskProps {
  symbol: TokenSymbolsList
  risk: Risk
}

export const StrategyTitleWithRisk: FC<StrategyTitleWithRiskProps> = ({ symbol, risk }) => {
  // used raw colors due to issues with Icon scss computed colors
  const color = {
    high: 'rgba(255, 87, 57, 1)', // var(--earn-protocol-critical-100)'
    medium: 'rgba(249, 166, 1, 1)', // 'var(--earn-protocol-warning-100)'
    low: 'rgba(105, 223, 49, 1)', // 'var(--earn-protocol-success-100)'
  }[risk]

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon tokenName={symbol} variant="xxl" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Text as="h4" variant="h4" style={{ color: 'white', fontSize: '24px', lineHeight: '30px' }}>
          {symbol}
        </Text>
        <div style={{ display: 'flex', gap: '4px' }}>
          <Text as="p" variant="p3" style={{ color }}>
            {capitalize(risk)} risk
          </Text>
          <Tooltip tooltip="TBD">
            <Icon iconName="question_o" variant="s" color={color} />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}
