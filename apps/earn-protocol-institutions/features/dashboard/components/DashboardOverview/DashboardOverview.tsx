'use client'

import { type FC } from 'react'
import { Icon, PanelNavigation } from '@summerfi/app-earn-ui'

export const DashboardOverview: FC = () => {
  const navigation = [
    {
      id: '1',
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-space-x-small)',
          }}
        >
          <Icon tokenName="USDC" size={24} />
          USDC-1
        </div>
      ),
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
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-space-x-small)',
                }}
              >
                <Icon iconName="plus" size={20} />
                Request a new market
              </div>
            ),
            action: () => {},
          },
          {
            id: '2',
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-space-x-small)',
                }}
              >
                <Icon iconName="question_o" size={20} />
                Help & Support
              </div>
            ),
            link: { href: '/', target: '_blank' },
          },
        ]}
      />
    </div>
  )
}
