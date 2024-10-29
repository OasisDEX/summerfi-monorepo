import {
  type FC,
  type HTMLAttributes,
  isValidElement,
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

import { type ClassNames as CardVariants } from '@/components/atoms/Card/Card.module.scss'
import tooltipStyles from '@/components/molecules/Tooltip/Tooltip.module.scss'

export function useTooltip() {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const closeHandler = useCallback(() => {
    setTooltipOpen(false)
  }, [])

  useEffect(() => {
    if (tooltipOpen) {
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
  cardVariant?: CardVariants
}

const TooltipWrapper: FC<TooltipWrapperProps> = ({
  children,
  isOpen,
  style,
  showAbove,
  cardVariant = 'cardSecondary',
}) => {
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
      <Card variant={cardVariant} style={{ backgroundColor: 'var(--earn-protocol-neutral-80)' }}>
        {children}
      </Card>
    </div>
  )
}

type ChildrenCallback = (tooltipOpen: boolean) => ReactNode

interface StatefulTooltipProps {
  tooltip: ReactNode
  children: ReactNode | ChildrenCallback
  tooltipWrapperStyles?: HTMLAttributes<HTMLDivElement>['style']
  tooltipCardVariant?: CardVariants
  style?: HTMLAttributes<HTMLDivElement>['style']
  showAbove?: boolean
  triggerOnClick?: boolean
}

const childrenTypeGuard = (children: ReactNode | ChildrenCallback): children is ReactNode =>
  isValidElement(children)

export const Tooltip: FC<StatefulTooltipProps> = ({
  tooltip,
  children,
  style,
  tooltipWrapperStyles,
  tooltipCardVariant,
  showAbove = false,
  triggerOnClick = false,
}) => {
  const { tooltipOpen, setTooltipOpen } = useTooltip()
  const [portalElement, setPortalElement] = useState<HTMLElement | null>()
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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
    () => (!isTouchDevice && !triggerOnClick ? () => setTooltipOpen(true) : undefined),
    [isTouchDevice, triggerOnClick],
  )

  const handleMouseLeave = useMemo(
    () => (!isTouchDevice && !triggerOnClick ? () => setTooltipOpen(false) : undefined),
    [isTouchDevice, triggerOnClick],
  )

  const handleClick = useCallback(() => {
    if (triggerOnClick) {
      setTooltipOpen(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setTooltipOpen(false)
      }, 1000)
    } else {
      setTooltipOpen(true)
    }
  }, [triggerOnClick])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  if (!portalElement) {
    return childrenTypeGuard(children) ? children : children(tooltipOpen)
  }

  const portal = createPortal(
    <TooltipWrapper
      isOpen={tooltipOpen}
      style={tooltipWrapperStyles}
      showAbove={showAbove}
      cardVariant={tooltipCardVariant}
    >
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
      {childrenTypeGuard(children) ? children : children(tooltipOpen)}
      {portal}
    </div>
  )
}
