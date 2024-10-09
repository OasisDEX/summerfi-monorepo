'use client'

import {
  type FC,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { Card } from '@/components/atoms/Card/Card'
import { isTouchDevice } from '@/helpers/is-touch-device'

import tooltipStyles from '@/components/molecules/Tooltip/Tooltip.module.scss'

export function useTooltip() {
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
  showAbove: boolean
}

const TooltipWrapper: FC<TooltipWrapperProps> = ({ children, isOpen, style, showAbove }) => {
  return (
    <div
      className={
        isOpen
          ? showAbove
            ? tooltipStyles.tooltipOpenAbove
            : tooltipStyles.tooltipOpen
          : tooltipStyles.tooltip
      }
      style={style}
    >
      <Card variant="cardSecondary">{children}</Card>
    </div>
  )
}

interface StatefulTooltipProps extends HTMLAttributes<HTMLDivElement> {
  tooltip: ReactNode
  children: ReactNode
  tooltipWrapperStyles?: HTMLAttributes<HTMLDivElement>['style']
  showAbove?: boolean
}

export const Tooltip: FC<StatefulTooltipProps> = ({
  tooltip,
  children,
  style,
  tooltipWrapperStyles,
  showAbove = false,
}) => {
  const { tooltipOpen, setTooltipOpen } = useTooltip()
  const [portalElement, setPortalElement] = useState<HTMLElement | null>()
  const tooltipRef = useRef<HTMLDivElement | null>(null)

  const tooltipRefRect = tooltipRef.current?.getBoundingClientRect()

  useEffect(() => {
    const element = document.getElementById('portal')

    if (element) {
      setPortalElement(element)
    }
  }, [])

  useEffect(() => {
    if (portalElement && tooltipRefRect && tooltipOpen) {
      portalElement.style.setProperty('top', `${tooltipRefRect.y + window.scrollY}px`)
      portalElement.style.setProperty('left', `${tooltipRefRect.x}px`)
    }
  }, [tooltipRefRect, portalElement, tooltipOpen])

  const handleMouseEnter = useMemo(
    () => (!isTouchDevice ? () => setTooltipOpen(true) : undefined),
    [isTouchDevice],
  )

  const handleMouseLeave = useMemo(
    () => (!isTouchDevice ? () => setTooltipOpen(false) : undefined),
    [isTouchDevice],
  )

  const handleClick = useCallback(() => tooltip && setTooltipOpen(true), [])

  if (!portalElement) {
    return children
  }

  const portal = createPortal(
    <TooltipWrapper isOpen={tooltipOpen} style={tooltipWrapperStyles} showAbove={showAbove}>
      {tooltip}
    </TooltipWrapper>,
    portalElement,
  )

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      ref={tooltipRef}
      className={tooltipStyles.tooltipWrapper}
      style={style}
    >
      {children}
      {portal}
    </div>
  )
}
