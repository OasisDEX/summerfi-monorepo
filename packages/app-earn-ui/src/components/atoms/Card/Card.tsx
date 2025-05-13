import { type DetailedHTMLProps, type FC, type HTMLAttributes, type ReactNode } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'

import cardStyles, { type ClassNames } from '@/components/atoms/Card/Card.module.css'

interface CardProps {
  children: ReactNode
  variant?: ClassNames
  onClick?: () => void
  disabled?: boolean
}

export type CardVariant = ClassNames

export const Card: FC<CardProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  children,
  className,
  variant = 'cardPrimary',
  style,
  onClick,
  disabled,
}) => {
  return (
    <div
      className={getAtomClassList({ className, variant: cardStyles[variant] })}
      style={{ ...(disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}), ...style }}
      onClick={disabled ? undefined : onClick}
    >
      {children}
    </div>
  )
}
