/* eslint-disable no-mixed-operators */
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useLandingPageBlobs } from '@/components/layout/LandingMasterPage/landingPageBlobs.hook'
import landingPageGrid from '@/public/img/landing-page/grid.svg'

import landingPageBlobsStyles from '@/components/layout/LandingMasterPage/landingPageBlobs.module.css'

import landingPagePebbles from '@/public/img/misc/pebbles.png'

type LandingPageBlobsProps = {
  smallBlobCount?: number
  largeBlobCount?: number
}

export const LandingPageBlobs = ({
  smallBlobCount = 100,
  largeBlobCount = 5,
}: LandingPageBlobsProps) => {
  const [localSmallBlobCount, setLocalSmallBlobCount] = useState(smallBlobCount)
  const [showFarewell, setShowFarewell] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRectRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const typedWindow = window as Window & { setBlobCount?: (count: number) => void }

      // let change the blob count in the console to test performance impact
      typedWindow.setBlobCount = setLocalSmallBlobCount
    }
  }, [])

  const handleFinale = useCallback(() => setShowFarewell(true), [])

  useLandingPageBlobs({
    canvasRef,
    canvasRectRef,
    smallBlobCount: localSmallBlobCount,
    largeBlobCount,
    gridSrc: landingPageGrid.src,
    noiseSrc: landingPagePebbles.src,
    onFinale: handleFinale,
  })

  return (
    <div className={landingPageBlobsStyles.blobsContainer}>
      <canvas ref={canvasRef} className={landingPageBlobsStyles.canvas} />
      <div className={landingPageBlobsStyles.gradientBottom} />
      <div
        className={
          showFarewell
            ? `${landingPageBlobsStyles.farewell} ${landingPageBlobsStyles.farewellVisible}`
            : landingPageBlobsStyles.farewell
        }
        aria-hidden={!showFarewell}
      >
        <p className={landingPageBlobsStyles.farewellTitle}>Thank you</p>
        <p className={landingPageBlobsStyles.farewellSubtitle}>— the Summer.fi team</p>
      </div>
    </div>
  )
}
