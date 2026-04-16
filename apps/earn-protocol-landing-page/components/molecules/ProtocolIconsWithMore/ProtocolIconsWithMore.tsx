import { Text, Tooltip } from '@summerfi/app-earn-ui'
import Image from 'next/image'

import styles from '@/components/layout/LandingPageContent/components/OurProductsList.module.css'

import aaveProtocolIcon from '@/public/img/landing-page/protocols/icon_aave.png'
import gauntletProtocolIcon from '@/public/img/landing-page/protocols/icon_gauntlet.png'
import kpkProtocolIcon from '@/public/img/landing-page/protocols/icon_kpk.png'
import mapleProtocolIcon from '@/public/img/landing-page/protocols/icon_maple.png'
import morphoProtocolIcon from '@/public/img/landing-page/protocols/icon_morpho.png'
import skyProtocolIcon from '@/public/img/landing-page/protocols/icon_sky.png'
import sparkProtocolIcon from '@/public/img/landing-page/protocols/icon_spark.png'
import steakhouseProtocolIcon from '@/public/img/landing-page/protocols/icon_steakhouse.png'

export const protocolIconsWithMoreList = [
  { name: 'Morpho', src: morphoProtocolIcon },
  { name: 'Aave', src: aaveProtocolIcon },
  { name: 'Spark', src: sparkProtocolIcon },
  { name: 'Sky', src: skyProtocolIcon },
  { name: 'Maple', src: mapleProtocolIcon },
  { name: 'Gauntlet', src: gauntletProtocolIcon },
  { name: 'Steakhouse', src: steakhouseProtocolIcon },
  { name: 'KPK', src: kpkProtocolIcon },
]

export const ProtocolIconsWithMore = ({
  withMore = true,
  limit = 0,
}: {
  withMore?: boolean
  limit?: number
}) => {
  return (
    <div className={styles.protocolRow}>
      {protocolIconsWithMoreList.slice(0, limit || undefined).map((icon) => (
        <Tooltip
          key={icon.name}
          tooltip={icon.name}
          hideDrawerOnMobile
          showAbove
          tooltipCardVariant="cardSecondarySmallPaddings"
          tooltipWrapperStyles={{
            top: '-30px',
          }}
        >
          <div className={styles.protocolIconWrap}>
            <Image
              alt={icon.name}
              src={icon.src}
              width={32}
              height={32}
              className={styles.protocolIcon}
            />
          </div>
        </Tooltip>
      ))}
      {withMore && (
        <div className={styles.morePill}>
          <Text as="span" variant="p4semi">
            + More
          </Text>
        </div>
      )}
    </div>
  )
}
