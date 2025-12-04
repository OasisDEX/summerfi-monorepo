import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Text } from '@summerfi/app-earn-ui'

import lockupRangeInputStyles from './LockupRangeInput.module.css'

const MIN_DAYS = 0
const MIN_NONZERO_DAYS = 14
const MAX_DAYS = 36 * 30

export const LockupRangeInput = ({
  value,
  onChange,
}: {
  value: number
  onChange: (days: number) => void
}) => {
  const [localValue, setLocalValue] = useState(value)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [tooltipLeftPx, setTooltipLeftPx] = useState<number | null>(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let days = Math.round(Number(e.target.value) || 0)

    if (days > 0 && days < MIN_NONZERO_DAYS) days = MIN_NONZERO_DAYS

    days = Math.max(MIN_DAYS, Math.min(MAX_DAYS, days))

    setLocalValue(days)
  }

  const percent = useMemo(() => {
    const range = MAX_DAYS - MIN_DAYS || 1

    return Math.round(((localValue - MIN_DAYS) / range) * 100)
  }, [localValue])

  const updateTooltipPosition = useCallback(() => {
    const container = containerRef.current
    const tooltip = tooltipRef.current

    if (!container || !tooltip) return

    const containerWidth = container.clientWidth
    const tooltipWidth = tooltip.offsetWidth

    const range = MAX_DAYS - MIN_DAYS || 1
    const rawX = ((localValue - MIN_DAYS) / range) * containerWidth

    const minX = tooltipWidth / 2
    const maxX = Math.max(containerWidth - minX, minX)
    const clampedX = Math.max(minX, Math.min(rawX, maxX))

    setTooltipLeftPx(clampedX)
  }, [localValue])

  useLayoutEffect(() => {
    updateTooltipPosition()
  }, [updateTooltipPosition, showTooltip])

  useEffect(() => {
    const onResize = () => updateTooltipPosition()

    window.addEventListener('resize', onResize)

    return () => window.removeEventListener('resize', onResize)
  }, [updateTooltipPosition])

  const handleMouseEnter = () => setShowTooltip(true)
  const handleMouseLeave = () => {
    if (!isDragging) setShowTooltip(false)
  }
  const handleMouseDown = () => {
    setIsDragging(true)
    setShowTooltip(true)
  }
  const handleMouseUp = () => {
    setIsDragging(false)
    setShowTooltip(false)
    onChange(localValue)
  }
  const handleFocus = () => setShowTooltip(true)
  const handleBlur = () => {
    if (!isDragging) setShowTooltip(false)
  }

  return (
    <div className={lockupRangeInputStyles.container} ref={containerRef}>
      <div
        className={lockupRangeInputStyles.tooltip}
        ref={tooltipRef}
        style={{
          left: tooltipLeftPx !== null ? `${tooltipLeftPx}px` : `${percent}%`,
          opacity: showTooltip ? 1 : 0,
          visibility: showTooltip ? 'visible' : 'hidden',
        }}
        aria-hidden={!showTooltip}
      >
        <div className={lockupRangeInputStyles.tooltipInner}>
          <Text variant="p4semi">{localValue > 0 ? `${localValue} days` : 'No lockup'}</Text>
        </div>
      </div>

      <input
        type="range"
        min={MIN_DAYS}
        max={MAX_DAYS}
        step={1}
        value={localValue}
        onChange={handleLocalChange}
        className={lockupRangeInputStyles.inputStyles}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{
          background: `linear-gradient(90deg, var(--lazy-summer-primary-100, #FF49A4) ${percent}%, var(--color-border, #3D3D3D) ${percent}%)`,
        }}
      />
    </div>
  )
}
