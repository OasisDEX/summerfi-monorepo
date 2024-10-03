import React, { type FC } from 'react'
import { Icon, Text, Tooltip } from '@summerfi/app-earn-ui'
import { type Risk, type TokenSymbolsList } from '@summerfi/app-types'
import { capitalize } from 'lodash'

interface StrategyWithRiskProps {
  symbol: TokenSymbolsList
  risk: Risk
}

export const StrategyWithRisk: FC<StrategyWithRiskProps> = ({ symbol, risk }) => {
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
