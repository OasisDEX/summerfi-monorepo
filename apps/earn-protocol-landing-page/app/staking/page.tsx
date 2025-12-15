'use client'

import { useEffect } from 'react'

export default function StakingRedirectPage() {
  useEffect(() => {
    window.location.replace('/earn/staking')
  }, [])

  return <div />
}
