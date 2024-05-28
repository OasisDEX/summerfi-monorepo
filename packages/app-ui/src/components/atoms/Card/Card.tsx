import { FC, ReactNode } from 'react'

import classNames, { ClassNames } from '@/components/atoms/Card/Card.module.scss'

interface CardProps {
  children: ReactNode
  variant?: ClassNames
}

export const Card: FC<CardProps> = ({ children, variant = 'card' }) => {
  return <div className={classNames[variant]}>{children}</div>
}
