import { type CSSProperties, type ReactNode } from 'react'

import heroWrapperStyles from './HeroWrapper.module.css'

export const HeroWrapper = ({
  large = false,
  larger = false,
  children,
  style,
  className,
}: {
  large?: boolean
  larger?: boolean
  children: ReactNode
  style?: CSSProperties
  className?: string
}) => {
  return (
    <>
      <div
        className={`${heroWrapperStyles.heroWrapper} ${large ? heroWrapperStyles.heroWrapperLarge : ''} ${larger ? heroWrapperStyles.heroWrapperLarger : ''} ${className ?? ''}`}
        style={style}
      >
        {children}
      </div>
      <div
        className={`${heroWrapperStyles.heroWrapperSpacer} ${large ? heroWrapperStyles.heroWrapperSpacerLarge : ''} ${larger ? heroWrapperStyles.heroWrapperSpacerLarger : ''}`}
      />
    </>
  )
}
