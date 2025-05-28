import { Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import classNames from './BeachClubBoatPoints.module.css'

import boatPointsImage from '@/public/img/beach-club/beach-boat-points.png'

export const BeachClubBoatPoints = () => {
  return (
    <div className={classNames.beachClubBoatPointsWrapper}>
      <div className={classNames.textualWrapper}>
        <Text as="h2" variant="h2">
          Beach Boat points: T-shirt, Hoodie, NFT
        </Text>
        <Text as="p" variant="p1" style={{ color: 'var(--earn-protocol-secondary-60)' }}>
          Beach boat is our more accessible, point based refferal rewards that is not solely based
          on TVL. Earn points for reffering TVL, and the number of accounts you refer. The more
          points your earn the more prizes you unlock.
        </Text>
      </div>
      <Image src={boatPointsImage} alt="Beach Boat points" width={368} />
    </div>
  )
}
