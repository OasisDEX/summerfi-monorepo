'use client'

import { type FC } from 'react'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'

import { getTokenGuarded } from '@/tokens/helpers'

import * as iconProxies from './iconsProxy'

export interface IconPropsBase {
  variant?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
  size?: number
  role?: 'presentation'
  focusable?: boolean
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  style?: React.CSSProperties
  proxyStyle?: React.CSSProperties
}

export interface IconPropsWithIconName extends IconPropsBase {
  iconName: IconNamesList
}

export interface IconPropsWithTokenName extends IconPropsBase {
  tokenName: TokenSymbolsList
}

export const Icon: FC<IconPropsWithIconName | IconPropsWithTokenName> = ({
  variant = 'l',
  role = 'presentation',
  focusable = false,
  iconName: iconNameProp,
  tokenName,
  size,
  style,
  proxyStyle,
}) => {
  const finalSize =
    size ??
    {
      xxs: 10,
      xs: 15,
      s: 20,
      m: 25,
      l: 30,
      xl: 35,
      xxl: 40,
      xxxl: 45,
    }[variant]

  const iconName = iconNameProp ?? getTokenGuarded(tokenName)?.iconName ?? 'not_supported_icon'

  const LazyIconComponent = iconProxies[iconName]

  return (
    <LazyIconComponent
      fallback={
        <svg
          viewBox="0 0 6.35 6.35"
          color="inherit"
          display="inline-block"
          focusable={focusable}
          role={role}
          width={finalSize}
          height={finalSize}
        >
          <circle
            style={{ fill: '#9d9d9d', fillOpacity: 0.350168, strokeWidth: 0.340624, ...proxyStyle }}
            cx="3.175"
            cy="3.175"
            r="3.175"
          />
        </svg>
      }
    >
      {({ default: iconData }) => (
        <svg
          viewBox={'viewBox' in iconData ? iconData.viewBox : '0 0 24 24'}
          color="inherit"
          display="inline-block"
          focusable={focusable}
          role={role}
          width={finalSize}
          height={finalSize}
          style={style}
        >
          {iconName}
          {iconData.path}
        </svg>
      )}
    </LazyIconComponent>
  )
}
