'use client'
import { type CSSProperties, type FC, type ReactNode, useEffect, useRef } from 'react'

import { Card } from '@/components/atoms/Card/Card'

import styles from './MobileDrawer.module.scss'

type SlideFrom = 'bottom' | 'top' | 'left' | 'right'

interface MobileDrawerDefaultWrapperProps {
  children: ReactNode
  slideFrom?: SlideFrom
}

export const MobileDrawerDefaultWrapper: FC<MobileDrawerDefaultWrapperProps> = ({
  children,
  slideFrom = 'bottom',
}) => {
  const wrapperStyleMap = {
    bottom: {
      backgroundColor: 'var(--earn-protocol-neutral-85)',
      borderTopLeftRadius: 'var(--radius-large)',
      borderTopRightRadius: 'var(--radius-large)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    top: {
      backgroundColor: 'var(--earn-protocol-neutral-85)',
      borderRadius: 0,
      height: '100%',
    },
    left: {
      backgroundColor: 'var(--earn-protocol-neutral-85)',
      borderRightLeftRadius: 'var(--radius-large)',
      borderRightRightRadius: 'var(--radius-large)',
      borderLeftLeftRadius: 0,
      borderLeftRightRadius: 0,
    },
    right: {
      backgroundColor: 'var(--earn-protocol-neutral-85)',
      borderLeftLeftRadius: 'var(--radius-large)',
      borderLeftRightRadius: 'var(--radius-large)',
      borderRightLeftRadius: 0,
      borderRightRightRadius: 0,
    },
  }[slideFrom]

  return (
    <Card
      style={{
        ...wrapperStyleMap,
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
  slideFrom?: SlideFrom
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
    top: styles.topDefault,
    left: styles.leftDefault,
    right: styles.rightDefault,
  },
  sidebar: {
    bottom: styles.bottomSidebar,
    top: styles.topSidebar,
    left: styles.leftSidebar,
    right: styles.rightSidebar,
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
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ''} ${slideFromMap[variant][slideFrom]}`}
        style={{
          height: slideFrom === 'bottom' || slideFrom === 'top' ? `${height}` : '100vh',
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