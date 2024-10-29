'use client'

import { type ChangeEvent, useCallback, useMemo, useState } from 'react'
import { useAuthModal, useChain, useUser } from '@account-kit/react'
import {
  Expander,
  InputWithDropdown,
  ProjectedEarnings,
  Sidebar,
  SidebarFootnote,
  sidebarFootnote,
  subgraphNetworkToSDKId,
  Text,
  VaultGridPreview,
} from '@summerfi/app-earn-ui'
import {
  type DropdownOption,
  type SDKVaultishType,
  type SDKVaultsListType,
  type TokenSymbolsList,
} from '@summerfi/app-types'
import { formatCryptoBalance, mapNumericInput } from '@summerfi/app-utils'
import {
  Address,
  ChainInfo,
  SDKContextProvider,
  type TransactionInfo,
} from '@summerfi/sdk-client-react'
import BigNumber from 'bignumber.js'
import { capitalize } from 'lodash-es'

import { SDKChainIdToAAChainMap } from '@/account-kit/config'
import {
  detailsLinks,
  userActivityRawData,
  vaultExposureRawData,
} from '@/components/layout/VaultOpenView/mocks'
import { VaultOpenHeaderBlock } from '@/components/layout/VaultOpenView/VaultOpenHeaderBlock'
import { VaultSimulationGraph } from '@/components/layout/VaultOpenView/VaultSimulationGraph'
import { MockedLineChart } from '@/components/organisms/Charts/MockedLineChart'
import { RebalancingActivity } from '@/components/organisms/RebalancingActivity/RebalancingActivity'
import { UserActivity } from '@/components/organisms/UserActivity/UserActivity'
import { VaultExposure } from '@/components/organisms/VaultExposure/VaultExposure'
import { sdkApiUrl } from '@/constants/sdk'
import { rebalancingActivityRawData } from '@/features/rebalance-activity/table/dummyData'
import { useAppSDK } from '@/hooks/use-app-sdk'

import vaultOpenViewStyles from './VaultOpenView.module.scss'

enum Action {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

type ViewStates = 'idle' | 'loadingTx' | 'txPrepared' | 'txInProgress' | 'txError' | 'txSuccess'

type TxTypes = 'approve' | 'deposit'

type TransactionInfoLabeled = TransactionInfo & {
  label: TxTypes
}

const labelTransactions = (transactions: TransactionInfo[]) => {
  return transactions.map((tx) => ({
    ...tx,
    // kinda hacky, but works for now
    label: tx.description.split(' ')[0].toLowerCase() as TransactionInfoLabeled['label'],
  }))
}

export const VaultOpenViewComponent = ({
  vault,
  vaults,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
}) => {
  const [txStatus, setTxStatus] = useState<ViewStates>('idle')
  const [tx, setTx] = useState<TransactionInfoLabeled[]>()
  const [amount, setAmount] = useState<BigNumber>()
  const [error, setError] = useState<string>()
  const { getDepositTX } = useAppSDK()
  const user = useUser()
  const { openAuthModal, isOpen: isAuthModalOpen } = useAuthModal()
  const { chain: connectedChain, setChain, isSettingChain } = useChain()

  const userChainId = connectedChain.id
  const vaultChainId = subgraphNetworkToSDKId(vault.protocol.network)

  const options: DropdownOption[] = [
    ...[...new Set(vaults.map(({ inputToken }) => inputToken.symbol))].map((symbol) => ({
      tokenSymbol: symbol as TokenSymbolsList,
      label: symbol,
      value: symbol,
    })),
  ]

  const handleAmountChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (!ev.target.value) {
      setAmount(undefined)

      return
    }
    setAmount(new BigNumber(ev.target.value.replaceAll(',', '').trim()))
  }

  const amountDisplayValue = useMemo(() => {
    if (!amount) {
      return ''
    }

    return mapNumericInput(amount.toString())
  }, [amount])

  const dropdownValue =
    options.find((option) => option.value === vault.inputToken.symbol) ?? options[0]

  const balance = new BigNumber(123123)

  const nextTransaction = useMemo(() => {
    if (!tx || tx.length === 0) {
      return undefined
    }

    return tx[0]
  }, [tx])

  const executeNextTransaction = useCallback(async () => {
    // promise settimeout for 1000ms to simulate the transaction
    setTxStatus('txInProgress')

    return await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
        setTxStatus('txSuccess')
        setTx(tx?.slice(1))

        return null
      }, 1000)
    })
  }, [tx])

  const getDepositTransactions = useCallback(async () => {
    if (amount && user) {
      setTxStatus('loadingTx')
      try {
        const transactionsList = await getDepositTX({
          walletAddress: Address.createFromEthereum({
            value: user.address,
          }),
          amount: amount.toString(),
          fleetAddress: vault.id,
          chainInfo: ChainInfo.createFrom({
            name: vault.protocol.network,
            chainId: vaultChainId,
          }),
        })

        if (transactionsList.length === 0) {
          throw new Error('Error getting the transactions list')
        }
        setTx(labelTransactions(transactionsList))
        setTxStatus('txPrepared')
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Error getting the transaction')
        }
      }
    }
  }, [amount, vaultChainId, getDepositTX, user, vault.id, vault.protocol.network])

  const primaryButton = useMemo(() => {
    // missing data
    if (!user) {
      return {
        label: 'Log in',
        action: openAuthModal,
        disabled: isAuthModalOpen,
        loading: isAuthModalOpen,
      }
    }
    if (userChainId !== vaultChainId || isSettingChain) {
      return {
        label: `Change network to ${vaultChainId}`,
        action: () => {
          setChain({
            chain: SDKChainIdToAAChainMap[vaultChainId],
          })
        },
        disabled: isSettingChain,
        loading: isSettingChain,
      }
    }
    if (!amount || amount.isZero()) {
      return {
        label: 'Deposit',
        action: () => null,
        disabled: true,
      }
    }

    // based on the txStatus
    if (['loadingTx', 'txInProgress'].includes(txStatus)) {
      return {
        label: 'Loading...',
        action: () => null,
        disabled: true,
        loading: true,
      }
    }

    // transactions loaded from the SDK
    // execute them one by one
    if (nextTransaction?.label) {
      return {
        label: capitalize(nextTransaction.label),
        action: executeNextTransaction,
      }
    }

    // if there are no transactions, and the last one was successful
    if (txStatus === 'txSuccess') {
      return {
        label: 'Success :)',
        action: () => null,
        disabled: true,
      }
    }

    return {
      label: 'Deposit',
      action: getDepositTransactions,
    }
  }, [
    amount,
    nextTransaction,
    executeNextTransaction,
    getDepositTransactions,
    isAuthModalOpen,
    isSettingChain,
    openAuthModal,
    setChain,
    user,
    userChainId,
    vaultChainId,
    txStatus,
  ])

  const sidebarProps = {
    title: capitalize(Action.DEPOSIT),
    content: (
      <>
        <InputWithDropdown
          value={amountDisplayValue}
          secondaryValue={amountDisplayValue ? `$${amountDisplayValue}` : undefined}
          handleChange={handleAmountChange}
          options={options}
          dropdownValue={dropdownValue}
          heading={{
            label: 'Balance',
            value: `${formatCryptoBalance(balance)} ${vault.inputToken.symbol}`,
            // eslint-disable-next-line no-console
            action: () => console.log('clicked'),
          }}
        />
        <ProjectedEarnings earnings="1353" symbol={vault.inputToken.symbol as TokenSymbolsList} />
      </>
    ),

    primaryButton,
    footnote: (
      <SidebarFootnote
        title={sidebarFootnote.title}
        list={sidebarFootnote.list}
        tooltip={sidebarFootnote.tooltip}
      />
    ),
    error,
  }

  const displayGraph = !!amount && amount.gt(0)

  return (
    <VaultGridPreview
      vault={vault}
      vaults={vaults}
      displayGraph={displayGraph}
      simulationGraph={<VaultSimulationGraph vault={vault} amount={amount} />}
      detailsContent={
        <div className={vaultOpenViewStyles.leftContentWrapper}>
          <VaultOpenHeaderBlock detailsLinks={detailsLinks} vault={vault} />
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Historical yield
              </Text>
            }
            defaultExpanded
          >
            <MockedLineChart />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Vault exposure
              </Text>
            }
            defaultExpanded
          >
            <VaultExposure rawData={vaultExposureRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                Rebalancing activity
              </Text>
            }
            defaultExpanded
          >
            <RebalancingActivity rawData={rebalancingActivityRawData} />
          </Expander>
          <Expander
            title={
              <Text as="p" variant="p1semi">
                User activity
              </Text>
            }
            defaultExpanded
          >
            <UserActivity rawData={userActivityRawData} />
          </Expander>
        </div>
      }
      sidebarContent={<Sidebar {...sidebarProps} />}
    />
  )
}

export const VaultOpenView = ({
  vault,
  vaults,
}: {
  vault: SDKVaultishType
  vaults: SDKVaultsListType
}) => {
  return (
    <SDKContextProvider value={{ apiURL: sdkApiUrl }}>
      <VaultOpenViewComponent vault={vault} vaults={vaults} />
    </SDKContextProvider>
  )
}
