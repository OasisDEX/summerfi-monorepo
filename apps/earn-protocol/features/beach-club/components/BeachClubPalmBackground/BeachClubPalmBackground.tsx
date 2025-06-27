import { type CSSProperties, type FC } from 'react'
import { BeachClubRadialGradient } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import classNames from './BeachClubPalmBackground.module.css'

import palmLeft from '@/public/img/beach_club/palm_1.png'
import palmRight from '@/public/img/beach_club/palm_2.png'

interface BeachClubPalmBackgroundProps {
  leftPalmSyles?: CSSProperties
  rightPalmSyles?: CSSProperties
  topGradientStyles?: CSSProperties
  bottomGradientStyles?: CSSProperties
}

export const BeachClubPalmBackground: FC<BeachClubPalmBackgroundProps> = ({
  leftPalmSyles,
  rightPalmSyles,
  topGradientStyles,
  bottomGradientStyles,
}) => {
  const searchParams = useSearchParams()

  const isBeachClub = searchParams.get('tab') === 'beach-club'

  return (
    <>
      <Image
        src={palmLeft}
        alt="palm_left"
        height="577"
        style={{
          position: 'absolute',
          left: '-100px',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isBeachClub ? 0.7 : 0,
          zIndex: -1,
          pointerEvents: 'none',
          ...leftPalmSyles,
        }}
        className={classNames.palmHidden}
      />
      <BeachClubRadialGradient
        isBeachClub={isBeachClub}
        wrapperStyle={{
          pointerEvents: 'none',
          ...topGradientStyles,
        }}
      />
      <Image
        src={palmRight}
        alt="palm_right"
        height="422"
        style={{
          position: 'absolute',
          right: 0,
          top: '130px',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isBeachClub ? 0.7 : 0,
          zIndex: -1,
          pointerEvents: 'none',
          ...rightPalmSyles,
        }}
      />
      <BeachClubRadialGradient
        isBeachClub={isBeachClub}
        wrapperStyle={{
          bottom: '0',
          transform: 'translate(-50%, 350px)',
          pointerEvents: 'none',
          ...bottomGradientStyles,
        }}
        opacity={0.7}
      />
    </>
  )
}
