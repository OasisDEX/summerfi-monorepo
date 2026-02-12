import { type FC } from 'react'
import { Emphasis, Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import buildBySummerFiStyles from '@/components/layout/LandingPageContent/content/BuildBySummerFi.module.css'

const BuildBySummerFiHeader = ({ noHeaderDescription }: { noHeaderDescription?: boolean }) => {
  const pathname = usePathname()

  const handleViewLeadershipCta = () => {
    EarnProtocolEvents.buttonClicked({
      buttonName: `lp-institutions-view-leadership`,
      page: pathname,
    })
  }

  return (
    <>
      <div
        className={buildBySummerFiStyles.buildBySummerFiHeaderWrapper}
        style={{ marginBottom: !noHeaderDescription ? 0 : '32px' }}
      >
        <Text variant="h2" className={buildBySummerFiStyles.buildBySummerFiHeader}>
          Built by <Emphasis variant="h2colorful">Summer.fi</Emphasis>,{' '}
          <Emphasis variant="h2colorful">DeFi’s most trusted frontend app</Emphasis>.
        </Text>
      </div>
      {!noHeaderDescription && (
        <>
          <div className={buildBySummerFiStyles.buildBySummerFiDescription}>
            <Text variant="p1" as="p">
              With Summer.fi, effortlessly earn the best yields and grow your capital faster. We
              automatically rebalance your assets to top protocols, maximizing your returns.
            </Text>
          </div>
          <div className={buildBySummerFiStyles.buildBySummerFiBottomLink}>
            <Link href="/team" prefetch={false} onClick={handleViewLeadershipCta}>
              <WithArrow>
                <Text variant="p2semi">View leadership</Text>
              </WithArrow>
            </Link>
          </div>
        </>
      )}
    </>
  )
}

interface BuildBySummerFiProps {
  noHeaderDescription?: boolean
}

export const BuildBySummerFi: FC<BuildBySummerFiProps> = ({ noHeaderDescription = false }) => {
  return (
    <div>
      <BuildBySummerFiHeader noHeaderDescription={noHeaderDescription} />
    </div>
  )
}
