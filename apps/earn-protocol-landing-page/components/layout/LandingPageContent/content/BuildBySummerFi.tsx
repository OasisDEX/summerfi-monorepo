import { Text, WithArrow } from '@summerfi/app-earn-ui'
import Link from 'next/link'

import { Emphasis } from '@/components/layout/LandingPageContent/components/Emphasis'

import buildBySummerFiStyles from '@/components/layout/LandingPageContent/content/BuildBySummerFi.module.scss'

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

export const BuildBySummerFi = () => {
  return (
    <div>
      <div className={buildBySummerFiStyles.buildBySummerFiHeaderWrapper}>
        <Text variant="h2" className={buildBySummerFiStyles.buildBySummerFiHeader}>
          Built by <Emphasis variant="h2colorful">Summer.fi</Emphasis>,{' '}
          <Emphasis variant="h2colorful">DeFi’s most trusted frontend app</Emphasis>.
        </Text>
      </div>
      <div className={buildBySummerFiStyles.buildBySummerFiDescription}>
        <Text variant="p1" as="p">
          With Summer, effortlessly earn the best yields and grow your capital faster. We
          automatically rebalance your assets to top protocols, maximizing your returns.
        </Text>
      </div>
      <div className={buildBySummerFiStyles.buildBySummerFiBottomLink}>
        <Link href="#">
          <WithArrow>
            <Text variant="p2semi">View leadership</Text>
          </WithArrow>
        </Link>
      </div>
      <div className={buildBySummerFiStyles.buildBySummerFiStatBlockWrapper}>
        <StatBlock title="Summer.fi TVL" value="1.2B" />
        <div className={buildBySummerFiStyles.buildBySummerFiStatBlockDivider} />
        <StatBlock title="Summer.fi 30D Volume" value="$643.2m" />
        <div className={buildBySummerFiStyles.buildBySummerFiStatBlockDivider} />
        <StatBlock title="Capital Automated" value="$259.7M" />
        <div className={buildBySummerFiStyles.buildBySummerFiStatBlockDivider} />
        <StatBlock title="Time Operating" value="7 years" />
      </div>
    </div>
  )
}