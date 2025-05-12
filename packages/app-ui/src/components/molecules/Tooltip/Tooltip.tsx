'use client'

import {
  type Dispatch,
  type FC,
  type HTMLAttributes,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { Card } from '@/components/atoms/Card/Card'
import { isTouchDevice } from '@/helpers/is-touch-device'

import tooltipStyles from '@/components/molecules/Tooltip/Tooltip.module.css'

export function useTooltip(): {
  tooltipOpen: boolean
  setTooltipOpen: Dispatch<SetStateAction<boolean>>
} {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const closeHandler = useCallback(() => {
    setTooltipOpen(false)
  }, [])

  useEffect(() => {
    if (tooltipOpen) {
      // capture parameter is added to overcome event phases race condition while rendering portal
      // (opening modal causes tooltip to stop working) - https://github.com/facebook/react/issues/20074#issuecomment-714158332
      document.addEventListener('click', closeHandler, { capture: true })

      return () => document.removeEventListener('click', closeHandler)
    }

    return () => null
  }, [tooltipOpen, closeHandler])

  return { tooltipOpen, setTooltipOpen }
}

interface TooltipWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isOpen: boolean
}

const TooltipWrapper: FC<TooltipWrapperProps> = ({ children, isOpen, style }) => {
  return (
    <div className={isOpen ? tooltipStyles.tooltipOpen : tooltipStyles.tooltip} style={style}>
      <Card variant="cardSmallPaddings">{children}</Card>
    </div>
  )
}

interface StatefulTooltipProps extends HTMLAttributes<HTMLDivElement> {
  tooltip: ReactNode
  children: ReactNode
  tooltipWrapperStyles?: HTMLAttributes<HTMLDivElement>['style']
}

export const Tooltip: FC<StatefulTooltipProps> = ({
  tooltip,
  children,
  style,
  tooltipWrapperStyles,
}) => {
  const { tooltipOpen, setTooltipOpen } = useTooltip()

  const handleMouseEnter = useMemo(
    () => (!isTouchDevice ? () => setTooltipOpen(true) : undefined),
    [isTouchDevice],
  )

  const handleMouseLeave = useMemo(
    () => (!isTouchDevice ? () => setTooltipOpen(false) : undefined),
    [isTouchDevice],
  )

  const handleClick = useCallback(() => tooltip && setTooltipOpen(true), [])

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={tooltipStyles.tooltipWrapper}
      style={style}
    >
      {children}
      <TooltipWrapper isOpen={tooltipOpen} style={tooltipWrapperStyles}>
        {tooltip}
      </TooltipWrapper>
    </div>
  )
}
