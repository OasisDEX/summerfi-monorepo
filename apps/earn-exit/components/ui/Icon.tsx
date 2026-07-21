import { type FC } from 'react'

import { icons, type IconNamesList } from './icons'
import { type TokenSymbolsList } from './types'

export type { IconNamesList }

/**
 * Token symbol -> icon name, trimmed from `@summerfi/app-token-config` to the assets this
 * exit app can actually surface (fleet input tokens + SUMR). Unknown symbols fall back to
 * `not_supported_icon`, same as the original design-system Icon.
 */
const tokenIconNameMap: { [symbol: string]: IconNamesList } = {
  USDC: 'usdc_circle_color',
  'USDC.E': 'usdc_circle_color',
  USDT: 'usdt_circle_color',
  'USD₮0': 'usd₮0_circle_color',
  ETH: 'ether_circle_color',
  WETH: 'weth_circle_color',
  EURC: 'eurc',
  SUMR: 'sumr',
}

export type IconVariant = 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'

export interface IconPropsBase {
  variant?: IconVariant
  size?: number
  role?: 'presentation'
  focusable?: boolean
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  style?: React.CSSProperties
  color?: string
  className?: string
}

interface IconPropsWithIconName extends IconPropsBase {
  iconName: IconNamesList
}

interface IconPropsWithTokenName extends IconPropsBase {
  tokenName: TokenSymbolsList
}

export const Icon: FC<IconPropsWithIconName | IconPropsWithTokenName> = ({
  variant = 'l',
  iconName: iconNameProp,
  tokenName,
  size,
  style,
  color,
  className,
  ...rest
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

  const iconName =
    iconNameProp ?? tokenIconNameMap[(tokenName ?? '').toUpperCase()] ?? 'not_supported_icon'

  const colorSet = color ?? style?.stroke

  const SvgIcon = icons[iconName]

  if (!SvgIcon) return null

  return (
    <div style={{ color: colorSet, display: 'inline-block', ...style }}>
      <SvgIcon
        className={className}
        title={iconName}
        style={{
          display: 'block',
          ...style,
        }}
        {...(finalSize ? { width: finalSize, height: finalSize } : {})}
        {...rest}
      />
    </div>
  )
}
