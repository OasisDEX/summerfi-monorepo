'use client'

import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'

import { Card } from '@/components/atoms/Card/Card'
import { isTouchDevice } from '@/helpers/isTouchDevice'

import classNames from '@/components/molecules/Tooltip/Tooltip.module.scss'

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
  }, [tooltipOpen])

  return { tooltipOpen, setTooltipOpen }
}

export function TooltipWrapper({ children, isOpen }: { children: ReactNode; isOpen: boolean }) {
  return (
    <div className={isOpen ? classNames.tooltipOpen : classNames.tooltip}>
      <Card variant="cardSmallPaddings">{children}</Card>
    </div>
  )
}

interface StatefulTooltipProps {
  tooltip: ReactNode
  children: ReactNode
}

export const Tooltip: FC<StatefulTooltipProps> = ({ tooltip, children }) => {
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
      className={classNames.tooltipWrapper}
    >
      {children}
      <TooltipWrapper isOpen={tooltipOpen}>{tooltip}</TooltipWrapper>
    </div>
  )
}
