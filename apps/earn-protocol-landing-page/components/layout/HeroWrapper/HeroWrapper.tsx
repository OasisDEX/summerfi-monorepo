import { type CSSProperties, type ReactNode } from 'react'

import heroWrapperStyles from './HeroWrapper.module.css'

export const HeroWrapper = ({
  large = false,
  children,
  style,
  className,
}: {
  large?: boolean
  children: ReactNode
  style?: CSSProperties
  className?: string
}) => {
  return (
    <>
      <div
        className={`${heroWrapperStyles.heroWrapper} ${large ? heroWrapperStyles.heroWrapperLarge : ''} ${className ?? ''}`}
        style={style}
      >
        {children}
      </div>
      <div
        className={`${heroWrapperStyles.heroWrapperSpacer} ${large ? heroWrapperStyles.heroWrapperSpacerLarge : ''}`}
      />
    </>
  )
}
