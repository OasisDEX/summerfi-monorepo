import { type CSSProperties, type ReactNode } from 'react'

import heroWrapperStyles from './HeroWrapper.module.css'

export const HeroWrapper = ({
  large = false,
  children,
  style,
}: {
  large?: boolean
  children: ReactNode
  style?: CSSProperties
}) => {
  return (
    <>
      <div
        className={`${heroWrapperStyles.heroWrapper} ${large ? heroWrapperStyles.heroWrapperLarge : ''}`}
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
