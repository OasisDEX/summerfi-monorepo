'use client'

import { useEffect, useMemo, useState } from 'react'
import { useChain } from '@account-kit/react'
import { Card, getArkNiceName, Table, Text } from '@summerfi/app-earn-ui'
import { type NetworkNames, type SDKVaultishType } from '@summerfi/app-types'
import {
  formatAddress,
  formatPercent,
  formatWithSeparators,
  networkNameToSDKId,
  ten,
} from '@summerfi/app-utils'
import { type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { revalidateActivityData } from '@/app/server-handlers/revalidation-handlers'
import {
  EditPercentageValueModal,
  EditTokenValueModal,
} from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { marketRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/mapper'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import {
  getChangeArkDepositCapId,
  getChangeArkMaxDepositPercentageId,
  getChangeMinimumBufferBalanceId,
  getChangeVaultCapId,
} from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'

import styles from './PanelRiskParameters.module.css'

const normalizeValue = (rawValue: string | bigint, decimals: number) =>
  new BigNumber(rawValue.toString()).shiftedBy(-decimals)

const denormalizeValue = (valueNormalized: BigNumber, decimals: number) =>
  valueNormalized.multipliedBy(ten.pow(decimals)).toFixed(0)

const createTransactionLabel = (nextValue: string, currentValue: string | bigint) =>
  ({
    label: Number(nextValue) > Number(currentValue) ? 'Increase' : 'Decrease',
    charge: Number(nextValue) < Number(currentValue) ? 'negative' : 'positive',
  }) as const

const mapArksToRiskParameters = ({
  vault,
  arksImpliedCapsMap,
  isLoading,
  handleArkDepositCapChange,
  handleArkMaxDepositPercentageOfTVLChange,
  disabled,
}: {
  vault: SDKVaultishType
  arksImpliedCapsMap: {
    [x: string]: string | undefined
  }
  isLoading: boolean
  handleArkDepositCapChange: (
    ark: SDKVaultishType['arks'][number],
  ) => (nextArkDepositCapNormalized: BigNumber) => void
  handleArkMaxDepositPercentageOfTVLChange: (
    ark: SDKVaultishType['arks'][number],
  ) => (nextArkMaxDepositPercentageNormalized: BigNumber) => void
  disabled?: boolean
}): MarketRiskParameters[] => {
  return vault.arks
    .filter((ark) => {
      return getArkNiceName(ark) !== null
    })
    .map((ark) => ({
      id: ark.id,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      market: <span title={ark.name ?? ark.id}>{getArkNiceName(ark) || 'Unknown Market'}</span>,
      marketCap: (
        <EditTokenValueModal
          buttonLabel={`${formatWithSeparators(
            new BigNumber(ark.depositCap).shiftedBy(-ark.inputToken.decimals).toNumber(),
          )} ${ark.inputToken.symbol}`}
          modalDescription={`Edit the maximum amount that can be deposited into ${getArkNiceName(ark)} ark.`}
          modalTitle={`Edit ${getArkNiceName(ark)} Ark Deposit Cap`}
          editValue={{
            label: 'Ark Deposit Cap',
            valueNormalized: new BigNumber(ark.depositCap)
              .shiftedBy(-ark.inputToken.decimals)
              .toNumber(),
            decimals: ark.inputToken.decimals,
            symbol: ark.inputToken.symbol,
          }}
          onAddTransaction={handleArkDepositCapChange(ark)}
          loading={isLoading || disabled}
        />
      ),
      token: ark.inputToken.symbol,
      maxPercentage: (
        <EditPercentageValueModal
          buttonLabel={formatPercent(
            normalizeValue(
              ark.maxDepositPercentageOfTVL,
              18, // 18 (wei) because it's stored as wei
            ),
            { precision: 2 },
          )}
          modalTitle={`Edit ${getArkNiceName(ark)} Ark Max Deposit % of TVL`}
          modalDescription={`Edit the maximum deposit percentage of TVL for ${getArkNiceName(ark)} ark.`}
          editValue={{
            label: 'Ark Max Deposit Percentage of TVL',
            valueNormalized: normalizeValue(
              ark.maxDepositPercentageOfTVL,
              18, // 18 (wei) because it's stored as wei
            ).toNumber(),
          }}
          onAddTransaction={handleArkMaxDepositPercentageOfTVLChange(ark)}
          loading={isLoading || disabled}
        />
      ),
      impliedCap:
        typeof arksImpliedCapsMap[ark.id] === 'string'
          ? new BigNumber(arksImpliedCapsMap[ark.id] as string)
              .shiftedBy(-ark.inputToken.decimals)
              .toNumber()
          : 0,
    }))
}

export const PanelRiskParameters = ({
  vault,
  arksImpliedCapsMap,
  network,
  institutionName,
}: {
  vault: SDKVaultishType
  arksImpliedCapsMap: {
    [x: string]: string | undefined
  }
  network: NetworkNames
  institutionName: string
}) => {
  const [vaultTokenSymbol, setVaultTokenSymbol] = useState<IToken>()
  const {
    setFleetDepositCap,
    setArkDepositCap,
    setMinimumBufferBalance,
    setArkMaxDepositPercentageOfTVL,
    getTargetChainInfo,
    getTokenBySymbol,
  } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const chainId = networkNameToSDKId(network)
  const { chain, isSettingChain } = useChain()

  const isProperChain = useMemo(() => {
    return chain.id === chainId
  }, [chain.id, chainId])

  const depositCapNormalized = normalizeValue(vault.depositCap, vault.inputToken.decimals)
  const minimumBufferBalanceNormalized = normalizeValue(
    vault.minimumBufferBalance,
    vault.inputToken.decimals,
  )

  const isLoading = !vaultTokenSymbol || isSettingChain

  const handleVaultCapChange = (nextDepositCapNormalized: BigNumber) => {
    const nextDepositCap = denormalizeValue(nextDepositCapNormalized, vault.inputToken.decimals)

    if (!vaultTokenSymbol) {
      throw new Error('Vault token symbol is not defined')
    }

    addTransaction(
      {
        id: getChangeVaultCapId({
          address: vault.id,
          chainId,
          vaultCap: nextDepositCap,
        }),
        txDescription: (
          <Text variant="p3">
            vault&nbsp;cap&nbsp;from&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {depositCapNormalized.toString()}
            </Text>
            &nbsp;to&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {nextDepositCapNormalized.toString()}
            </Text>
          </Text>
        ),
        txLabel: createTransactionLabel(nextDepositCap, vault.depositCap),
      },
      setFleetDepositCap({
        fleetAddress: vault.id,
        chainInfo: getTargetChainInfo(chainId),
        cap: nextDepositCapNormalized.toString(),
        token: vaultTokenSymbol,
      }),
    )
  }

  const handleMinimumBufferBalanceChange = (nextMinimumBufferBalanceNormalized: BigNumber) => {
    const minimumBufferBalance = denormalizeValue(
      nextMinimumBufferBalanceNormalized,
      vault.inputToken.decimals,
    )

    if (!vaultTokenSymbol) {
      throw new Error('Vault token symbol is not defined')
    }

    addTransaction(
      {
        id: getChangeMinimumBufferBalanceId({
          address: vault.id,
          chainId,
          minimumBufferBalance,
        }),
        txDescription: (
          <Text variant="p3">
            minimum&nbsp;buffer&nbsp;balance&nbsp;from&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {minimumBufferBalanceNormalized.toString()}&nbsp;{vault.inputToken.symbol}
            </Text>
            &nbsp;to&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {nextMinimumBufferBalanceNormalized.toString()}&nbsp;{vault.inputToken.symbol}
            </Text>
          </Text>
        ),
        txLabel: createTransactionLabel(minimumBufferBalance, vault.minimumBufferBalance),
      },
      setMinimumBufferBalance({
        fleetAddress: vault.id,
        chainInfo: getTargetChainInfo(chainId),
        minimumBufferBalance: nextMinimumBufferBalanceNormalized.toString(),
        token: vaultTokenSymbol,
      }),
    )
  }

  const handleArkMaxDepositPercentageOfTVLChange =
    (ark: SDKVaultishType['arks'][number]) =>
    (nextArkMaxDepositPercentageNormalized: BigNumber) => {
      const currentArkMaxDepositPercentageNormalized = normalizeValue(
        ark.maxDepositPercentageOfTVL,
        18, // 18 (wei) + 2 (percent formatting)
      )
      const nextArkMaxDepositPercentage = denormalizeValue(
        nextArkMaxDepositPercentageNormalized,
        18,
      )

      if (!vaultTokenSymbol) {
        throw new Error('Vault token symbol is not defined')
      }

      addTransaction(
        {
          id: getChangeArkMaxDepositPercentageId({
            address: vault.id,
            chainId,
            arkId: ark.id,
            arkMaxDepositPercentage: nextArkMaxDepositPercentage,
          }),
          txDescription: (
            <Text variant="p3">
              {getArkNiceName(ark) ?? formatAddress(ark.id)}
              &nbsp;ark&nbsp;max&nbsp;deposit&nbsp;%&nbsp;of&nbsp;TVL&nbsp;from&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {formatPercent(currentArkMaxDepositPercentageNormalized, { precision: 4 })}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {formatPercent(nextArkMaxDepositPercentageNormalized, { precision: 4 })}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(
            nextArkMaxDepositPercentage,
            ark.maxDepositPercentageOfTVL,
          ),
        },
        setArkMaxDepositPercentageOfTVL({
          fleetAddress: vault.id,
          chainInfo: getTargetChainInfo(chainId),
          maxDepositPercentage: nextArkMaxDepositPercentageNormalized.times(100).toNumber(), // iPercentage is in basis points
          arkAddress: ark.id,
        }),
      )
    }

  const handleArkDepositCapChange =
    (ark: SDKVaultishType['arks'][number]) => (nextArkDepositCapNormalized: BigNumber) => {
      const currentArkDepositCapNormalized = normalizeValue(
        ark.depositCap,
        vault.inputToken.decimals,
      )
      const nextArkDepositCap = denormalizeValue(
        nextArkDepositCapNormalized,
        vault.inputToken.decimals,
      )

      if (!vaultTokenSymbol) {
        throw new Error('Vault token symbol is not defined')
      }

      addTransaction(
        {
          id: getChangeArkDepositCapId({
            address: vault.id,
            chainId,
            arkDepositCap: nextArkDepositCap,
            arkId: ark.id,
          }),
          txDescription: (
            <Text variant="p3">
              {getArkNiceName(ark) ?? formatAddress(ark.id)}
              &nbsp;ark&nbsp;deposit&nbsp;cap&nbsp;from&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {currentArkDepositCapNormalized.toString()}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {nextArkDepositCapNormalized.toString()}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(nextArkDepositCap, ark.depositCap),
        },
        setArkDepositCap({
          fleetAddress: vault.id,
          chainInfo: getTargetChainInfo(chainId),
          cap: nextArkDepositCapNormalized.toString(),
          token: vaultTokenSymbol,
          arkAddress: ark.id,
        }),
      )
    }

  const marketRows = marketRiskParametersMapper({
    rawData: mapArksToRiskParameters({
      vault,
      arksImpliedCapsMap,
      isLoading,
      handleArkDepositCapChange,
      handleArkMaxDepositPercentageOfTVLChange,
      disabled: !isProperChain || isSettingChain,
    }),
  })

  const vaultRows = vaultRiskParametersMapper({
    rawData: [
      {
        id: '1',
        parameter: 'Vault Cap',
        value: (
          <EditTokenValueModal
            buttonLabel={`${formatWithSeparators(
              depositCapNormalized.toNumber(),
            )} ${vault.inputToken.symbol}`}
            modalDescription="Edit the maximum amount that can be deposited into the vault."
            modalTitle="Edit Vault Cap"
            editValue={{
              label: 'Vault Cap',
              valueNormalized: depositCapNormalized.toNumber(),
              decimals: vault.inputToken.decimals,
              symbol: vault.inputToken.symbol,
            }}
            onAddTransaction={handleVaultCapChange}
            loading={isLoading || !isProperChain || isSettingChain}
          />
        ),
      },
      {
        id: '2',
        parameter: 'Buffer',
        value: (
          <EditTokenValueModal
            buttonLabel={`${formatWithSeparators(
              minimumBufferBalanceNormalized.toNumber(),
            )} ${vault.inputToken.symbol}`}
            modalDescription="Edit the minimum buffer balance required in the vault."
            modalTitle="Edit Minimum Buffer Balance"
            editValue={{
              label: 'Minimum Buffer Balance',
              valueNormalized: minimumBufferBalanceNormalized.toNumber(),
              decimals: vault.inputToken.decimals,
              symbol: vault.inputToken.symbol,
            }}
            onAddTransaction={handleMinimumBufferBalanceChange}
            loading={isLoading || !isProperChain || isSettingChain}
          />
        ),
      },
    ],
  })

  useEffect(() => {
    const updateVaultTokenSymbol = async () => {
      try {
        const token = await getTokenBySymbol({
          chainId: networkNameToSDKId(network),
          symbol: vault.inputToken.symbol,
        })

        setVaultTokenSymbol(token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching vault token symbol:', error)
      }
    }

    updateVaultTokenSymbol()
  }, [getTokenBySymbol, network, vault.inputToken.symbol])

  const onTxSuccess = () => {
    revalidateActivityData(institutionName, vault.id, String(network))
  }

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Vault Risk Parameters
      </Text>
      <Card>
        <Table
          rows={vaultRows}
          columns={vaultRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Market Risk Parameters
      </Text>
      <Card>
        <Table
          rows={marketRows}
          columns={marketRiskParametersColumns}
          wrapperClassName={styles.tableWrapper}
          tableClassName={styles.table}
        />
      </Card>
      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        transactionQueue={transactionQueue}
        chainId={chainId}
        removeTransaction={removeTransaction}
        onTxSuccess={onTxSuccess}
      />
    </Card>
  )
}
