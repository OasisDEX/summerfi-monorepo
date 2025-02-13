'use client'
import { type CSSProperties, type FC, type ReactNode, useCallback, useState } from 'react'

import { AnimateHeight } from '@/components/atoms/AnimateHeight/AnimateHeight'
import { Icon, type IconVariant } from '@/components/atoms/Icon/Icon'

import styles from './Expander.module.scss'

interface ExpanderProps {
  title: ReactNode
  defaultExpanded?: boolean
  children: ReactNode
  expanderButtonStyles?: CSSProperties
  disabled?: boolean
  expanderWrapperStyles?: CSSProperties
  iconVariant?: IconVariant
  onExpand?: (isExpanded: boolean) => void
}

export const Expander: FC<ExpanderProps> = ({
  title,
  defaultExpanded = false,
  children,
  expanderButtonStyles = {},
  disabled = false,
  expanderWrapperStyles = {},
  iconVariant = 'xs',
  onExpand,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const toggleExpand = useCallback(() => {
    setIsExpanded(!isExpanded)
    onExpand?.(!isExpanded)
  }, [isExpanded, onExpand])

  return (
    <div className={styles.expander} style={expanderWrapperStyles}>
      <button
        className={styles.expanderButton}
        onClick={toggleExpand}
        style={expanderButtonStyles}
        disabled={disabled}
      >
        {title}
        <div className={styles.chevron}>
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
