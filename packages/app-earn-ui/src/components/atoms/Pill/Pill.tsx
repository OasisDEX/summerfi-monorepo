import { type FC, type ReactNode } from 'react'

import pillStyles from '@/components/atoms/Pill/Pill.module.css'

interface PillProps {
  children: ReactNode
  variant?: keyof typeof pillStyles
}

export const Pill: FC<PillProps> = ({ children, variant = 'default' }) => (
  <div className={pillStyles[variant]}>
    <div className={pillStyles.background1} />
    <div className={pillStyles.background2} />
    <div className={pillStyles.childrenWrapper}>{children}</div>
  </div>
)
