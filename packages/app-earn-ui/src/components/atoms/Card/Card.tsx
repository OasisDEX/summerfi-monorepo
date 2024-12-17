import { type DetailedHTMLProps, type FC, type HTMLAttributes, type ReactNode } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'

import cardStyles, { type ClassNames } from '@/components/atoms/Card/Card.module.scss'

interface CardProps {
  children: ReactNode
  variant?: ClassNames
  onClick?: () => void
}

export type CardVariant = ClassNames

export const Card: FC<CardProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  children,
  className,
  variant = 'cardPrimary',
  style,
  onClick,
}) => {
  return (
    <div
      className={getAtomClassList({ className, variant: cardStyles[variant] })}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
