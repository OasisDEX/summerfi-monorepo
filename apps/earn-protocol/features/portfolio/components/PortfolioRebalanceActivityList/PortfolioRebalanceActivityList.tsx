import { type FC, useState } from 'react'
import { getVaultPositionUrl, Icon, Text, useMobileCheck, WithArrow } from '@summerfi/app-earn-ui'
import { type SDKGlobalRebalancesType, type TokenSymbolsList } from '@summerfi/app-types'
import { formatFiatBalance, sdkNetworkToHumanNetwork, timeAgo } from '@summerfi/app-utils'
import { capitalize } from 'lodash-es'
import Link from 'next/link'

import { networkIconByNetworkName } from '@/constants/networkIcons'
import { useDeviceType } from '@/contexts/DeviceContext/DeviceContext'
import { rebalanceActivityPurposeMapper } from '@/features/rebalance-activity/table/mapper'

import classNames from './PortfolioRebalanceActivityList.module.scss'

interface PortfolioRebalanceActivityListProps {
  rebalancesList: SDKGlobalRebalancesType
  walletAddress: string
}

export const PortfolioRebalanceActivityList: FC<PortfolioRebalanceActivityListProps> = ({
  rebalancesList,
  walletAddress,
}) => {
  // timestamp should be unique, so can be used as id
  const [hoveredItemTimestamp, setHoveredItemTimestamp] = useState<number>()

  const { deviceType } = useDeviceType()
  const { isMobile } = useMobileCheck(deviceType)

  return (
    <>
      <div className={classNames.wrapper}>
        {rebalancesList.map((item) => {
          const purpose = rebalanceActivityPurposeMapper(item)

          return (
            <div
              key={item.id}
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
                      <Icon tokenName={item.asset.symbol as TokenSymbolsList} variant="s" />
                      <Text
                        as="p"
                        variant="p3semi"
                        style={{ color: 'var(--earn-protocol-secondary-60)' }}
                      >
                        {formatFiatBalance(item.amountUSD)}
                      </Text>
                      {!isMobile && <span>&#8226;</span>}
                      <div className={classNames.leftContentDescriptionNetwork}>
                        <Icon
                          iconName={
                            networkIconByNetworkName[item.protocol.network] ?? 'not_supported_icon'
                          }
                          variant="xs"
                        />
                        <Text
                          as="p"
                          variant="p3semi"
                          style={{ color: 'var(--earn-protocol-secondary-60)' }}
                        >
                          {capitalize(sdkNetworkToHumanNetwork(item.protocol.network))}
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
                      network: item.protocol.network,
                      vaultId: item.vault.id,
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
      {rebalancesList.length === 0 && (
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
