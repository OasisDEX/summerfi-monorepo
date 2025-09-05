import { type FC } from 'react'
import { Emphasis, Text, WithArrow } from '@summerfi/app-earn-ui'
import { type ProAppStats } from '@summerfi/app-types'
import { formatFiatBalance } from '@summerfi/app-utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { EarnProtocolEvents } from '@/helpers/mixpanel'

import buildBySummerFiStyles from '@/components/layout/LandingPageContent/content/BuildBySummerFi.module.css'

const StatBlock = ({ title, value }: { title: string; value: string }) => {
  return (
    <div className={buildBySummerFiStyles.statBlock}>
      <Text variant="p3semi" as="p">
        {title}
      </Text>
      <Text variant="h3" as="h3">
        {value}
      </Text>
    </div>
  )
}

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
  proAppStats?: ProAppStats
  noHeaderDescription?: boolean
}

export const BuildBySummerFi: FC<BuildBySummerFiProps> = ({
  proAppStats,
  noHeaderDescription = false,
}) => {
  if (!proAppStats) {
    return (
      <div>
        <BuildBySummerFiHeader noHeaderDescription={noHeaderDescription} />
      </div>
    )
  }

  const { monthlyVolume, managedOnOasis, lockedCollateralActiveTrigger } = proAppStats

  return (
    <div style={{ width: '100%' }}>
      <BuildBySummerFiHeader noHeaderDescription={noHeaderDescription} />
      <div className={buildBySummerFiStyles.buildBySummerFiStatBlockWrapper}>
        <StatBlock title="Summer.fi TVL" value={`$${formatFiatBalance(managedOnOasis)}`} />
        <StatBlock title="Summer.fi 30D Volume" value={`$${formatFiatBalance(monthlyVolume)}`} />
        <StatBlock
          title="Capital Automated"
          value={`$${formatFiatBalance(lockedCollateralActiveTrigger)}`}
        />
        <StatBlock title="Time Operating" value="7 years" />
      </div>
    </div>
  )
}
