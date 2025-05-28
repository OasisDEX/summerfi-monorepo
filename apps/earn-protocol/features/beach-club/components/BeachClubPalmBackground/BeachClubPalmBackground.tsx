import { BeachClubRadialGradient } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

import classNames from './BeachClubPalmBackground.module.css'

import palmLeft from '@/public/img/beach_club/palm_1.png'
import palmRight from '@/public/img/beach_club/palm_2.png'

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
          opacity: isBeachClub ? 0.7 : 0,
          zIndex: -1,
        }}
        className={classNames.palmHidden}
      />
      <BeachClubRadialGradient isBeachClub={isBeachClub} />
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
        }}
      />
      <BeachClubRadialGradient
        isBeachClub={isBeachClub}
        wrapperStyle={{
          bottom: '0',
          transform: 'translate(-50%, 350px)',
        }}
        opacity={0.7}
      />
    </>
  )
}
