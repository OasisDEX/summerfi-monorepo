import { useEffect, useRef } from 'react'
import { type EarnProtocolScrolledEventProps } from '@summerfi/app-types'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

interface UseScrollTrackerProps {
  walletAddress?: string
  throttleMs?: number // minimum ms between events
  breakpointPercent?: number // default 10%
}

export const useScrollTracker = ({
  walletAddress,
  throttleMs = 1000,
  breakpointPercent = 10,
}: UseScrollTrackerProps) => {
  const pathname = usePathname()
  const lastFired = useRef<number>(0)
  const firedMilestones = useRef<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()

      if (now - lastFired.current < throttleMs) return

      const scrollTop = window.scrollY
      const viewportHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollPercent = Math.min(
        100,
        Math.round((scrollTop / (documentHeight - viewportHeight)) * 100),
      )

      // Determine the nearest breakpoint
      const milestone = Math.floor(scrollPercent / breakpointPercent) * breakpointPercent

      if (milestone > 0 && !firedMilestones.current.has(milestone)) {
        firedMilestones.current.add(milestone)
        lastFired.current = now

        const eventProps: EarnProtocolScrolledEventProps = {
          walletAddress,
          page: pathname || '/',
          scrollDepthPercent: scrollPercent,
          scrollDepthPixels: scrollTop,
          viewportHeight,
          documentHeight,
        }

        EarnProtocolEvents.scrolled(eventProps)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [walletAddress, pathname, throttleMs, breakpointPercent])
}
