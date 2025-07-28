'use client'

import { type FC } from 'react'
import { Icon, PanelNavigation } from '@summerfi/app-earn-ui'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'

interface IconWithTextProps {
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  text: string
  size: number
}

const IconWithText: FC<IconWithTextProps> = ({ iconName, tokenName, text, size }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}>
      {iconName && <Icon iconName={iconName} size={size} />}
      {tokenName && <Icon tokenName={tokenName} size={size} />}
      {text}
    </div>
  )
}

export const DashboardOverview: FC = () => {
  const navigation = [
    {
      id: '1',
      label: <IconWithText tokenName="USDC" text="USDC-1" size={24} />,
      items: [
        { id: '1', label: 'Overview', action: () => {}, isActive: true },
        { id: '2', label: 'Vault exposure', action: () => {} },
        { id: '3', label: 'Asset rellocation', action: () => {} },
        { id: '4', label: 'Risk Parameters', action: () => {} },
        { id: '5', label: 'Role admin', action: () => {} },
        { id: '6', label: 'Client admin', action: () => {} },
        { id: '7', label: 'Fee & revenue admin', action: () => {} },
        { id: '8', label: 'Activity', action: () => {} },
      ],
    },
    {
      id: '2',
      items: [
        { id: '1', label: 'Dummy item 1', action: () => {} },
        { id: '2', label: 'Dummy item 2', action: () => {} },
      ],
    },
  ]

  return (
    <div>
      <PanelNavigation
        navigation={navigation}
        staticItems={[
          {
            id: '1',
            label: <IconWithText iconName="plus" text="Request a new market" size={20} />,
            action: () => {},
          },
          {
            id: '2',
            label: <IconWithText iconName="question_o" text="Help & Support" size={20} />,
            link: { href: '/', target: '_blank' },
          },
        ]}
      />
    </div>
  )
}
