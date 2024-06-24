'use client'
import { useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

import { trackPageViewTimed } from '@/helpers/mixpanel'

interface PageViewHandlerProps {
  userAddress: string
}

export const PageViewHandler = ({ userAddress }: PageViewHandlerProps) => {
  const currentPath = usePathname()

  useLayoutEffect(() => {
    trackPageViewTimed({
      path: currentPath,
      userAddress,
    })
  }, [currentPath, userAddress])

  return null
}
