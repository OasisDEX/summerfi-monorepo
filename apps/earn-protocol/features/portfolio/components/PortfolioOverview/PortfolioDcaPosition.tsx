import { Button, Card, getDisplayToken, Icon, Text } from '@summerfi/app-earn-ui'
import {
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  subgraphNetworkToId,
  subgraphNetworkToSDKId,
  supportedSDKNetwork,
} from '@summerfi/app-utils'
import { ArmadaDcaOrderStatusEnum, type IArmadaDcaOrder } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import dayjs from 'dayjs'
import Link from 'next/link'

import { VaultSwitchBox } from '@/components/molecules/SidebarElements/VaultSwitchBox'

import classNames from './PortfolioDcaPosition.module.css'

const findVault = (
  vaultsList: SDKVaultsListType,
  address: string,
  chainId: number,
): SDKVaultishType | undefined => {
  const target = address.toLowerCase()

  return vaultsList.find(
    (vault) =>
      vault.id.toLowerCase() === target &&
      subgraphNetworkToId(supportedSDKNetwork(vault.protocol.network)) === chainId,
  )
}

const formatTokenAmount = (rawAmount: string, decimals: number, symbol: string): string => {
  const amount = new BigNumber(rawAmount).shiftedBy(-decimals)

  return `${formatCryptoBalance(amount)} ${symbol}`
}

const formatFrequency = (intervalSeconds: number): string => {
  if (intervalSeconds % (24 * 60 * 60) === 0) {
    const days = intervalSeconds / (24 * 60 * 60)

    return `Every ${days} ${days === 1 ? 'day' : 'days'}`
  }

  if (intervalSeconds % (60 * 60) === 0) {
    const hours = intervalSeconds / (60 * 60)

    return `Every ${hours} ${hours === 1 ? 'hour' : 'hours'}`
  }

  if (intervalSeconds % 60 === 0) {
    const minutes = intervalSeconds / 60

    return `Every ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`
  }

  return `Every ${intervalSeconds} ${intervalSeconds === 1 ? 'second' : 'seconds'}`
}

const formatDay = (unixTimestamp?: number): string => {
  if (!unixTimestamp) return '-'

  return dayjs.unix(unixTimestamp).format('DD MMM YYYY')
}

const getStatusLabel = (orderStatus: ArmadaDcaOrderStatusEnum): string => {
  if (orderStatus === ArmadaDcaOrderStatusEnum.Active) return 'Active'
  if (orderStatus === ArmadaDcaOrderStatusEnum.Paused) return 'Paused'
  if (orderStatus === ArmadaDcaOrderStatusEnum.Cancelled) return 'Cancelled'

  return 'Completed'
}

export const PortfolioDcaPosition = ({
  order,
  vaultsList,
}: {
  order: IArmadaDcaOrder
  vaultsList: SDKVaultsListType
}) => {
  const fromVault = findVault(vaultsList, order.fromVault, order.chainId)
  const toVault = findVault(vaultsList, order.toVault, order.chainId)

  const fromSymbol = fromVault?.inputToken.symbol ?? 'TOKEN'
  const fromDecimals = fromVault?.inputToken.decimals ?? 18
  const amountLabel = formatTokenAmount(
    order.amount,
    fromDecimals,
    fromVault ? getDisplayToken(fromSymbol) : fromSymbol,
  )

  const hasThreshold = order.neverBuyAbove !== undefined || order.neverSellBelow !== undefined

  return (
    <Card variant="cardPrimary" className={classNames.wrapperCard}>
      <div className={classNames.headerRow}>
        <Text as="h3" variant="h5">
          DCA Strategy
        </Text>
        <div className={classNames[`status-${order.status}`]}>{getStatusLabel(order.status)}</div>
      </div>

      <div className={classNames.vaultRow}>
        {fromVault ? (
          <div className={classNames.vaultBoxWrapper}>
            <VaultSwitchBox
              title="From"
              chainId={subgraphNetworkToSDKId(supportedSDKNetwork(fromVault.protocol.network))}
              tokenName={fromVault.inputToken.symbol as TokenSymbolsList}
              risk={fromVault.isDaoManaged ? 'higher' : (fromVault.customFields?.risk ?? 'lower')}
              isDaoManaged={fromVault.isDaoManaged}
              wrapperStyle={{ background: 'transparent', width: '100%' }}
            />
          </div>
        ) : (
          <div className={classNames.vaultBoxFallback}>
            <Text variant="p4semi">From</Text>
            <Text variant="p3">{order.fromVault}</Text>
          </div>
        )}

        <div className={classNames.vaultBridge} aria-hidden="true">
          <Icon iconName="arrow_forward" size={20} />
        </div>

        {toVault ? (
          <div className={classNames.vaultBoxWrapper}>
            <VaultSwitchBox
              title="To"
              chainId={subgraphNetworkToSDKId(supportedSDKNetwork(toVault.protocol.network))}
              tokenName={toVault.inputToken.symbol as TokenSymbolsList}
              risk={toVault.isDaoManaged ? 'higher' : (toVault.customFields?.risk ?? 'lower')}
              isDaoManaged={toVault.isDaoManaged}
              wrapperStyle={{ background: 'transparent', width: '100%' }}
            />
          </div>
        ) : (
          <div className={classNames.vaultBoxFallback}>
            <Text variant="p4semi">To</Text>
            <Text variant="p3">{order.toVault}</Text>
          </div>
        )}
      </div>

      <div className={classNames.metricsRow}>
        <div className={classNames.metric}>
          <Text variant="p4" className={classNames.label}>
            Amount per run
          </Text>
          <Text variant="p2semi">{amountLabel}</Text>
        </div>

        <div className={classNames.metric}>
          <Text variant="p4" className={classNames.label}>
            Frequency
          </Text>
          <Text variant="p2semi">{formatFrequency(order.intervalSeconds)}</Text>
        </div>

        <div className={classNames.metric}>
          <Text variant="p4" className={classNames.label}>
            Ends at
          </Text>
          <Text variant="p2semi">{formatDay(order.deadlineUnixTimestamp)}</Text>
        </div>

        <div className={classNames.metric}>
          <Text variant="p4" className={classNames.label}>
            Conditions
          </Text>
          {hasThreshold ? (
            <>
              {order.neverBuyAbove !== undefined ? (
                <Text variant="p2semi" className={classNames.muted}>
                  Never buy above ${order.neverBuyAbove}
                </Text>
              ) : null}
              {order.neverSellBelow !== undefined ? (
                <Text variant="p2semi" className={classNames.muted}>
                  Never sell below ${order.neverSellBelow}
                </Text>
              ) : null}
            </>
          ) : (
            <Text variant="p3" className={classNames.muted}>
              No price thresholds
            </Text>
          )}
        </div>
      </div>

      <div className={classNames.footerRow}>
        <Link
          href={`/dca/position/${order.userAddress}/${order.id}`}
          className={classNames.viewLink}
        >
          <Button variant="primaryMedium">View position</Button>
        </Link>
      </div>
    </Card>
  )
}
