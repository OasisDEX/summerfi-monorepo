import { type DetailedHTMLProps, type FC, type HTMLAttributes, type ReactNode } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'

import cardStyles, { type ClassNames } from '@/components/atoms/Card/Card.module.css'

interface CardProps {
  children: ReactNode
  variant?: ClassNames
}

export const Card: FC<CardProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  children,
  className,
  variant = 'card',
  style,
}) => {
  return (
    <div className={getAtomClassList({ className, variant: cardStyles[variant] })} style={style}>
      {children}
    </div>
  )
}
