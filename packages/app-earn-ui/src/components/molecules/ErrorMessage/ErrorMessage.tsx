/* eslint-disable @typescript-eslint/consistent-indexed-object-style */
import { type FC } from 'react'

import { Icon, type IconNamesList } from '@/components/atoms/Icon/Icon'
import { Text } from '@/components/atoms/Text/Text'

import styles from './ErrorMessage.module.scss'

type ErrorVariant = 'general' | 'critical' | 'warning' | 'success'

interface ErrorMessageProps {
  error: string
  variant?: ErrorVariant
  iconName?: IconNamesList
}

const variantToIconMap: Record<ErrorVariant, IconNamesList> = {
  general: 'info',
  critical: 'warning',
  warning: 'warning',
  success: 'checkmark',
}

const variantToColorMap: Record<ErrorVariant, string> = {
  general: 'var(--color-background-interactive-bold)',
  critical: 'var(--earn-protocol-critical-100)',
  warning: 'var(--earn-protocol-warning-100)',
  success: 'var(--earn-protocol-success-100)',
}

const variantToBackgroundMap: Record<ErrorVariant, string> = {
  general: 'var(--gradient-earn-protocol-dark-10)',
  critical: 'var(--earn-protocol-critical-10)',
  warning: 'var(--earn-protocol-warning-10)',
  success: 'var(--earn-protocol-success-10)',
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error, variant = 'critical', iconName }) => {
  const resolvedIconName = variant === 'general' && iconName ? iconName : variantToIconMap[variant]

  return (
    <div
      className={styles.errorMessageWrapper}
      style={{
        background: variantToBackgroundMap[variant],
        borderRadius: 'var(--radius-medium)',
      }}
    >
      <div className={styles.content}>
        <Icon iconName={resolvedIconName} size={20} style={{ color: variantToColorMap[variant] }} />
        <div className={styles.errorTextWrapper}>
          <Text variant="p3semi" as="p">
            {error}
          </Text>
        </div>
      </div>
    </div>
  )
}
