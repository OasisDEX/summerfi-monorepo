'use client'

import { useEffect, useState } from 'react'
import { Card, getArkNiceName, Table, Text } from '@summerfi/app-earn-ui'
import { type NetworkNames, type SDKVaultishType } from '@summerfi/app-types'
import { formatAddress, formatWithSeparators, networkNameToSDKId } from '@summerfi/app-utils'
import { type IToken } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { EditTokenValueModal } from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { marketRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/mapper'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import {
  getChangeArkDepositCapId,
  getChangeMinimumBufferBalanceId,
  getChangeVaultCapId,
} from '@/helpers/get-transaction-id'
import { useAdminAppSDK } from '@/hooks/useAdminAppSDK'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import { marketRiskParametersColumns } from './market-risk-parameters-table/columns'
import { type MarketRiskParameters } from './market-risk-parameters-table/types'
import { vaultRiskParametersColumns } from './vault-risk-parameters-table/columns'

import styles from './PanelRiskParameters.module.css'

const mapArksToRiskParameters = ({
  vault,
  arksImpliedCapsMap,
  isLoading,
  handleArkDepositCapChange,
}: {
  vault: SDKVaultishType
  arksImpliedCapsMap: {
    [x: string]: string | undefined
  }
  isLoading: boolean
  handleArkDepositCapChange: (
    ark: SDKVaultishType['arks'][number],
  ) => (nextValueNormalized: BigNumber) => void
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
          loading={isLoading}
        />
      ),
      token: ark.inputToken.symbol,
      maxPercentage: new BigNumber(ark.maxDepositPercentageOfTVL.toString())
        .shiftedBy(
          -18 - 2, // -18 because its 'in wei' and then -2 because we want to use formatDecimalAsPercent
        )
        .toNumber(),
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
    getTargetChainInfo,
    getTokenBySymbol,
  } = useAdminAppSDK(institutionName)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const chainId = networkNameToSDKId(network)

  const depositCapNormalized = new BigNumber(vault.depositCap).shiftedBy(-vault.inputToken.decimals)
  const minimumBufferBalanceNormalized = new BigNumber(vault.minimumBufferBalance).shiftedBy(
    -vault.inputToken.decimals,
  )

  const isLoading = !vaultTokenSymbol

  const handleVaultCapChange = (nextValueNormalized: BigNumber) => {
    const nextValueRaw = nextValueNormalized
      .multipliedBy(new BigNumber(10).pow(vault.inputToken.decimals))
      .toFixed(0)

    if (!vaultTokenSymbol) {
      throw new Error('Vault token symbol is not defined')
    }

    addTransaction(
      {
        id: getChangeVaultCapId({
          address: vault.id,
          chainId,
          vaultCap: nextValueRaw,
        }),
        txDescription: (
          <Text variant="p3">
            vault&nbsp;cap&nbsp;from&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {depositCapNormalized.toString()}
            </Text>
            &nbsp;to&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {nextValueNormalized.toString()}
            </Text>
          </Text>
        ),
        txLabel: {
          label: Number(nextValueRaw) > Number(vault.depositCap) ? 'Increase' : 'Decrease',
          charge: Number(nextValueRaw) < Number(vault.depositCap) ? 'negative' : 'positive',
        },
      },
      setFleetDepositCap({
        fleetAddress: vault.id,
        chainInfo: getTargetChainInfo(chainId),
        cap: nextValueNormalized.toString(),
        token: vaultTokenSymbol,
      }),
    )
  }

  const handleMinimumBufferBalanceChange = (nextValueNormalized: BigNumber) => {
    const nextValueRaw = nextValueNormalized
      .multipliedBy(new BigNumber(10).pow(vault.inputToken.decimals))
      .toFixed(0)

    if (!vaultTokenSymbol) {
      throw new Error('Vault token symbol is not defined')
    }

    addTransaction(
      {
        id: getChangeMinimumBufferBalanceId({
          address: vault.id,
          chainId,
          vaultCap: nextValueRaw,
        }),
        txDescription: (
          <Text variant="p3">
            minimum&nbsp;buffer&nbsp;balance&nbsp;from&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {minimumBufferBalanceNormalized.toString()}
            </Text>
            &nbsp;to&nbsp;
            <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
              {nextValueNormalized.toString()}
            </Text>
          </Text>
        ),
        txLabel: {
          label:
            Number(nextValueRaw) > Number(vault.minimumBufferBalance) ? 'Increase' : 'Decrease',
          charge:
            Number(nextValueRaw) < Number(vault.minimumBufferBalance) ? 'negative' : 'positive',
        },
      },
      setMinimumBufferBalance({
        fleetAddress: vault.id,
        chainInfo: getTargetChainInfo(chainId),
        minimumBufferBalance: nextValueNormalized.toString(),
        token: vaultTokenSymbol,
      }),
    )
  }

  const handleArkDepositCapChange =
    (ark: SDKVaultishType['arks'][number]) => (nextValueNormalized: BigNumber) => {
      const arkDepositCapNormalized = new BigNumber(ark.depositCap).shiftedBy(
        -vault.inputToken.decimals,
      )
      const nextValueRaw = nextValueNormalized
        .multipliedBy(new BigNumber(10).pow(vault.inputToken.decimals))
        .toFixed(0)

      if (!vaultTokenSymbol) {
        throw new Error('Vault token symbol is not defined')
      }

      addTransaction(
        {
          id: getChangeArkDepositCapId({
            address: vault.id,
            chainId,
            vaultCap: nextValueRaw,
            arkId: ark.id,
          }),
          txDescription: (
            <Text variant="p3">
              {getArkNiceName(ark) ?? formatAddress(ark.id)}
              &nbsp;ark&nbsp;deposit&nbsp;cap&nbsp;from&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {arkDepositCapNormalized.toString()}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
                {nextValueNormalized.toString()}
              </Text>
            </Text>
          ),
          txLabel: {
            label: Number(nextValueRaw) > Number(ark.depositCap) ? 'Increase' : 'Decrease',
            charge: Number(nextValueRaw) < Number(ark.depositCap) ? 'negative' : 'positive',
          },
        },
        setArkDepositCap({
          fleetAddress: vault.id,
          chainInfo: getTargetChainInfo(chainId),
          cap: nextValueNormalized.toString(),
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
              valueNormalized: new BigNumber(vault.depositCap)
                .shiftedBy(-vault.inputToken.decimals)
                .toNumber(),
              decimals: vault.inputToken.decimals,
              symbol: vault.inputToken.symbol,
            }}
            onAddTransaction={handleVaultCapChange}
            loading={isLoading}
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
              valueNormalized: new BigNumber(vault.minimumBufferBalance)
                .shiftedBy(-vault.inputToken.decimals)
                .toNumber(),
              decimals: vault.inputToken.decimals,
              symbol: vault.inputToken.symbol,
            }}
            onAddTransaction={handleMinimumBufferBalanceChange}
            loading={isLoading}
          />
        ),
      },
    ],
  })

  useEffect(() => {
    const updateVaultTokenSymbol = async () => {
      const token = await getTokenBySymbol({
        chainId: networkNameToSDKId(network),
        symbol: vault.inputToken.symbol,
      })

      setVaultTokenSymbol(token)
    }

    updateVaultTokenSymbol()
  }, [getTokenBySymbol, network, vault.inputToken.symbol])

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
      />
    </Card>
  )
}
