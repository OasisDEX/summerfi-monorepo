import { type CSSProperties, type PropsWithChildren } from 'react'
import clsx from 'clsx'

import { Icon } from '@/components/atoms/Icon/Icon'
import { Text, type TextAllowedHtmlTags } from '@/components/atoms/Text/Text'
import type TextClassNames from '@/components/atoms/Text/Text.module.css'
import { LoadingSpinner } from '@/components/molecules/LoadingSpinner/LoadingSpinner'

import withArrowStyles from '@/components/atoms/WithArrow/WithArrow.module.css'

export function WithArrow({
  children,
  gap = 2,
  variant = 'p3semi',
  style,
  as,
  className,
  reserveSpace,
  withAnimated = true,
  withStatic = false,
  disabled = false,
  onClick,
  hideArrow = false,
  isLoading = false,
  wrapperStyle,
}: PropsWithChildren<{
  gap?: string | number
  style?: CSSProperties
  variant?: keyof typeof TextClassNames
  as?: TextAllowedHtmlTags
  className?: string
  reserveSpace?: boolean
  withAnimated?: boolean
  withStatic?: boolean
  disabled?: boolean
  onClick?: () => void
  hideArrow?: boolean
  isLoading?: boolean
  wrapperStyle?: CSSProperties
}>): React.ReactNode {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: isLoading ? 'unset' : 'center',
        opacity: disabled ? 0.5 : 1,
        ...wrapperStyle,
      }}
      onClick={onClick}
    >
      <Text
        variant={variant}
        className={clsx(withArrowStyles.withArrow, className)}
        style={{ whiteSpace: 'nowrap', color: 'var(--earn-protocol-primary-100)', ...style }}
        {...(as ? { as } : { as: 'span' })}
      >
        {isLoading ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--general-space-8)' }}>
            <LoadingSpinner size={16} />
            {children}
          </span>
        ) : (
          <span style={{ marginRight: gap }}>{children}</span>
        )}
        {!hideArrow && !isLoading && withAnimated && !withStatic && (
          <>
            {/* This one won't be displayed, it's just to reserve space for actual arrow. */}
            {reserveSpace && (
              <span
                className="arrow"
                style={{ color: 'transparent', padding: '0 var(--general-space-4)' }}
              >
                →
              </span>
            )}
            <span
              className="arrow"
              style={{
                position: 'absolute',
                ...(reserveSpace && { right: 0 }),
                ...(variant.includes('Colorful') && {
                  backgroundImage: 'var(--gradient-earn-protocol-dark)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }),
              }}
            >
              →
            </span>
          </>
        )}
      </Text>
      {withStatic && (
        <Icon
          iconName="share"
          variant="xs"
          style={{
            marginLeft: 'var(--general-space-2)',
            color: style?.color ?? 'var(--earn-protocol-primary-100)',
          }}
        />
      )}
    </span>
  )
}
