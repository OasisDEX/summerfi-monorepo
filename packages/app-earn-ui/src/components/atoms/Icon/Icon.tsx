'use client'

import { type FC, useState } from 'react'
import * as iconProxies from '@summerfi/app-icons'
import { type IconNamesList, type TokenSymbolsList } from '@summerfi/app-types'
import Image from 'next/image'

import { getTokenGuarded } from '@/tokens/helpers'

export interface IconPropsBase {
  variant?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl'
  size?: number
  role?: 'presentation'
  focusable?: boolean
  iconName?: IconNamesList
  tokenName?: TokenSymbolsList
  style?: React.CSSProperties
  proxyStyle?: React.CSSProperties
  color?: string
  className?: string
}

export interface IconPropsWithIconName extends IconPropsBase {
  iconName: IconNamesList
}

export interface IconPropsWithTokenName extends IconPropsBase {
  tokenName: TokenSymbolsList
}

const FallbackSvg = ({
  focusable,
  role,
  finalSize,
  proxyStyle,
  errorLoading,
  className,
}: {
  focusable?: boolean
  role?: 'presentation'
  finalSize: number
  proxyStyle?: React.CSSProperties
  errorLoading?: boolean
  className?: string
}) => (
  <svg
    viewBox="0 0 6.35 6.35"
    color="inherit"
    display="inline-block"
    focusable={focusable}
    role={role}
    width={finalSize}
    height={finalSize}
    style={{
      ...proxyStyle,
    }}
    className={className}
  >
    <circle
      style={{
        fill: errorLoading ? 'red' : '#9d9d9d',
        fillOpacity: 0.350168,
        strokeWidth: 0.340624,
        ...proxyStyle,
      }}
      cx="3.175"
      cy="3.175"
      r="3.175"
    />
  </svg>
)

export const Icon: FC<IconPropsWithIconName | IconPropsWithTokenName> = ({
  variant = 'l',
  role = 'presentation',
  focusable = false,
  iconName: iconNameProp,
  tokenName,
  size,
  style,
  proxyStyle,
  color,
  className,
}) => {
  const [errorLoading, setErrorLoading] = useState(false)
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

  const colorSet = color ?? style?.stroke

  return (
    <LazyIconComponent
      fallback={
        <FallbackSvg
          focusable={focusable}
          role={role}
          finalSize={finalSize}
          proxyStyle={proxyStyle}
        />
      }
    >
      {({ default: iconData }: { default: string }) => {
        const [prefix, svgBase64] = iconData.split(',')

        return iconData && !errorLoading ? (
          <Image
            src={
              colorSet
                ? `${prefix},${
                    prefix !== 'data:image/svg+xml'
                      ? btoa(atob(svgBase64).replaceAll('currentColor', colorSet))
                      : svgBase64.replaceAll('currentColor', colorSet)
                  }`
                : iconData
            }
            color="inherit"
            alt={iconName}
            role={role}
            width={finalSize}
            height={finalSize}
            style={style}
            unoptimized
            onError={() => setErrorLoading(true)}
            className={className}
          />
        ) : (
          <FallbackSvg
            focusable={focusable}
            role={role}
            finalSize={finalSize}
            errorLoading={errorLoading}
            proxyStyle={{ ...proxyStyle, fill: 'red', fillOpacity: 1 }}
            className={className}
          />
        )
      }}
    </LazyIconComponent>
  )
}
