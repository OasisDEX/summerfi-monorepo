'use client'

import {
  type Dispatch,
  type FC,
  type HTMLAttributes,
  isValidElement,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { type DeviceType } from '@summerfi/app-types'

import { Card } from '@/components/atoms/Card/Card'
import type CardVariants from '@/components/atoms/Card/Card.module.css'
import {
  MobileDrawer,
  MobileDrawerDefaultWrapper,
} from '@/components/molecules/MobileDrawer/MobileDrawer'
import { isTouchDevice } from '@/helpers/is-touch-device'
import { useMobileCheck } from '@/hooks/use-mobile-check'

import tooltipStyles from '@/components/molecules/Tooltip/Tooltip.module.css'

const generateUniqueId = () => `tooltip-${Math.random().toString(36).slice(2, 9)}`

function useTooltip(uniqueId: string): {
  tooltipOpen: boolean
  setTooltipOpen: Dispatch<SetStateAction<boolean>>
  closeHandler: () => void
} {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const closeHandler = useCallback((): void => {
    setTooltipOpen(false)
  }, [])

  useEffect(() => {
    if (tooltipOpen) {
      const handleOutsideClick = (e: MouseEvent) => {
        // Prevent closing if click is within the tooltip
        const tooltipElements = document.querySelectorAll(`[data-tooltip-id="${uniqueId}"]`)
        const tooltipBtnElements = document.querySelectorAll(`[data-tooltip-btn-id="${uniqueId}"]`)

        const isClickInsideTooltip = Array.from(tooltipElements).some((el) =>
          el.contains(e.target as Node),
        )
        const isClickInsideTooltipBtn = Array.from(tooltipBtnElements).some((el) =>
          el.contains(e.target as Node),
        )

        if (!isClickInsideTooltip && !isClickInsideTooltipBtn) {
          closeHandler()
        }
      }

      document.addEventListener('click', handleOutsideClick, { capture: true })

      return () => document.removeEventListener('click', handleOutsideClick)
    }

    return () => null
  }, [tooltipOpen, closeHandler, uniqueId])

  return { tooltipOpen, setTooltipOpen, closeHandler }
}

interface TooltipWrapperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  isOpen: boolean
  showAbove: boolean
  cardVariant?: keyof typeof CardVariants
  generatedId: string
}

const TooltipWrapper: FC<TooltipWrapperProps> = ({
  children,
  isOpen,
  style,
  showAbove,
  cardVariant = 'cardSecondary',
  generatedId,
}) => {
  return (
    <div
      data-tooltip-id={generatedId}
      className={
        isOpen
          ? showAbove
            ? tooltipStyles.tooltipOpenAbove
            : tooltipStyles.tooltipOpen
          : tooltipStyles.tooltip
      }
      style={style}
    >
      <Card
        variant={cardVariant}
        style={{
          backgroundColor: 'var(--earn-protocol-neutral-80)',
          boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          color: 'var(--earn-protocol-secondary-70)',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '22px',
        }}
      >
        {children}
      </Card>
    </div>
  )
}

type ChildrenCallback = (tooltipOpen: boolean, setTooltipOpen: (flag: boolean) => void) => ReactNode

interface StatefulTooltipProps {
  tooltip?: ReactNode | ChildrenCallback
  children: ReactNode | ChildrenCallback
  tooltipWrapperStyles?: HTMLAttributes<HTMLDivElement>['style']
  tooltipCardVariant?: keyof typeof CardVariants
  style?: HTMLAttributes<HTMLDivElement>['style']
  showAbove?: boolean
  triggerOnClick?: boolean
  persistWhenOpened?: boolean
  withinDialog?: boolean
  tooltipId?: string
  hideDrawerOnMobile?: boolean
  deviceType?: DeviceType
  stopPropagation?: boolean
  tooltipName?: string
  onTooltipOpen?: (tooltipName: string) => void
}

const childrenTypeGuard = (children: ReactNode | ChildrenCallback): children is ReactNode =>
  isValidElement(children)

const tooltipTypeGuard = (tooltip: ReactNode | ChildrenCallback): tooltip is ReactNode =>
  typeof tooltip === 'string' ? true : isValidElement(tooltip)

export const Tooltip: FC<StatefulTooltipProps> = ({
  tooltip,
  children,
  style,
  tooltipWrapperStyles,
  tooltipCardVariant,
  showAbove = false,
  triggerOnClick = false,
  persistWhenOpened = false,
  withinDialog,
  tooltipId,
  hideDrawerOnMobile = false,
  deviceType,
  stopPropagation = false,
  onTooltipOpen,
  tooltipName,
}): ReactNode => {
  const generatedId = useRef(tooltipId ?? generateUniqueId()).current

  const { tooltipOpen, setTooltipOpen, closeHandler } = useTooltip(generatedId)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>()
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const onTooltipOpenTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { isMobile } = useMobileCheck(deviceType)

  const handleTooltipOpenState = (flag: boolean) => {
    closeHandler()
    setTooltipOpen(flag)
  }

  const tooltipRefRect = tooltipRef.current?.getBoundingClientRect()
  const dialogRect = tooltipRef.current?.closest('dialog')?.getBoundingClientRect()

  useEffect(() => {
    const portalId = persistWhenOpened
      ? 'portal-dropdown'
      : withinDialog
        ? 'modal-portal'
        : `tooltip-portal-${generatedId}` // Make each tooltip have a unique portal

    // Create a unique portal element for this tooltip if it doesn't exist
    let element = document.getElementById(portalId)

    if (!element && !persistWhenOpened && !withinDialog) {
      element = document.createElement('div')
      element.id = portalId
      element.style.position = 'absolute'
      element.style.top = '0'
      element.style.left = '0'
      element.style.pointerEvents = 'none'
      element.style.zIndex = `${1000 + (parseInt(generatedId.slice(-3), 36) % 100)}` // Unique z-index for each tooltip
      document.body.appendChild(element)
    }

    if (!element) {
      // eslint-disable-next-line no-console
      console.warn(`Portal element with id "${portalId}" not found`)
    }

    if (element) {
      setPortalElement(element)
    }

    // Cleanup function to remove the unique portal element when component unmounts
    return () => {
      if (!persistWhenOpened && !withinDialog && element?.parentNode) {
        element.parentNode.removeChild(element)
      }
    }
  }, [persistWhenOpened, withinDialog, generatedId])

  useEffect(() => {
    if (portalElement && tooltipRefRect && tooltipOpen) {
      // Set up timeout to call onTooltipOpen after 1 second
      if (onTooltipOpen && tooltipName) {
        onTooltipOpenTimeoutRef.current = setTimeout(() => {
          onTooltipOpen(tooltipName)
        }, 500)
      }
      // For unique tooltip portals, position them relative to the viewport
      if (portalElement.id.startsWith('tooltip-portal-')) {
        portalElement.style.setProperty('top', `${tooltipRefRect.y + window.scrollY}px`)
        portalElement.style.setProperty('left', `${tooltipRefRect.x}px`)
      } else {
        // For shared portals (dropdown, modal), use the original positioning logic
        portalElement.style.setProperty(
          'top',
          `${tooltipRefRect.y - (dialogRect?.y ?? 0) + window.scrollY}px`,
        )
        portalElement.style.setProperty('left', `${tooltipRefRect.x - (dialogRect?.x ?? 0)}px`)
      }
    }

    return () => {
      if (onTooltipOpenTimeoutRef.current) {
        clearTimeout(onTooltipOpenTimeoutRef.current)
        onTooltipOpenTimeoutRef.current = null
      }
    }
  }, [tooltipRefRect, portalElement, tooltipOpen, dialogRect, tooltipName, onTooltipOpen])

  const handleMouseEnter = useMemo(
    () => (!isTouchDevice && !triggerOnClick ? () => setTooltipOpen(true) : undefined),
    [setTooltipOpen, triggerOnClick],
  )

  const handleMouseLeave = useMemo(
    () => (!isTouchDevice && !triggerOnClick ? () => setTooltipOpen(false) : undefined),
    [setTooltipOpen, triggerOnClick],
  )

  const handleClick = useCallback(
    (e) => {
      // stop propagation to ensure that on mobile if someone click on tooltip
      // which is on clicable card or other clicable container it wont trigger
      // card/container action
      if (stopPropagation) {
        e.stopPropagation()
      }
      if (triggerOnClick) {
        setTooltipOpen((prev) => !prev)

        if (persistWhenOpened) {
          return
        }

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
          setTooltipOpen(false)
        }, 1000)
      } else {
        setTooltipOpen(true)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerOnClick, persistWhenOpened, setTooltipOpen],
  )

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (onTooltipOpenTimeoutRef.current) {
        clearTimeout(onTooltipOpenTimeoutRef.current)
      }
    }
  }, [])

  if (!portalElement) {
    return childrenTypeGuard(children) ? children : children(tooltipOpen, handleTooltipOpenState)
  }

  if (!tooltip) {
    return childrenTypeGuard(children) ? children : children(tooltipOpen, handleTooltipOpenState)
  }

  const portal = createPortal(
    <TooltipWrapper
      isOpen={tooltipOpen}
      style={tooltipWrapperStyles}
      showAbove={showAbove}
      cardVariant={tooltipCardVariant}
      generatedId={generatedId}
    >
      {tooltipTypeGuard(tooltip) ? tooltip : tooltip(tooltipOpen, handleTooltipOpenState)}
    </TooltipWrapper>,
    portalElement,
    tooltipId,
  )

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={tooltipRef}
      className={tooltipStyles.tooltipWrapper}
      style={style}
    >
      {isMobile && !hideDrawerOnMobile ? (
        <MobileDrawer
          isOpen={tooltipOpen}
          slideFrom="bottom"
          height="auto"
          variant="default"
          zIndex={1001}
          style={{ backgroundColor: 'unset' }}
        >
          <MobileDrawerDefaultWrapper>
            <div
              style={{ display: 'flex', flexDirection: 'column', whiteSpace: 'break-spaces' }}
              data-tooltip-id={generatedId}
            >
              {tooltipTypeGuard(tooltip) ? tooltip : tooltip(tooltipOpen, handleTooltipOpenState)}
            </div>
          </MobileDrawerDefaultWrapper>
        </MobileDrawer>
      ) : (
        portal
      )}

      <div
        onClick={handleClick}
        data-tooltip-btn-id={generatedId}
        style={{ display: 'flex', alignItems: 'center', width: '100%' }}
      >
        {childrenTypeGuard(children) ? children : children(tooltipOpen, handleTooltipOpenState)}
      </div>
    </div>
  )
}
