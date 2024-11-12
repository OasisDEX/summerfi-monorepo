'use client'
import { type CSSProperties, type FC, type ReactNode, useEffect, useRef } from 'react'

import { Card } from '@/components/atoms/Card/Card'

import styles from './MobileDrawer.module.scss'

interface MobileDrawerDefaultWrapperProps {
  children: ReactNode
}

export const MobileDrawerDefaultWrapper: FC<MobileDrawerDefaultWrapperProps> = ({ children }) => {
  return (
    <Card
      style={{
        backgroundColor: 'var(--earn-protocol-neutral-90)',
        borderTopLeftRadius: 'var(--radius-large)',
        borderTopRightRadius: 'var(--radius-large)',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        flexDirection: 'column',
      }}
    >
      {children}
    </Card>
  )
}

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

  useEffect(() => {
    // Prevent background scroll when drawer is open
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

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
          {/* LETS TRY FOR NOW WITHOUT X BUTTON */}
          {/* {onClose && (*/}
          {/*  <button className={styles.closeButton} onClick={onClose}>*/}
          {/*    &times;*/}
          {/*  </button>*/}
          {/* )}*/}
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </>
  )
}
