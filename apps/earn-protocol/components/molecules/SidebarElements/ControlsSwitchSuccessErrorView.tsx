import { useMemo } from 'react'
import {
  getDisplayToken,
  getPositionValues,
  GradientBox,
  Icon,
  Risk,
  SkeletonLine,
  Text,
} from '@summerfi/app-earn-ui'
import {
  type RiskType,
  type SDKVaultishType,
  type TokenSymbolsList,
  type TransactionWithStatus,
} from '@summerfi/app-types'
import { formatCryptoBalance, formatFiatBalance } from '@summerfi/app-utils'
import { TransactionType, type VaultSwitchTransactionInfo } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'
import { usePosition } from '@/hooks/use-position'

import controlsSwitchSuccessErrorViewStyles from './ControlsSwitchSuccessErrorView.module.scss'

const VaultBoxContents = ({
  fromToken,
  toToken,
  risk,
  chainId,
  currentNetValue,
  currentNetValueUsd,
  switchedAmount,
  isLoading,
}: {
  fromToken?: TokenSymbolsList
  toToken?: TokenSymbolsList
  risk: RiskType
  chainId: number
  currentNetValue?: BigNumber
  currentNetValueUsd?: BigNumber
  switchedAmount?: string
  isLoading: boolean
}) => {
  return (
    <>
      <div className={controlsSwitchSuccessErrorViewStyles.vaultBoxTitleRow}>
        <Text variant="p3semi" style={{ color: 'var(--color-text-primary-hover)' }}>
          {fromToken ? <>From:&nbsp;{fromToken}&nbsp;</> : ''}
          {toToken ? <>To:&nbsp;{toToken}&nbsp;</> : ''}
          <Risk risk={risk} as="span" />
        </Text>
        <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
          Change
        </Text>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Icon tokenName={(fromToken ?? toToken) as TokenSymbolsList} size={44} />
            <div
              style={{ position: 'absolute', top: '-3px', left: '-3px' }}
              data-testid="vault-network"
            >
              {networkSDKChainIdIconMap(chainId)}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '8px' }}>
            {isLoading || !currentNetValue ? (
              <SkeletonLine width={100} height={20} style={{ margin: '4px 0' }} />
            ) : (
              <Text variant="p1semi" style={{ color: 'var(--color-text-primary)' }}>
                {formatCryptoBalance(currentNetValue)}&nbsp;{fromToken ?? toToken}
              </Text>
            )}
            {isLoading || !currentNetValueUsd ? (
              <SkeletonLine width={100} height={18} style={{ margin: '2px 0' }} />
            ) : (
              <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
                ${formatFiatBalance(currentNetValueUsd)}
              </Text>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {isLoading || !switchedAmount ? (
            <SkeletonLine width={100} height={18} style={{ margin: '2px 0' }} />
          ) : (
            <Text
              variant="p3semi"
              style={{
                color: Number(switchedAmount) > 0 ? 'var(--color-text-success)' : undefined,
              }}
            >
              {Number(switchedAmount) > 0 ? '+' : ''}
              {formatCryptoBalance(switchedAmount)}&nbsp;{fromToken ?? toToken}
            </Text>
          )}
        </div>
      </div>
    </>
  )
}

type ControlsSwitchSuccessErrorViewProps = {
  currentVault: SDKVaultishType
  vaultsList: SDKVaultishType[]
  selectedSwitchVault: `${string}-${number}`
  transactions?: TransactionWithStatus[]
  chainId: number
}

export const ControlsSwitchSuccessErrorView = ({
  currentVault,
  vaultsList,
  selectedSwitchVault,
  transactions,
  chainId,
}: ControlsSwitchSuccessErrorViewProps) => {
  const nextVault = useMemo(() => {
    const [nextVaultId] = selectedSwitchVault.split('-')

    return vaultsList.find((vault) => vault.id === nextVaultId) as SDKVaultishType
  }, [selectedSwitchVault, vaultsList])

  const { position: currentPosition, isLoading: currentPositionLoading } = usePosition({
    vaultId: currentVault.id,
    chainId,
  })

  const { position: nextPosition, isLoading: nextPositionLoading } = usePosition({
    vaultId: nextVault.id,
    chainId,
  })

  const currentPositionValues = currentPosition
    ? getPositionValues({
        position: currentPosition,
        vault: currentVault,
      })
    : undefined

  const nextPositionValues = nextPosition
    ? getPositionValues({
        position: nextPosition,
        vault: nextVault,
      })
    : undefined

  const {
    metadata: { fromAmount, toAmount },
  } = useMemo(() => {
    return transactions?.find(
      (transaction) => transaction.type === TransactionType.VaultSwitch,
    ) as VaultSwitchTransactionInfo
  }, [transactions])

  const switchedAmount = fromAmount.amount
  const switchedToken = getDisplayToken(
    currentVault.inputToken.symbol.toUpperCase(),
  ) as TokenSymbolsList

  const nextAmount = toAmount?.amount
  const nextToken = getDisplayToken(nextVault.inputToken.symbol.toUpperCase()) as TokenSymbolsList

  return (
    <div className={controlsSwitchSuccessErrorViewStyles.controlsSwitchSuccessErrorView}>
      <div className={controlsSwitchSuccessErrorViewStyles.vaultsWrapper}>
        <div
          className={clsx(
            controlsSwitchSuccessErrorViewStyles.vaultBox,
            controlsSwitchSuccessErrorViewStyles.vaultBoxCurrent,
          )}
        >
          <VaultBoxContents
            fromToken={switchedToken}
            risk={(currentVault.customFields?.risk ?? 'lower') as RiskType}
            currentNetValue={currentPositionValues?.netValue}
            currentNetValueUsd={currentPositionValues?.netValueUSD}
            switchedAmount={new BigNumber(switchedAmount).negated().toString()}
            chainId={chainId}
            isLoading={currentPositionLoading}
          />
        </div>
        <div className={controlsSwitchSuccessErrorViewStyles.arrowBox}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
        <GradientBox selected style={{ cursor: 'initial' }}>
          <div className={clsx(controlsSwitchSuccessErrorViewStyles.vaultBox)}>
            <VaultBoxContents
              toToken={nextToken}
              risk={(nextVault.customFields?.risk ?? 'lower') as RiskType}
              currentNetValue={nextPositionValues?.netValue ?? new BigNumber(0)}
              currentNetValueUsd={nextPositionValues?.netValueUSD ?? new BigNumber(0)}
              switchedAmount={nextAmount}
              chainId={chainId}
              isLoading={nextPositionLoading}
            />
          </div>
        </GradientBox>
      </div>
    </div>
  )
}
