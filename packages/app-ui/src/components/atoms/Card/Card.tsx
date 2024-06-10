import { DetailedHTMLProps, FC, HTMLAttributes, ReactNode } from 'react'

import { getAtomClassList } from '@/components/atoms/getAtomClassList'

import classNames, { ClassNames } from '@/components/atoms/Card/Card.module.scss'

interface CardProps {
  children: ReactNode
  variant?: ClassNames
}

export const Card: FC<CardProps & DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>> = ({
  children,
  className,
  variant = 'card',
}) => {
  return (
    <div className={getAtomClassList({ className, variant: classNames[variant] })}>{children}</div>
  )
}
