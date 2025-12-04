/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type CSSProperties, type FC, type ReactNode } from 'react'
import clsx from 'clsx'

import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import styles from './Alert.module.css'

type AlertVariant = 'general' | 'critical' | 'warning' | 'success'

interface AlertProps {
  error: ReactNode
  variant?: AlertVariant
  iconName?: IconNamesList
  noIcon?: boolean
  wrapperStyles?: CSSProperties
}

const variantToIconMap: Record<AlertVariant, IconNamesList> = {
  general: 'info',
  critical: 'warning',
  warning: 'warning',
  success: 'checkmark',
}

const variantToColorMap: Record<AlertVariant, string> = {
  general: 'var(--color-background-interactive-bold)',
  critical: 'var(--earn-protocol-critical-100)',
  warning: 'var(--earn-protocol-warning-100)',
  success: 'var(--earn-protocol-success-100)',
}

const variantToBackgroundMap: Record<AlertVariant, string> = {
  general: 'var(--gradient-earn-protocol-dark-10)',
  critical: 'var(--earn-protocol-critical-10)',
  warning: 'var(--earn-protocol-warning-10)',
  success: 'var(--earn-protocol-success-10)',
}

export const Alert: FC<AlertProps> = ({
  error,
  variant = 'critical',
  iconName,
  wrapperStyles,
  noIcon,
}) => {
  const resolvedIconName = variant === 'general' && iconName ? iconName : variantToIconMap[variant]

  return (
    <div
      className={clsx(styles.alertWrapper, noIcon && styles.alertWrapperNoIcon)}
      style={{
        background: variantToBackgroundMap[variant],
        borderRadius: 'var(--radius-medium)',
        ...wrapperStyles,
      }}
    >
      <div className={noIcon ? styles.contentNoIcon : styles.content}>
        {!noIcon && (
          <Icon
            iconName={resolvedIconName}
            size={20}
            style={{ color: variantToColorMap[variant] }}
          />
        )}
        <div className={styles.alertTextWrapper}>
          {typeof error === 'string' ? (
            <Text variant="p3semi" as="p" style={{ fontWeight: 500 }}>
              {error}
            </Text>
          ) : (
            error
          )}
        </div>
      </div>
    </div>
  )
}
