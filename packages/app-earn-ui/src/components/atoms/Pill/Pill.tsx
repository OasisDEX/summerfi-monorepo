import { type FC, type ReactNode } from 'react'

import pillStyles from '@/components/atoms/Pill/Pill.module.css'

interface PillProps {
  children: ReactNode
  variant?: keyof typeof pillStyles
  isSuper?: boolean
}

export const Pill: FC<PillProps> = ({ children, variant = 'default', isSuper }) => (
  <div className={pillStyles[variant]}>
    {isSuper ? (
      <div className={pillStyles.superBackground} />
    ) : (
      <>
        <div className={pillStyles.background1} />
        <div className={pillStyles.background2} />
      </>
    )}
    <div className={pillStyles.childrenWrapper}>{children}</div>
  </div>
)
