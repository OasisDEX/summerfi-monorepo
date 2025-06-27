'use client'

import OGAnimateHeight from 'react-animate-height'
import clsx from 'clsx'

import animateHeightStyles from './AnimateHeight.module.css'

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
  keepChildrenRendered = false,
}: {
  id: string
  show?: boolean
  children: React.ReactNode
  fade?: boolean
  scale?: boolean
  customHeight?: number
  className?: string
  contentClassName?: string
  // prop to keep children rendered when not shown
  // ensures that icons are loaded as expected
  keepChildrenRendered?: boolean
}): React.ReactNode => {
  return (
    <>
      {keepChildrenRendered && !show && (
        <div
          style={{
            width: '0px',
            height: '0px',
            position: 'absolute',
            bottom: '-100px',
            pointerEvents: 'none',
            opacity: 0,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      )}
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
    </>
  )
}
