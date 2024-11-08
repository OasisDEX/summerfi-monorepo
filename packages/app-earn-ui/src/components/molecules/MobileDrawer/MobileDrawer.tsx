'use client'
import React, { type CSSProperties, type ReactNode, useEffect, useRef } from 'react'

import { useMobileCheck } from '@/hooks/use-mobile-check.ts'

import styles from './MobileDrawer.module.scss'

interface MobileDrawerProps {
  isOpen: boolean
  onClose?: () => void
  children: ReactNode
  height?: string
  width?: number
  slideFrom?: 'bottom' | 'left' | 'right'
  heading?: ReactNode
  variant?: 'default' | 'sidebar'
  zIndex?: number
  style?: CSSProperties
}

const drawerContentMap = {
  default: styles.drawerContentDefault,
  sidebar: styles.drawerContentSidebar,
}

const slideFromMap = {
  default: {
    bottom: styles.bottomDefault,
  },
  sidebar: {
    bottom: styles.bottomSidebar,
  },
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  children,
  height = '33vh',
  width = 100,
  slideFrom = 'bottom',
  variant = 'default',
  zIndex,
  style,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMobileCheck()

  useEffect(() => {
    if (isMobile) {
      // Prevent background scroll when drawer is open
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'auto'
      }

      return () => {
        document.body.style.overflow = 'auto'
      }
    }

    return () => null
  }, [isOpen, isMobile])

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ''} ${slideFromMap[variant][slideFrom]}`}
        style={{
          height: slideFrom === 'bottom' ? `${height}` : '100vh',
          width: slideFrom === 'left' || slideFrom === 'right' ? `${width}vw` : '100vw',
          ...(zIndex && { zIndex }),
          ...(variant === 'sidebar' && { borderTop: '1px solid var(--earn-protocol-neutral-70)' }),
          ...style,
        }}
        ref={drawerRef}
      >
        <div className={drawerContentMap[variant]}>
          {onClose && (
            <button className={styles.closeButton} onClick={onClose}>
              &times;
            </button>
          )}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  )
}
