import { type FC } from 'react'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import palmLeft from '@/public/img/beach_club/palm_1.png'
import palmRight from '@/public/img/beach_club/palm_2.png'

interface RadialGradientProps {
  isBeachClub: boolean
  wrapperStyle?: React.CSSProperties
}

import classNames from './BeachClubPalmBackground.module.css'

const RadialGradient: FC<RadialGradientProps> = ({ isBeachClub, wrapperStyle }) => {
  return (
    <div
      style={{
        position: 'absolute',
        // width: '1022px',
        // height: '1022px',
        left: '50%',
        transform: 'translate(-50%, -100px)',
        overflow: 'hidden',
        transition: 'opacity 0.3s ease-in-out',
        zIndex: -1,
        opacity: isBeachClub ? 1 : 0,
        ...wrapperStyle,
      }}
      className={classNames.radialBackground}
    >
      <svg
        // width="1022"
        // height="1022"
        viewBox="0 0 1022 1022"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames.radialBackground}
      >
        <circle
          opacity="0.08"
          cx="511.386"
          cy="510.57"
          r="510.57"
          fill="url(#paint0_radial_418_12652)"
        />
        <defs>
          <radialGradient
            id="paint0_radial_418_12652"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(511.386 510.57) rotate(90) scale(510.57)"
          >
            <stop stopColor="#FFB52C" />
            <stop offset="1" stopColor="#FFB52C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

export const BeachClubPalmBackground = () => {
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
          opacity: isBeachClub ? 1 : 0,
          zIndex: -1,
        }}
        className={classNames.palmHidden}
      />
      <RadialGradient isBeachClub={isBeachClub} />
      <Image
        src={palmRight}
        alt="palm_right"
        height="422"
        style={{
          position: 'absolute',
          right: 0,
          top: '130px',
          transition: 'opacity 0.3s ease-in-out',
          opacity: isBeachClub ? 1 : 0,
          zIndex: -1,
        }}
      />
      <RadialGradient
        isBeachClub={isBeachClub}
        wrapperStyle={{
          bottom: '0',
          transform: 'translate(-50%, 350px)',
        }}
      />
    </>
  )
}
