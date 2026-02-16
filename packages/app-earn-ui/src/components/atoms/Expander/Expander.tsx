'use client'
import { type CSSProperties, type FC, type ReactNode, useCallback, useState } from 'react'
import clsx from 'clsx'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Icon, type IconVariant } from '@/components/atoms/Icon/Icon'

import styles from './Expander.module.css'

interface ExpanderProps {
  title: ReactNode
  defaultExpanded?: boolean
  expanded?: boolean
  children: ReactNode
  expanderButtonStyles?: CSSProperties
  expanderChevronStyles?: CSSProperties
  disabled?: boolean
  expanderWrapperStyles?: CSSProperties
  expanderWrapperClassName?: string
  expanderButtonClassName?: string
  iconVariant?: IconVariant
  onExpand?: (isExpanded: boolean) => void
}

export const Expander: FC<ExpanderProps> = ({
  title,
  defaultExpanded = false,
  expanded,
  children,
  expanderButtonStyles = {},
  expanderButtonClassName,
  expanderChevronStyles = {},
  disabled = false,
  expanderWrapperStyles = {},
  expanderWrapperClassName,
  iconVariant = 'xxs',
  onExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded)
  const isControlled = expanded !== undefined
  const isExpanded = isControlled ? expanded : internalExpanded

  const toggleExpand = useCallback(() => {
    const nextExpanded = !isExpanded

    if (!isControlled) {
      setInternalExpanded(nextExpanded)
    }
    onExpand?.(nextExpanded)
  }, [isControlled, isExpanded, onExpand])

  return (
    <div className={clsx(styles.expander, expanderWrapperClassName)} style={expanderWrapperStyles}>
      <button
        className={clsx(styles.expanderButton, expanderButtonClassName)}
        onClick={toggleExpand}
        style={{
          textAlign: 'left',
          fontWeight: 600,
          ...expanderButtonStyles,
        }}
        disabled={disabled}
      >
        {title}
        <div className={styles.chevron} style={expanderChevronStyles}>
          <Icon
            iconName={isExpanded ? 'chevron_up' : 'chevron_down'}
            variant={iconVariant}
            color={disabled ? 'rgba(119, 117, 118, 0.5)' : 'rgba(119, 117, 118, 1)'}
          />
        </div>
      </button>
      <AnimateHeight id={`Expander_${typeof title === 'string' ? title : ''}`} show={isExpanded}>
        {children}
      </AnimateHeight>
    </div>
  )
}
