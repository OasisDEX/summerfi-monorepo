'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Card,
  getArkNiceName,
  Icon,
  Table,
  Text,
  useEarnProtocolChain,
} from '@summerfi/app-earn-ui'
import { type NetworkNames, type SDKVaultishType } from '@summerfi/app-types'
import {
  chainIdToSDKNetwork,
  formatAddress,
  formatPercent,
  formatWithSeparators,
  networkNameToSDKId,
  ten,
} from '@summerfi/app-utils'
import { type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/navigation'

import {
  EditPercentageValueModal,
  EditTokenValueModal,
} from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { marketRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/mapper'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import {
  getChangeArkDepositCapId,
  getChangeArkMaxDepositPercentageId,
  getChangeMinimumBufferBalanceId,
  getChangeVaultCapId,
} from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'

import styles from './PanelRiskParameters.module.css'

const normalizeValue = (rawValue: string | bigint, decimals: number) =>
  new BigNumber(rawValue.toString()).shiftedBy(-decimals)

const denormalizeValue = (valueNormalized: BigNumber, decimals: number) =>
  valueNormalized.multipliedBy(ten.pow(decimals)).toString()

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
            {
              precision: 2,
            },
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
  const { addTransaction } = useTransactionQueue()
  const chainId = networkNameToSDKId(network)
  const sdkNetworkName = chainIdToSDKNetwork(chainId)
  const { refresh: refreshView } = useRouter()
  const { chain, isSettingChain } = useEarnProtocolChain()

  const revalidateTags = useMemo(
    () => [
      `institution-vault-arks-implied-caps-${vault.id.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
      `vault-details-${institutionName.toLowerCase()}-${vault.id.toLowerCase()}-${sdkNetworkName.toLowerCase()}`,
    ],
    [vault.id, institutionName, sdkNetworkName],
  )

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
        txDescription: `vault cap from ${depositCapNormalized.toString()} to ${nextDepositCapNormalized.toString()}`,
        txLabel: createTransactionLabel(nextDepositCap, vault.depositCap),
        chainId,
        vaultAddress: vault.id,
        revalidateTags,
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
        txDescription: `minimum buffer balance from ${minimumBufferBalanceNormalized.toString()} ${vault.inputToken.symbol} to ${nextMinimumBufferBalanceNormalized.toString()} ${vault.inputToken.symbol}`,
        txLabel: createTransactionLabel(minimumBufferBalance, vault.minimumBufferBalance),
        chainId,
        vaultAddress: vault.id,
        revalidateTags,
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
          txDescription: `${getArkNiceName(ark) ?? formatAddress(ark.id)} ark max deposit % of TVL from ${formatPercent(currentArkMaxDepositPercentageNormalized, { precision: 4 })} to ${formatPercent(nextArkMaxDepositPercentageNormalized, { precision: 4 })}`,
          txLabel: createTransactionLabel(
            nextArkMaxDepositPercentage,
            ark.maxDepositPercentageOfTVL,
          ),
          chainId,
          vaultAddress: vault.id,
          revalidateTags,
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
          txDescription: `${getArkNiceName(ark) ?? formatAddress(ark.id)} ark deposit cap from ${currentArkDepositCapNormalized.toString()} to ${nextArkDepositCapNormalized.toString()}`,
          txLabel: createTransactionLabel(nextArkDepositCap, ark.depositCap),
          chainId,
          vaultAddress: vault.id,
          revalidateTags,
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
            buttonLabel={`${formatWithSeparators(depositCapNormalized.toNumber(), {
              precision: 2,
            })} ${vault.inputToken.symbol}`}
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
            buttonLabel={`${formatWithSeparators(minimumBufferBalanceNormalized.toNumber(), {
              precision: 2,
            })} ${vault.inputToken.symbol}`}
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

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <Text as="h5" variant="h5">
        Vault Risk Parameters
        <div onClick={refreshView} style={{ display: 'inline-block', cursor: 'pointer' }}>
          <Icon iconName="refresh" size={16} style={{ margin: '0 10px' }} />
        </div>
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
      <TransactionQueue />
    </Card>
  )
}
