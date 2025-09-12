import { type CSSProperties, type FC, type ReactNode } from 'react'
import Link from 'next/link'

import { Button, type ButtonVariant } from '@/components/atoms/Button/Button'
import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'

import styles from './FloatingBanner.module.css'

export type FloatingBannerActionType = 'cta' | 'close'

interface FloatingBannerProps {
  title: ReactNode
  description: ReactNode
  closeButton: {
    action: (type: FloatingBannerActionType) => void
  }
  button?: {
    label: string
    link?: string
    action?: () => void
    className?: string
    style?: CSSProperties
    variant?: ButtonVariant
    target?: string
    rel?: string
  }
  icon?: ReactNode
}

export const FloatingBanner: FC<FloatingBannerProps> = ({
  title,
  description,
  closeButton,
  button,
  icon,
}) => {
  return (
    <div className={styles.floatingBannerContainer}>
      <Card
        className={styles.floatingBannerWrapper}
        style={{ backgroundColor: 'var(--earn-protocol-neutral-80)' }}
      >
        <div className={styles.contentWrapper}>
          {icon}
          <div className={styles.textualContent}>
            {title}
            {description}
          </div>
        </div>
        <div className={styles.buttonsWrapper}>
          {button?.link ? (
            <Link href={button.link} target={button.target} rel={button.rel}>
              <Button
                className={button.className}
                style={button.style}
                variant={button.variant}
                onClick={() => closeButton.action('cta')}
              >
                {button.label}
              </Button>
            </Link>
          ) : (
            button?.label && (
              <Button
                onClick={button.action}
                className={button.className}
                style={button.style}
                variant={button.variant}
              >
                {button.label}
              </Button>
            )
          )}
          <Button onClick={() => closeButton.action('close')}>
            <Icon iconName="close" size={12} color="var(--earn-protocol-neutral-40)" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
