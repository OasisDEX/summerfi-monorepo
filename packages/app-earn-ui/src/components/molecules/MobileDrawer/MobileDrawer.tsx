'use client'
import { type CSSProperties, type FC, type ReactNode, useEffect, useMemo, useRef } from 'react'

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
      backgroundColor: 'var(--earn-protocol-neutral-100)',
      borderTopLeftRadius: 'var(--radius-large)',
      borderTopRightRadius: 'var(--radius-large)',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    top: {
      backgroundColor: 'var(--earn-protocol-neutral-100)',
      borderRadius: 0,
      height: '100%',
    },
    left: {
      backgroundColor: 'var(--earn-protocol-neutral-100)',
      borderRightLeftRadius: 'var(--radius-large)',
      borderRightRightRadius: 'var(--radius-large)',
      borderLeftLeftRadius: 0,
      borderLeftRightRadius: 0,
    },
    right: {
      backgroundColor: 'var(--earn-protocol-neutral-100)',
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
  default: {
    bottom: styles.drawerContentDefault,
    top: styles.drawerContentDefault,
    left: styles.drawerContentDefault,
    right: styles.drawerContentDefault,
  },
  sidebar: {
    bottom: styles.drawerBottomContentSidebar,
    top: styles.drawerTopContentSidebar,
    left: styles.drawerLeftContentSidebar,
    right: styles.drawerRightContentSidebar,
  },
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
  const defaultBodyOverflow = useMemo(() => document.body.style.overflow, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = defaultBodyOverflow
    }

    return () => {
      document.body.style.overflow = defaultBodyOverflow
    }
  }, [isOpen, defaultBodyOverflow])

  return (
    <>
      {isOpen && <div className={styles.overlay} onClick={onClose} />}
      <div
        className={`${styles.drawer} ${isOpen ? styles.open : ''} ${slideFromMap[variant][slideFrom]}`}
        style={{
          height: slideFrom === 'bottom' || slideFrom === 'top' ? `${height}` : '100vh',
          width: slideFrom === 'left' || slideFrom === 'right' ? `${width}vw` : '100vw',
          ...(zIndex && { zIndex }),
          ...(variant === 'sidebar' && {
            borderTop: '1px solid var(--earn-protocol-neutral-85)',
            borderTopLeftRadius: 'var(--radius-large)',
            borderTopRightRadius: 'var(--radius-large)',
          }),
          ...style,
        }}
        ref={drawerRef}
      >
        <div className={drawerContentMap[variant][slideFrom]}>
          {/* LET'S TRY FOR NOW WITHOUT X BUTTON */}
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
