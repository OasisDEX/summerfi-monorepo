import { Card, GradientBox, INTERNAL_LINKS, Text } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import summerFiProBoxStyles from '@/components/layout/LandingPageContent/content/SummerFiProBox.module.scss'

export const SummerFiProBox = () => {
  return (
    <GradientBox selected className={summerFiProBoxStyles.summerProInfoBox}>
      <Card variant="cardGradientLight" style={{ flexDirection: 'column' }}>
        <Text variant="p2semiColorful">Looking to borrow or multiply?</Text>
        <Text variant="p3semi">Summer.fi Pro, advanced DeFi features all in one app.</Text>
        <Text variant="p3semi" className={summerFiProBoxStyles.summerProInfoBoxLinks}>
          <Link href={`${INTERNAL_LINKS.summerPro}/multiply`} target="_blank">
            Multiply
          </Link>
          &nbsp;・&nbsp;
          <Link href={`${INTERNAL_LINKS.summerPro}/borrow`} target="_blank">
            Borrow
          </Link>
          &nbsp;・&nbsp;
          <Link href={`${INTERNAL_LINKS.summerPro}/earn`} target="_blank">
            Yield Loops
          </Link>
        </Text>
      </Card>
    </GradientBox>
  )
}
