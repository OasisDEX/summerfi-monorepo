import { type FC, type ReactNode } from 'react'
import { Icon } from '@summerfi/app-earn-ui'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'

interface IconWithTextProps {
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  children: ReactNode
  size: number
}

export const IconWithText: FC<IconWithTextProps> = ({ iconName, tokenName, children, size }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-space-x-small)' }}>
      {iconName && <Icon iconName={iconName} size={size} />}
      {tokenName && <Icon tokenName={tokenName} size={size} />}
      {children}
    </div>
  )
}
