import { type FC, Suspense, useMemo } from 'react'
import { icons } from '@summerfi/app-icons'
import { type TokenSymbolsList } from '@summerfi/app-types'

import { getTokenGuarded } from '@/tokens/helpers'

export type IconNamesList = keyof typeof icons

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

export interface IconPropsWithIconName extends IconPropsBase {
  iconName: IconNamesList
}

export interface IconPropsWithTokenName extends IconPropsBase {
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
    iconNameProp ?? getTokenGuarded(tokenName as string)?.iconName ?? 'not_supported_icon'

  const colorSet = color ?? style?.stroke

  const SvgIcon = useMemo(() => icons[iconName], [iconName])

  if (!SvgIcon) return null

  return (
    <Suspense
      fallback={
        <div
          style={{
            width: finalSize,
            height: finalSize,
            backgroundColor: 'var(--earn-protocol-neutral-70)',
            borderRadius: '50%',
          }}
        />
      }
    >
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
    </Suspense>
  )
}
