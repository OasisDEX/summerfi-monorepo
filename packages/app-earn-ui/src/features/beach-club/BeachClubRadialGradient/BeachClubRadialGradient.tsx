import { type FC } from 'react'

import classNames from './BeachClubRadialGradient.module.css'

interface BeachClubRadialGradientProps {
  isBeachClub: boolean
  wrapperStyle?: React.CSSProperties
  opacity?: number
}

export const BeachClubRadialGradient: FC<BeachClubRadialGradientProps> = ({
  isBeachClub,
  wrapperStyle,
  opacity,
}) => {
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
        opacity: isBeachClub ? opacity ?? 1 : 0,
        ...wrapperStyle,
      }}
      className={classNames.beachClubRadialGradient}
    >
      <svg
        // width="1022"
        // height="1022"
        viewBox="0 0 1022 1022"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={classNames.beachClubRadialGradient}
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
