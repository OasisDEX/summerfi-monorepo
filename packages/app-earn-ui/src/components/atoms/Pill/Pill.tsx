import { type FC, type ReactNode } from 'react'

import pillStyles, { type ClassNames } from '@/components/atoms/Pill/Pill.module.css'

interface PillProps {
  children: ReactNode
  variant?: ClassNames
}

export const Pill: FC<PillProps> = ({ children, variant = 'default' }) => (
  <div className={pillStyles[variant]}>
    <div className={pillStyles.background1} />
    <div className={pillStyles.background2} />
    <div className={pillStyles.childrenWrapper}>{children}</div>
  </div>
)
