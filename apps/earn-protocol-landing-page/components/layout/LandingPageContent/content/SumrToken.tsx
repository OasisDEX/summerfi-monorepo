import { Button, Emphasis, Text } from '@summerfi/app-earn-ui'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'
import sumrTokenBubbles from '@/public/img/landing-page/sumr-token_bubbles.svg'

import sumrTokenStyles from '@/components/layout/LandingPageContent/content/SumrToken.module.css'

export const SumrToken = () => {
  const pathname = usePathname()
  const handleSumrTokenCta = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-sumr-token-cta`,
      page: pathname,
    })
  }

  return (
    <div className={sumrTokenStyles.sumrTokenWrapper}>
      <div className={sumrTokenStyles.sumrTokenDescription}>
        <Text variant="h2" as="h2">
          The <Emphasis variant="h2colorful">$SUMR</Emphasis>&nbsp;Token
        </Text>
        <Text variant="p2semi" as="p">
          Powering DeFi’s best yield optimizer
        </Text>
        <Text variant="h5" as="h5">
          Governed by $SUMR, governed by you.
        </Text>
        <Text variant="p2" as="p">
          $SUMR is the governance token for the Lazy Summer Protocol and the only way govern and
          make changes to the Lazy Vaults. As a token holder you help on and off-board markets, hold
          contributors accountable and allocate governance owned capital.
        </Text>

        <Text variant="h5" as="h5">
          Three ways to earn $SUMR
        </Text>
        <Text variant="p2" as="p">
          You can earn $SUMR by participating in the protocol and the community. Deposit into the
          Protocol, Stake & Delegate your voting power or be a Delegate and vote on behalf of
          others. Earn $SUMR and help contribute to the value created by the Lazy Summer Protocol.
        </Text>
        <Link href="/earn/sumr" prefetch={false} onClick={handleSumrTokenCta}>
          <Button variant="secondarySmall">Get $SUMR</Button>
        </Link>
      </div>
      <div className={sumrTokenStyles.sumrImage}>
        <Image src={sumrTokenBubbles} alt="$SUMR Token Bubbles" />
      </div>
    </div>
  )
}
