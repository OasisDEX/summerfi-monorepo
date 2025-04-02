'use client'

import OGAnimateHeight from 'react-animate-height'
import clsx from 'clsx'

import animateHeightStyles from './AnimateHeight.module.scss'

const animationDuration = 600

export const AnimateHeight = ({
  id,
  show = false,
  children,
  scale,
  fade = true,
  customHeight,
  className,
  contentClassName,
}: {
  id: string
  show?: boolean
  children: React.ReactNode
  fade?: boolean
  scale?: boolean
  customHeight?: number
  className?: string
  contentClassName?: string
}): React.ReactNode => {
  return (
    <OGAnimateHeight
      id={id}
      animateOpacity={fade}
      duration={animationDuration}
      height={show ? 'auto' : customHeight ? customHeight : 0}
      animationStateClasses={{
        animating: 'rah-animating',
        animatingUp: 'rah-animating--up',
        animatingDown: 'rah-animating--down',
        static: 'rah-static',
        animatingToHeightZero: clsx('rah-animating--to-height-zero', {
          [animateHeightStyles.animateScaleOff]: scale,
        }),
        animatingToHeightAuto: clsx('rah-animating--to-height-auto', {
          [animateHeightStyles.animateScaleOn]: scale,
        }),
        animatingToHeightSpecific: 'rah-animating--to-height-specific',
        staticHeightZero: 'rah-static--height-zero',
        staticHeightAuto: 'rah-static--height-auto',
        staticHeightSpecific: 'rah-static--height-specific',
      }}
      className={className}
      contentClassName={contentClassName}
    >
      {children}
    </OGAnimateHeight>
  )
}
