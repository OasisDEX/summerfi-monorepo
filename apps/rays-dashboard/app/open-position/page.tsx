import { type AppRaysConfigType } from '@summerfi/app-types'
import {
  CountDownBanner,
  Dial,
  INTERNAL_LINKS,
  ProxyLinkComponent,
  Text,
  WithArrow,
} from '@summerfi/app-ui'
import { formatAsShorthandNumbers } from '@summerfi/app-utils'
import { EligibilityCondition } from '@summerfi/serverless-shared'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'

import { PageViewHandler } from '@/components/organisms/PageViewHandler/PageViewHandler'
import { ProductPicker } from '@/components/organisms/ProductPicker/ProductPicker'
import { fetchMigrations } from '@/server-handlers/migrate'
import { fetchRays } from '@/server-handlers/rays'
import systemConfigHandler from '@/server-handlers/system-config'

const firstWeekTimestamp = dayjs('2024-06-18T11:00:00+02:00')

interface OpenPositionPageProps {
  searchParams: {
    userAddress: string
  }
}

const weekBoosters = [5, 4, 3.5, 3, 2.5, 2, 1.5, 1.25]

export default async function OpenPositionPage({ searchParams }: OpenPositionPageProps) {
  const currentDate = dayjs()
  const currentWeekDifference = currentDate.diff(firstWeekTimestamp, 'week')
  const currentWeekEnd = firstWeekTimestamp
    .add(currentWeekDifference + 1, 'week')
    .toDate()
    .toDateString()
  const currentBooster = weekBoosters[currentWeekDifference]

  const systemConfig = await systemConfigHandler()
  const { userAddress } = searchParams

  const userRays = await fetchRays({ address: userAddress })
  const { migrationsV2, error: migrationsListError } = await fetchMigrations({
    address: userAddress,
    systemConfig,
  })

  // if they dont have a position on summer, this flag will appear
  const becomeSummerUserPoints = userRays.rays?.actionRequiredPoints.find(
    (point) => point.type === EligibilityCondition.BECOME_SUMMER_USER,
  )?.points

  // if has open position, but will get more points after a while
  const positionOpenTime = userRays.rays?.actionRequiredPoints.find(
    (point) => point.type === EligibilityCondition.POSITION_OPEN_TIME,
  )

  const notAllRaysEligible =
    userRays.rays &&
    userRays.rays.eligiblePoints > 0 &&
    userRays.rays.eligiblePoints !== userRays.rays.allPossiblePoints

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 'var(--space-xxl)',
      }}
    >
      {!!userRays.rays && (
        <Dial
          value={userRays.rays.eligiblePoints}
          max={userRays.rays.allPossiblePoints}
          formatter={(value) => {
            if (value >= 10000) {
              return formatAsShorthandNumbers(new BigNumber(value.toFixed(0)), {
                precision: 0,
              })
            }

            return value ? value.toFixed(0) : '0'
          }}
          subtext="Elligible"
          icon="rays"
        />
      )}
      {positionOpenTime ? (
        <Text
          as="h2"
          variant="h2"
          style={{ marginTop: 'var(--space-xxl)', marginBottom: 'var(--space-s)' }}
        >
          You&rsquo;ll soon qualify for all your $RAYS
        </Text>
      ) : (
        <Text
          as="h2"
          variant="h2"
          style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-l)' }}
        >
          Open{migrationsV2.length ? ' or migrate' : ''} a position
          <br />
          to qualify for {notAllRaysEligible ? 'all' : ''} your $RAYS
        </Text>
      )}
      {currentBooster && !positionOpenTime && (
        <CountDownBanner
          futureTimestamp={currentWeekEnd}
          countdownLabel={`Boost ${becomeSummerUserPoints ? `${becomeSummerUserPoints} $RAYS` : `your RAYS`} ${currentBooster}x when you open a position`}
        />
      )}
      {positionOpenTime && (
        <CountDownBanner
          futureTimestamp={positionOpenTime.dueDate}
          countdownLabel="Keep at least one position open for another"
        />
      )}
      <ProductPicker
        products={systemConfig.configRays.products as AppRaysConfigType['products']}
        productHub={systemConfig.productHub.table}
        userAddress={userAddress}
        migrations={!migrationsListError ? migrationsV2 : undefined}
      />
      <ProxyLinkComponent
        target="_blank"
        href={INTERNAL_LINKS.earn}
        style={{ marginTop: 'var(--space-m)' }}
      >
        <WithArrow gap={0} variant="p1semi">
          Explore over 50+ positions with major protocols and collateral types supports
        </WithArrow>
      </ProxyLinkComponent>
      <PageViewHandler userAddress={searchParams.userAddress} />
    </div>
  )
}
