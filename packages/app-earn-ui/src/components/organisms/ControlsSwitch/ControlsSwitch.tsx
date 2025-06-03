'use client'
import { type Dispatch, type ReactNode, type SetStateAction, useMemo, useState } from 'react'
import {
  type IArmadaPosition,
  type NetworkIds,
  type RiskType,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
  type VaultApyData,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatDecimalAsPercent } from '@summerfi/app-utils'
import clsx from 'clsx'

import { Card } from '@/components/atoms/Card/Card'
import { Icon } from '@/components/atoms/Icon/Icon'
import { Risk } from '@/components/atoms/Risk/Risk'
import { Text } from '@/components/atoms/Text/Text'
import { GradientBox } from '@/components/molecules/GradientBox/GradientBox'
import { Tooltip } from '@/components/molecules/Tooltip/Tooltip'
import { VaultTitle } from '@/components/molecules/VaultTitle/VaultTitle'
import { getTokenDisplayName } from '@/tokens/helpers'

import controlsSwitchStyles from './ControlsSwitch.module.css'

const VaultSwitchCardDataBlock = ({ title, value }: { title: string; value?: string }) => {
  return value ? (
    <>
      <Text variant="p3semi" style={{ color: 'var(--color-text-primary-hover)' }}>
        {title}
      </Text>
      <Text variant="h5" style={{ color: 'var(--color-text-primary-hover)' }}>
        {value}
      </Text>
    </>
  ) : null
}

const VaultSwitchCard = ({
  token,
  chainId,
  risk,
  positionBalance,
  apy30d,
  apyLive,
  mainVaultApyLive,
  isMainVault = false,
  selected = false,
  onClick,
}: {
  token: string
  positionBalance?: string
  apy30d?: number | null
  apyLive?: number | null
  mainVaultApyLive?: number | null
  risk?: RiskType
  chainId: NetworkIds
  isMainVault?: boolean
  selected?: boolean
  onClick?: () => void
}) => {
  const apySpread = mainVaultApyLive && apyLive ? apyLive - mainVaultApyLive : null
  const apySpreadColor =
    apySpread && apySpread > 0 ? 'var(--color-text-success)' : 'var(--color-text-warning)'

  return (
    <GradientBox withHover selected={selected} onClick={onClick}>
      <Card
        className={clsx(controlsSwitchStyles.cardWrapper, {
          [controlsSwitchStyles.nextVaultCard]: !isMainVault,
          [controlsSwitchStyles.nextVaultCardNotSelected]: !isMainVault && !selected,
        })}
      >
        <div className={controlsSwitchStyles.titleRow}>
          <div className={controlsSwitchStyles.title}>
            <VaultTitle symbol={token} titleVariant="h5" iconSize={32} networkId={chainId} />
            <Risk risk={risk ?? 'lower'} variant="p3semi" />
          </div>
          {!isMainVault && (
            <Icon iconName={selected ? 'checkmark_colorful_circle' : 'checkmark_circle'} />
          )}
        </div>
        <div className={controlsSwitchStyles.dataRow}>
          <div className={controlsSwitchStyles.dataRowColumn}>
            <VaultSwitchCardDataBlock title="Balance" value={positionBalance} />
            {!!apy30d && (
              <VaultSwitchCardDataBlock title="30d APY" value={formatDecimalAsPercent(apy30d)} />
            )}
          </div>
          <div className={controlsSwitchStyles.dataRowColumn}>
            {!!apyLive && (
              <VaultSwitchCardDataBlock title="Live APY" value={formatDecimalAsPercent(apyLive)} />
            )}
            {!!apySpread && (
              <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
                APY Spread:&nbsp;
                <Text as="span" variant="p4semi" style={{ color: apySpreadColor }}>
                  {apySpread > 0 ? '+' : ''}
                  {formatDecimalAsPercent(apySpread)}
                </Text>
              </Text>
            )}
          </div>
        </div>
      </Card>
    </GradientBox>
  )
}

const VaultSwitchTokenFilter = ({
  token,
  selected,
  onClick,
}: {
  token: TokenSymbolsList
  selected: boolean
  onClick: () => void
}) => {
  return (
    <Tooltip
      key={`PotentialVaultTokenList_${token}`}
      tooltip={<Text variant="p4">Filter&nbsp;by&nbsp;{getTokenDisplayName(token)}</Text>}
      tooltipCardVariant="cardSecondarySmallPaddings"
      showAbove
      tooltipWrapperStyles={{
        marginTop: '-30px',
      }}
    >
      <div
        className={clsx(controlsSwitchStyles.nextPositionIconFilterButton, {
          [controlsSwitchStyles.activeFilter]: selected,
        })}
        onClick={onClick}
      >
        <Icon tokenName={token} size={20} />
      </div>
    </Tooltip>
  )
}

export const ControlsSwitch = ({
  currentPosition,
  currentVault,
  potentialVaults,
  chainId,
  vaultsApyByNetworkMap,
  selectVault,
  selectedVault,
}: {
  currentPosition: IArmadaPosition
  currentVault: SDKVaultishType
  potentialVaults: SDKVaultsListType
  chainId: NetworkIds
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
  selectVault: Dispatch<SetStateAction<`${string}-${number}` | undefined>>
  selectedVault: string | undefined
}): ReactNode => {
  const [filterByToken, setFilterByToken] = useState<TokenSymbolsList | undefined>()
  const currentVaultApy = vaultsApyByNetworkMap[`${currentVault.id}-${chainId}`]

  const potentialVaultTokenList = useMemo(
    () => [
      ...new Set(potentialVaults.map((vault) => vault.inputToken.symbol) as TokenSymbolsList[]),
    ],
    [potentialVaults],
  )

  const filteredPotentialVaults = useMemo(() => {
    if (!filterByToken) return potentialVaults

    return potentialVaults.filter((vault) => vault.inputToken.symbol === filterByToken)
  }, [filterByToken, potentialVaults])

  return (
    <div>
      <div className={controlsSwitchStyles.positionAndVaultsListWrapper}>
        <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
          Your position
        </Text>
        <VaultSwitchCard
          token={currentPosition.amount.token.symbol}
          positionBalance={`${formatCryptoBalance(currentPosition.amount.amount)} ${
            currentPosition.amount.token.symbol
          }`}
          apyLive={currentVaultApy.apy}
          risk={currentVault.customFields?.risk ?? 'lower'}
          chainId={chainId}
          isMainVault
        />
        <div className={controlsSwitchStyles.arrowForward}>
          <Icon iconName="arrow_forward" color="#777576" size={14} />
        </div>
        <div className={controlsSwitchStyles.nextPositionInfo}>
          <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
            Switch to a new position
          </Text>
          <div className={controlsSwitchStyles.nextPositionIconsInfo}>
            {potentialVaultTokenList.map((token) => (
              <VaultSwitchTokenFilter
                key={token}
                token={token}
                selected={filterByToken === token}
                onClick={() => {
                  setFilterByToken((prev) => (prev === token ? undefined : token))
                  selectVault(undefined)
                }}
              />
            ))}
          </div>
        </div>
        {filteredPotentialVaults.map((vault) => (
          <VaultSwitchCard
            key={vault.id}
            token={vault.inputToken.symbol}
            risk={vault.customFields?.risk ?? 'lower'}
            apy30d={vaultsApyByNetworkMap[`${vault.id}-${chainId}`].sma30d}
            apyLive={vaultsApyByNetworkMap[`${vault.id}-${chainId}`].apy}
            mainVaultApyLive={currentVaultApy.apy}
            chainId={chainId}
            selected={selectedVault === `${vault.id}-${chainId}`}
            onClick={() => {
              selectVault(`${vault.id}-${chainId}`)
            }}
          />
        ))}
      </div>
    </div>
  )
}
