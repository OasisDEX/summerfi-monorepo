/* eslint-disable no-mixed-operators */
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { useLandingPageBlobs } from '@/components/layout/LandingMasterPage/landingPageBlobs.hook'
import landingPageGrid from '@/public/img/landing-page/grid.svg'

import landingPageBlobsStyles from '@/components/layout/LandingMasterPage/landingPageBlobs.module.css'

type LandingPageBlobsProps = {
  smallBlobCount?: number
  largeBlobCount?: number
}

export const LandingPageBlobs = ({
  smallBlobCount = 100,
  largeBlobCount = 5,
}: LandingPageBlobsProps) => {
  const [localSmallBlobCount, setLocalSmallBlobCount] = useState(smallBlobCount)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasRectRef = useRef<DOMRect | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const typedWindow = window as Window & { setBlobCount?: (count: number) => void }

      // let change the blob count in the console to test performance impact
      typedWindow.setBlobCount = setLocalSmallBlobCount
    }
  }, [])

  useLandingPageBlobs({
    canvasRef,
    canvasRectRef,
    smallBlobCount: localSmallBlobCount,
    largeBlobCount,
  })

  return (
    <div className={landingPageBlobsStyles.blobsContainer}>
      <Image
        src={landingPageGrid}
        alt="landing_page_grid"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          zIndex: -1,
          transform: 'scale(1.5)',
        }}
        priority
      />
      <canvas ref={canvasRef} className={landingPageBlobsStyles.canvas} />
      <div className={landingPageBlobsStyles.gradientBottom} />
    </div>
  )
}
