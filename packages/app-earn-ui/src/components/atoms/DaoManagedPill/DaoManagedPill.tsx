import { type FC } from 'react'

import { Text } from '@/components/atoms/Text/Text'

export const DaoManagedPill: FC<{ riskColor?: string; small?: boolean }> = ({
  riskColor,
  small,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <Text variant={small ? 'p4semi' : 'p3semi'} style={{ color: riskColor, margin: 0 }}>
        DAO Managed
      </Text>
    </div>
  )
}
