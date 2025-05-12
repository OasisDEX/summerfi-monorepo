import {
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Button,
  Card,
  getDisplayToken,
  GradientBox,
  Icon,
  InputWithDropdown,
  SkeletonLine,
  Text,
} from '@summerfi/app-earn-ui'
import {
  type SDKChainId,
  type SDKVaultishType,
  type TokenSymbolsList,
  type TransactionWithStatus,
  type VaultApyData,
} from '@summerfi/app-types'
import {
  formatCryptoBalance,
  formatDecimalAsPercent,
  formatFiatBalance,
  formatPercent,
  subgraphNetworkToSDKId,
} from '@summerfi/app-utils'
import { TransactionType, type VaultSwitchTransactionInfo } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { capitalize } from 'lodash-es'

import { networkSDKChainIdIconMap } from '@/constants/network-id-to-icon'

import controlsSwitchTransactionViewStyles from './ControlsSwitchTransactionView.module.css'

const VaultBoxContent = ({
  title,
  tokenName,
  chainId,
  risk,
  apy,
  isLoading,
  amount,
}: {
  title: string
  tokenName: TokenSymbolsList
  chainId: SDKChainId
  risk: string
  apy?: number
  amount?: string
  isLoading?: boolean
}) => (
  <>
    <Text variant="p4semi" className={controlsSwitchTransactionViewStyles.vaultBoxFromTo}>
      {title}
    </Text>
    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
      <Icon tokenName={tokenName} size={44} />
      <div style={{ position: 'absolute', top: '-3px', left: '-3px' }} data-testid="vault-network">
        {networkSDKChainIdIconMap(chainId)}
      </div>
    </div>
    <Text variant="h5" style={{ color: 'var(--color-text-primary)' }}>
      {tokenName}
    </Text>
    <Text variant="p4semi" style={{ color: 'var(--color-text-secondary)' }}>
      {capitalize(risk)} Risk
    </Text>
    <div className={controlsSwitchTransactionViewStyles.divider} />
    {apy && (
      <Text variant="p4semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
        Live&nbsp;APY:&nbsp;{formatDecimalAsPercent(apy)}
      </Text>
    )}
    {isLoading && !amount ? (
      <SkeletonLine width={100} height={14} style={{ margin: '5px 0' }} />
    ) : (
      <Text variant="p2semi" style={{ color: 'var(--color-text-primary)' }}>
        {amount ? `${formatCryptoBalance(amount)} ${tokenName}` : 'n/a'}
      </Text>
    )}
  </>
)

const ChangeBox = ({
  title,
  change,
  style,
}: {
  title: string
  change: ReactNode
  style?: CSSProperties
}) => {
  return (
    <div className={controlsSwitchTransactionViewStyles.whatsChangingBox} style={style}>
      <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
        {title}
      </Text>
      <Text variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
        {change}
      </Text>
    </div>
  )
}

type ControlsSwitchTransactionViewProps = {
  currentVault: SDKVaultishType
  vaultsList: SDKVaultishType[]
  selectedSwitchVault: `${string}-${number}`
  vaultsApyByNetworkMap: {
    [key: `${string}-${number}`]: VaultApyData
  }
  transactions?: TransactionWithStatus[]
  isLoading?: boolean
  switchingAmount: string
  setSwitchingAmount: Dispatch<SetStateAction<string | undefined>>
  switchingAmountOnFocus: () => void
  switchingAmountOnBlur: () => void
  transactionFee?: string
  transactionFeeLoading: boolean
  resetToInitialAmount: () => void
  currentVaultNetValue: BigNumber
  setIsEditingSwitchAmount: Dispatch<SetStateAction<boolean>>
  isEditingSwitchAmount: boolean
}

export const ControlsSwitchTransactionView = ({
  currentVault,
  vaultsList,
  selectedSwitchVault,
  vaultsApyByNetworkMap,
  transactions,
  isLoading,
  switchingAmount,
  switchingAmountOnFocus,
  switchingAmountOnBlur,
  setSwitchingAmount,
  transactionFee,
  transactionFeeLoading,
  resetToInitialAmount,
  currentVaultNetValue,
  setIsEditingSwitchAmount,
  isEditingSwitchAmount,
}: ControlsSwitchTransactionViewProps) => {
  const [switchAmountTempValue, setSwitchAmountTempValue] = useState(switchingAmount)

  const vaultChainId = subgraphNetworkToSDKId(currentVault.protocol.network)

  const nextVault = useMemo(() => {
    const [nextVaultId] = selectedSwitchVault.split('-')

    return vaultsList.find((vault) => vault.id === nextVaultId) as SDKVaultishType
  }, [selectedSwitchVault, vaultsList])

  const vaultSwitchTransaction = useMemo(() => {
    return transactions?.find(
      (transaction) => transaction.type === TransactionType.VaultSwitch,
    ) as VaultSwitchTransactionInfo
  }, [transactions])

  const currentAmount = vaultSwitchTransaction.metadata.fromAmount.amount
  const currentToken = getDisplayToken(
    currentVault.inputToken.symbol.toUpperCase(),
  ) as TokenSymbolsList
  const currentApyObject = vaultsApyByNetworkMap[`${currentVault.id}-${vaultChainId}`]
  const currentLiveApy = currentApyObject.apy
  const current30dApy = currentApyObject.sma30d
  const currentTokenPrice = currentVault.inputTokenPriceUSD
  const currentYearlyEarnings =
    currentLiveApy && currentTokenPrice
      ? new BigNumber(currentAmount)
          .multipliedBy(currentLiveApy)
          .multipliedBy(currentTokenPrice)
          .toString()
      : false

  const nextAmount = vaultSwitchTransaction.metadata.toAmount?.amount
  const nextApyObject = vaultsApyByNetworkMap[`${nextVault.id}-${vaultChainId}`]
  const nextLiveApy = nextApyObject.apy
  const next30dApy = nextApyObject.sma30d
  const nextToken = getDisplayToken(nextVault.inputToken.symbol.toUpperCase()) as TokenSymbolsList
  const nextTokenPrice = nextVault.inputTokenPriceUSD
  const nextYearlyEarnings =
    nextLiveApy && nextAmount && nextTokenPrice
      ? new BigNumber(nextAmount).multipliedBy(nextLiveApy).multipliedBy(nextTokenPrice).toString()
      : false

  const tempSwitchingAmountInUsd = useMemo(() => {
    return new BigNumber(switchAmountTempValue).times(currentTokenPrice ?? 0).toString()
  }, [switchAmountTempValue, currentTokenPrice])

  const handleTempAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSwitchAmountTempValue(e.target.value)
  }

  const editSwitchingAmount = () => {
    setIsEditingSwitchAmount(true)
  }

  const saveNextSwitchingAmount = () => {
    setSwitchingAmount(switchAmountTempValue)
    setIsEditingSwitchAmount(false)
  }

  useEffect(() => {
    // on mount reset the switching amount to the current vault amount
    resetToInitialAmount()
    setSwitchAmountTempValue(currentVaultNetValue.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isEditingSwitchAmount) {
    const onlyTokenOption = {
      tokenSymbol: currentVault.inputToken.symbol as TokenSymbolsList,
      label: currentVault.inputToken.symbol,
      value: currentVault.inputToken.symbol,
    }

    return (
      <div className={controlsSwitchTransactionViewStyles.controlsSwitchTransactionView}>
        <InputWithDropdown
          value={switchAmountTempValue}
          placeholder="10,000.00"
          secondaryValue={tempSwitchingAmountInUsd}
          handleChange={handleTempAmountChange}
          onFocus={switchingAmountOnFocus}
          onBlur={switchingAmountOnBlur}
          selectAllOnFocus
          options={[]}
          dropdownValue={onlyTokenOption}
        />
        <div className={controlsSwitchTransactionViewStyles.manualSetAmountControls}>
          <Button
            variant="secondarySmall"
            onClick={() => {
              setSwitchAmountTempValue(new BigNumber(currentAmount).multipliedBy(0.25).toString())
            }}
          >
            25%
          </Button>
          <Button
            variant="secondarySmall"
            onClick={() => {
              setSwitchAmountTempValue(new BigNumber(currentAmount).multipliedBy(0.5).toString())
            }}
          >
            50%
          </Button>
          <Button
            variant="secondarySmall"
            onClick={() => {
              setSwitchAmountTempValue(new BigNumber(currentAmount).multipliedBy(0.75).toString())
            }}
          >
            75%
          </Button>
          <Button
            variant="secondarySmall"
            onClick={() => {
              setSwitchAmountTempValue(currentAmount)
            }}
          >
            Max
          </Button>
        </div>
        <Button variant="primaryLarge" onClick={saveNextSwitchingAmount}>
          Update
        </Button>
      </div>
    )
  }
  const { fromAmount, slippage, priceImpact, toAmount } = vaultSwitchTransaction.metadata

  const priceImpactPrice = priceImpact?.price?.value.toString()
  const priceImpactPercentage = priceImpact?.impact?.value.toString()

  return (
    <div className={controlsSwitchTransactionViewStyles.controlsSwitchTransactionView}>
      <div className={controlsSwitchTransactionViewStyles.vaultsWrapper}>
        <div
          className={clsx(
            controlsSwitchTransactionViewStyles.vaultBox,
            controlsSwitchTransactionViewStyles.vaultBoxCurrent,
          )}
          style={{
            width: '50%',
          }}
        >
          <VaultBoxContent
            title="From"
            chainId={vaultChainId}
            tokenName={currentToken}
            risk={capitalize(currentVault.customFields?.risk ?? 'Lower')}
            apy={currentLiveApy}
            amount={currentAmount}
            isLoading={isLoading}
          />
        </div>
        <div className={controlsSwitchTransactionViewStyles.arrowBox}>
          <Icon iconName="arrow_forward" size={20} />
        </div>
        <GradientBox selected style={{ cursor: 'initial', width: '50%' }}>
          <div className={clsx(controlsSwitchTransactionViewStyles.vaultBox)}>
            <VaultBoxContent
              title="To"
              chainId={vaultChainId}
              tokenName={nextToken}
              risk={capitalize(nextVault.customFields?.risk ?? 'Lower')}
              apy={nextLiveApy}
              amount={nextAmount}
              isLoading={isLoading}
            />
          </div>
        </GradientBox>
      </div>
      <GradientBox selected style={{ cursor: 'initial' }}>
        <div className={controlsSwitchTransactionViewStyles.totalSwitchingBox}>
          <div className={controlsSwitchTransactionViewStyles.totalSwitchingBoxTitleRow}>
            <Text variant="p3semi" style={{ color: 'var(--color-text-primary-disabled)' }}>
              Total Switching
            </Text>
            <Button
              variant="textPrimaryMedium"
              style={{ paddingTop: 0, paddingBottom: 0 }}
              onClick={editSwitchingAmount}
            >
              Edit
            </Button>
          </div>
          <Text variant="p1semi" style={{ color: 'var(--color-text-primary)' }}>
            {formatCryptoBalance(
              new BigNumber(switchingAmount).gt(0) ? switchingAmount : currentAmount,
            )}
            &nbsp;
            {currentToken}
          </Text>
        </div>
      </GradientBox>
      <Card variant="cardPrimaryMediumPaddings" style={{ flexDirection: 'column' }}>
        <Text
          variant="p2semi"
          style={{ color: 'var(--color-text-primary-disabled)', marginBottom: '4px' }}
        >
          What&apos;s changing
        </Text>
        <ChangeBox
          title="Deposit asset"
          change={
            <>
              {currentToken}&nbsp;→&nbsp;{nextToken}
            </>
          }
        />
        <ChangeBox
          title="Live APY"
          change={
            <>
              {formatDecimalAsPercent(currentLiveApy)}&nbsp;→&nbsp;
              {formatDecimalAsPercent(nextLiveApy)}
              &nbsp;
              <span style={{ color: 'var(--color-text-primary-disabled)' }}>(New Asset)</span>
            </>
          }
        />
        <ChangeBox
          title="30d APY"
          change={
            <>
              {current30dApy ? formatDecimalAsPercent(current30dApy) : 'n/a'}&nbsp;→&nbsp;
              {next30dApy ? formatDecimalAsPercent(next30dApy) : 'n/a'}
              &nbsp;
              <span style={{ color: 'var(--color-text-primary-disabled)' }}>(New Asset)</span>
            </>
          }
        />
        <ChangeBox
          title="1yr earning difference"
          change={
            <>
              {currentYearlyEarnings ? <>${formatCryptoBalance(currentYearlyEarnings)}</> : 'n/a'}
              &nbsp;→&nbsp;
              {nextYearlyEarnings ? <>${formatCryptoBalance(nextYearlyEarnings)}</> : 'n/a'}
            </>
          }
        />
      </Card>
      <Card variant="cardPrimaryMediumPaddings" style={{ flexDirection: 'column' }}>
        <ChangeBox
          title="Price impact"
          style={{
            marginTop: 0,
          }}
          change={
            <Text variant="p3semi" style={{ color: 'var(--color-text-secondary)' }}>
              {priceImpactPrice ? (
                <>
                  {formatCryptoBalance(priceImpactPrice)}&nbsp;{nextToken}/{currentToken}
                </>
              ) : (
                'n/a'
              )}
              &nbsp;
              {priceImpactPercentage ? (
                <Text
                  as="span"
                  variant="p3semi"
                  style={{
                    color: new BigNumber(priceImpactPercentage).gt(0.02)
                      ? 'var(--color-text-critical)'
                      : 'var(--color-text-primary)',
                  }}
                >
                  ({formatDecimalAsPercent(priceImpactPercentage)})
                </Text>
              ) : (
                'n/a'
              )}
            </Text>
          }
        />
        {toAmount && (
          <ChangeBox
            title="Swap"
            change={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
              >
                <Icon
                  tokenName={fromAmount.token.symbol.toUpperCase() as TokenSymbolsList}
                  size={20}
                />
                {formatCryptoBalance(fromAmount.amount)}&nbsp;{'->'}
                <Icon
                  tokenName={toAmount.token.symbol.toUpperCase() as TokenSymbolsList}
                  size={20}
                />
                {formatCryptoBalance(toAmount.amount)}
              </div>
            }
          />
        )}

        <ChangeBox title="Slippage" change={formatPercent(slippage.value, { precision: 2 })} />
        <ChangeBox
          title="Transaction fee"
          change={
            transactionFeeLoading ? (
              <SkeletonLine width={100} height={10} />
            ) : (
              <Text variant="p3semi" style={{ color: 'var(--color-text-primary)' }}>
                {transactionFee ? `$${formatFiatBalance(transactionFee)}` : 'n/a'}
              </Text>
            )
          }
        />
      </Card>
    </div>
  )
}
