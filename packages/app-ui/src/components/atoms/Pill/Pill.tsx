import { type FC, type ReactNode } from 'react'

import classNames, { type ClassNames } from '@/components/atoms/Pill/Pill.module.scss'

interface PillProps {
  children: ReactNode
  variant?: ClassNames
}

export const Pill: FC<PillProps> = ({ children, variant = 'default' }) => (
  <div className={classNames[variant]}>{children}</div>
)
