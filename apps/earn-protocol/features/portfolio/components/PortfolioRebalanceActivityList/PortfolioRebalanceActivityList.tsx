import { type FC, useState } from 'react'
import { getVaultPositionUrl, Icon, Text, useMobileCheck, WithArrow } from '@summerfi/app-earn-ui'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatFiatBalance, sdkNetworkToHumanNetwork, timeAgo } from '@summerfi/app-utils'
import { type RebalanceActivity } from '@summerfi/summer-protocol-db'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { dbNetworkToSdkNetworkMap } from '@/app/server-handlers/tables-data/consts'
import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { rebalanceActivityPurposeMapper } from '@/features/rebalance-activity/table/mapper'

import classNames from './PortfolioRebalanceActivityList.module.scss'

interface PortfolioRebalanceActivityListProps {
  rebalanceActivityList: RebalanceActivity[]
  walletAddress: string
}

export const PortfolioRebalanceActivityList: FC<PortfolioRebalanceActivityListProps> = ({
  rebalanceActivityList,
  walletAddress,
}) => {
  // timestamp should be unique, so can be used as id
  const [hoveredItemTimestamp, setHoveredItemTimestamp] = useState<number>()

  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  return (
    <>
      <div className={classNames.wrapper}>
        {rebalanceActivityList.map((item) => {
          const purpose = rebalanceActivityPurposeMapper(item)

          return (
            <div
              key={item.id?.toString() ?? item.rebalanceId}
              onMouseEnter={() => setHoveredItemTimestamp(Number(item.timestamp))}
              onMouseLeave={() => setHoveredItemTimestamp(undefined)}
            >
              <div className={classNames.contentWrapper}>
                <div className={classNames.leftContentWrapper}>
                  <div className={classNames.iconWrapper}>
                    <Icon
                      iconName={purpose.icon}
                      variant="s"
                      color={
                        hoveredItemTimestamp === Number(item.timestamp)
                          ? 'rgba(210, 210, 210, 1)'
                          : 'rgba(119, 117, 118, 1)'
                      }
                    />
                  </div>
                  <div className={classNames.leftContent}>
                    <Text as="p" variant="p2semi">
                      {purpose.label}
                    </Text>
                    <div className={classNames.leftContentDescription}>
                      <Icon tokenName={item.inputTokenSymbol as TokenSymbolsList} variant="s" />
                      <Text
                        as="p"
                        variant="p3semi"
                        style={{ color: 'var(--earn-protocol-secondary-60)' }}
                      >
                        {formatFiatBalance(item.amountUsd.toString())}
                      </Text>
                      {!isMobile && <span>&#8226;</span>}
                      <div className={classNames.leftContentDescriptionNetwork}>
                        <Icon
                          iconName={
                            networkIconByNetworkName[
                              dbNetworkToSdkNetworkMap[item.network] ?? 'not_supported_icon'
                            ]
                          }
                          variant="xs"
                        />
                        <Text
                          as="p"
                          variant="p3semi"
                          style={{ color: 'var(--earn-protocol-secondary-60)' }}
                        >
                          {capitalize(
                            sdkNetworkToHumanNetwork(dbNetworkToSdkNetworkMap[item.network]),
                          )}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classNames.rightContentWrapper}>
                  <Text as="p" variant="p3semi" suppressHydrationWarning>
                    {timeAgo({ from: new Date(), to: new Date(Number(item.timestamp) * 1000) })}
                  </Text>
                  {!isMobile && <span>&#8226;</span>}
                  <Link
                    href={getVaultPositionUrl({
                      network: dbNetworkToSdkNetworkMap[item.network],
                      vaultId: item.vaultId,
                      walletAddress,
                    })}
                  >
                    <WithArrow reserveSpace={!isMobile}>Go to position</WithArrow>
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>{' '}
      {rebalanceActivityList.length === 0 && (
        <Text
          as="p"
          variant="p3semi"
          style={{
            textAlign: 'center',
            marginTop: 'var(--general-space-24)',
            color: 'var(--color-text-secondary)',
          }}
        >
          No activity available to display
        </Text>
      )}
    </>
  )
}
