'use client'

import { type FC, type ReactNode, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Card,
  ERROR_TOAST_CONFIG,
  getArkNiceName,
  Table,
  TableCellNodes,
  TableCellText,
  Text,
  useEarnProtocolChain,
} from '@summerfi/app-earn-ui'
import { type NetworkNames, type SDKVaultishType } from '@summerfi/app-types'
import { chainIdToSDKNetwork, formatPercent, formatWithSeparators } from '@summerfi/app-utils'
import { type IToken, RoundsVaultType } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { type RwaVaultRiskParameters } from '@/app/server-handlers/institution/institution-vaults'
import {
  EditPercentageValueModal,
  EditTokenValueModal,
} from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { marketRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/columns'
import { vaultRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/columns'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import {
  getChangeArkDepositCapId,
  getChangeArkMaxDepositPercentageId,
  getChangeMinimumBufferBalanceId,
  getChangeVaultCapId,
  getRwaSetMinimumPositionSizeId,
} from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'
import { useRevalidateTags } from '@/hooks/useRevalidateTags'
import { useSDKTransactionQueue } from '@/hooks/useSDKTransactionQueue'

import styles from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters.module.css'

interface PanelRwaRiskParametersProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
  riskParameters: RwaVaultRiskParameters | null
}

type RwaArk = RwaVaultRiskParameters['arks'][number]

const displayAmount = (value: string | null | undefined, symbol?: string | null): string =>
  value != null
    ? `${formatWithSeparators(Number(value), { precision: 2 })} ${symbol ?? ''}`.trim()
    : 'n/a'

// Increase/Decrease label + positive/negative charge, matching the standard PanelRiskParameters.
const createTransactionLabel = (nextValue: string, currentValue: string) =>
  ({
    label: Number(nextValue) > Number(currentValue) ? 'Increase' : 'Decrease',
    charge: Number(nextValue) < Number(currentValue) ? 'negative' : 'positive',
  }) as const

export const PanelRwaRiskParameters: FC<PanelRwaRiskParametersProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
  riskParameters,
}) => {
  const chainId = urlNetworkToChainId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  // RWA vaults are FleetCommander contracts, so the generic fleet admin setters apply here exactly as
  // on standard vaults. `useAdminAppRwaSDK` returns the full managed surface (admin setters + RWA tx
  // builders), so caps/buffer/ark params are editable through the same insti-v2 SDK.
  const {
    getRwaSetMinimumPositionSizeTx,
    setFleetDepositCap,
    setMinimumBufferBalance,
    setArkDepositCap,
    setArkMaxDepositPercentageOfTVL,
    getTargetChainInfo,
    getTokenBySymbol,
  } = useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  // The cap / buffer / ark-cap setters need a resolved `IToken`; resolve the vault input token once
  // and reuse it for all three (arks share the vault input token, as the standard panel assumes).
  const [vaultInputToken, setVaultInputToken] = useState<IToken>()

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain

  const inputTokenSymbol = riskParameters?.inputTokenSymbol

  useEffect(() => {
    if (!inputTokenSymbol) {
      return
    }

    const resolveToken = async () => {
      try {
        const token = await getTokenBySymbol({ chainId, symbol: inputTokenSymbol })

        setVaultInputToken(token)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching RWA vault input token:', error)
      }
    }

    resolveToken()
  }, [getTokenBySymbol, chainId, inputTokenSymbol])

  const onSetMinimumPositionSize = (vaultType: RoundsVaultType, value: BigNumber) => {
    // `minimumPositionSize` is human-readable here — the SDK normalizes it to the rounds vault's
    // underlying-token decimals server-side.
    const minimumPositionSize = value.toString()

    try {
      addTransaction(
        {
          id: getRwaSetMinimumPositionSizeId({
            address: fleetAddress,
            chainId,
            vaultType,
            minimumPositionSize,
          }),
          txDescription: (
            <Text variant="p3">
              set {vaultType === RoundsVaultType.Input ? 'deposit' : 'withdrawal'} minimum to&nbsp;
              <Text as="span" variant="p4semi">
                {minimumPositionSize}
              </Text>
            </Text>
          ),
          txLabel: { label: 'Set', charge: 'neutral' },
        },
        getRwaSetMinimumPositionSizeTx({
          fleetAddress,
          chainId,
          vaultType,
          minimumPositionSize,
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const onSetFleetDepositCap = (next: BigNumber) => {
    if (!vaultInputToken) {
      return
    }

    const cap = next.toString()

    try {
      addTransaction(
        {
          id: getChangeVaultCapId({ address: fleetAddress, chainId, vaultCap: cap }),
          txDescription: (
            <Text variant="p3">
              vault&nbsp;cap&nbsp;from&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(riskParameters?.vaultCap, vaultInputToken.symbol)}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(cap, vaultInputToken.symbol)}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(cap, riskParameters?.vaultCap ?? '0'),
        },
        setFleetDepositCap({
          fleetAddress,
          chainInfo: getTargetChainInfo(chainId),
          cap,
          token: vaultInputToken,
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const onSetMinimumBufferBalance = (next: BigNumber) => {
    if (!vaultInputToken) {
      return
    }

    const minimumBufferBalance = next.toString()

    try {
      addTransaction(
        {
          id: getChangeMinimumBufferBalanceId({
            address: fleetAddress,
            chainId,
            minimumBufferBalance,
          }),
          txDescription: (
            <Text variant="p3">
              minimum&nbsp;buffer&nbsp;balance&nbsp;from&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(riskParameters?.minimumBufferBalance, vaultInputToken.symbol)}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(minimumBufferBalance, vaultInputToken.symbol)}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(
            minimumBufferBalance,
            riskParameters?.minimumBufferBalance ?? '0',
          ),
        },
        setMinimumBufferBalance({
          fleetAddress,
          chainInfo: getTargetChainInfo(chainId),
          minimumBufferBalance,
          token: vaultInputToken,
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const onSetArkDepositCap = (ark: RwaArk, marketName: string) => (next: BigNumber) => {
    if (!vaultInputToken) {
      return
    }

    const cap = next.toString()

    try {
      addTransaction(
        {
          id: getChangeArkDepositCapId({
            address: fleetAddress,
            chainId,
            arkDepositCap: cap,
            arkId: ark.id,
          }),
          txDescription: (
            <Text variant="p3">
              {marketName}&nbsp;ark&nbsp;deposit&nbsp;cap&nbsp;from&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(ark.depositCap, ark.tokenSymbol)}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi">
                {displayAmount(cap, vaultInputToken.symbol)}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(cap, ark.depositCap ?? '0'),
        },
        setArkDepositCap({
          arkAddress: ark.id,
          fleetAddress,
          chainInfo: getTargetChainInfo(chainId),
          cap,
          token: vaultInputToken,
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const onSetArkMaxDepositPercentage = (ark: RwaArk, marketName: string) => (next: BigNumber) => {
    // `maxDepositPercentage` (and the modal value) is a fraction (0.05 = 5%); the SDK's `Percentage`
    // expects percent units, so multiply by 100 — same conversion the standard panel applies.
    const maxDepositPercentage = next.times(100)
    const currentMaxDepositPercentage = new BigNumber(ark.maxDepositPercentage ?? 0).times(100)

    try {
      addTransaction(
        {
          id: getChangeArkMaxDepositPercentageId({
            address: fleetAddress,
            chainId,
            arkMaxDepositPercentage: maxDepositPercentage.toString(),
            arkId: ark.id,
          }),
          txDescription: (
            <Text variant="p3">
              {marketName}&nbsp;ark&nbsp;max&nbsp;deposit&nbsp;%&nbsp;of&nbsp;TVL&nbsp;from&nbsp;
              <Text as="span" variant="p4semi">
                {ark.maxDepositPercentage != null
                  ? formatPercent(new BigNumber(ark.maxDepositPercentage), { precision: 4 })
                  : 'n/a'}
              </Text>
              &nbsp;to&nbsp;
              <Text as="span" variant="p4semi">
                {formatPercent(next, { precision: 4 })}
              </Text>
            </Text>
          ),
          txLabel: createTransactionLabel(
            maxDepositPercentage.toString(),
            currentMaxDepositPercentage.toString(),
          ),
        },
        setArkMaxDepositPercentageOfTVL({
          arkAddress: ark.id,
          fleetAddress,
          chainInfo: getTargetChainInfo(chainId),
          maxDepositPercentage: maxDepositPercentage.toNumber(),
        }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }

  const renderMinPositionEdit = ({
    vaultType,
    value,
    symbol,
    decimals,
    modalTitle,
    modalDescription,
  }: {
    vaultType: RoundsVaultType
    value: string | null
    symbol: string | null
    decimals: number | null
    modalTitle: string
    modalDescription: string
  }): ReactNode => {
    if (value == null || decimals == null) {
      return 'n/a'
    }

    return (
      <EditTokenValueModal
        buttonLabel={displayAmount(value, symbol)}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        editValue={{
          label: modalTitle,
          valueNormalized: value,
          decimals,
          symbol: symbol ?? '',
        }}
        onAddTransaction={(next) => onSetMinimumPositionSize(vaultType, next)}
        loading={controlsDisabled}
      />
    )
  }

  // Vault Cap / Buffer share the resolved vault input token. While the token is still resolving the
  // value is shown read-only; the editable modal appears once `vaultInputToken` is available.
  const renderVaultTokenEdit = ({
    value,
    editLabel,
    modalTitle,
    modalDescription,
    onAddTransaction,
  }: {
    value: string | null
    editLabel: string
    modalTitle: string
    modalDescription: string
    onAddTransaction: (next: BigNumber) => void
  }): ReactNode => {
    if (value == null) {
      return 'n/a'
    }

    if (!vaultInputToken) {
      return displayAmount(value, inputTokenSymbol)
    }

    return (
      <EditTokenValueModal
        buttonLabel={displayAmount(value, vaultInputToken.symbol)}
        modalTitle={modalTitle}
        modalDescription={modalDescription}
        editValue={{
          label: editLabel,
          valueNormalized: value,
          decimals: vaultInputToken.decimals,
          symbol: vaultInputToken.symbol,
        }}
        onAddTransaction={onAddTransaction}
        loading={controlsDisabled}
      />
    )
  }

  const vaultRows = vaultRiskParametersMapper({
    rawData: [
      {
        id: 'vault-cap',
        parameter: 'Vault Cap',
        value: renderVaultTokenEdit({
          value: riskParameters?.vaultCap ?? null,
          editLabel: 'Vault Cap',
          modalTitle: 'Edit Vault Cap',
          modalDescription: 'Edit the maximum amount that can be deposited into the vault.',
          onAddTransaction: onSetFleetDepositCap,
        }),
      },
      {
        id: 'deposit-limit',
        parameter: 'Deposit Limit',
        value: displayAmount(riskParameters?.depositLimit, riskParameters?.inputTokenSymbol),
      },
      {
        id: 'buffer',
        parameter: 'Buffer',
        value: renderVaultTokenEdit({
          value: riskParameters?.minimumBufferBalance ?? null,
          editLabel: 'Minimum Buffer Balance',
          modalTitle: 'Edit Minimum Buffer Balance',
          modalDescription: 'Edit the minimum buffer balance required in the vault.',
          onAddTransaction: onSetMinimumBufferBalance,
        }),
      },
      {
        id: 'min-deposit',
        parameter: 'Minimum Deposit Size',
        value: renderMinPositionEdit({
          vaultType: RoundsVaultType.Input,
          value: riskParameters?.inputMinPositionSize ?? null,
          symbol: riskParameters?.inputMinPositionSymbol ?? null,
          decimals: riskParameters?.inputMinPositionDecimals ?? null,
          modalTitle: 'Edit Minimum Deposit Size',
          modalDescription: 'Edit the minimum amount a user can deposit into the vault per round.',
        }),
      },
      {
        id: 'min-withdrawal',
        parameter: 'Minimum Withdrawal Size',
        value: renderMinPositionEdit({
          vaultType: RoundsVaultType.Output,
          value: riskParameters?.outputMinPositionSize ?? null,
          symbol: riskParameters?.outputMinPositionSymbol ?? null,
          decimals: riskParameters?.outputMinPositionDecimals ?? null,
          modalTitle: 'Edit Minimum Withdrawal Size',
          modalDescription: 'Edit the minimum amount a user can withdraw from the vault per round.',
        }),
      },
    ],
  })

  const marketRows = (riskParameters?.arks ?? [])
    // Drop the technical BufferArk (and any nameless ark) — same exclusion the standard panel applies
    // via `getArkNiceName(ark) !== null`. The BufferArk carries a MAX_INT cap and isn't a real market.
    .filter((ark) => getArkNiceName({ name: ark.name } as SDKVaultishType['arks'][number]) !== null)
    .map((ark) => {
      const arkForName = { name: ark.name } as SDKVaultishType['arks'][number]
      // getArkNiceName can return `false` (deduped Morpho arks), so `||` is intentional here.
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      const marketName = getArkNiceName(arkForName) || 'Unknown Market'

      return {
        content: {
          market: <TableCellText>{marketName}</TableCellText>,
          'market-cap': (
            <TableCellNodes>
              {ark.depositCap != null && vaultInputToken ? (
                <EditTokenValueModal
                  buttonLabel={displayAmount(ark.depositCap, vaultInputToken.symbol)}
                  modalTitle={`Edit ${marketName} Ark Deposit Cap`}
                  modalDescription={`Edit the maximum amount that can be deposited into ${marketName} ark.`}
                  editValue={{
                    label: 'Ark Deposit Cap',
                    valueNormalized: ark.depositCap,
                    decimals: vaultInputToken.decimals,
                    symbol: vaultInputToken.symbol,
                  }}
                  onAddTransaction={onSetArkDepositCap(ark, marketName)}
                  loading={controlsDisabled}
                />
              ) : (
                displayAmount(ark.depositCap, ark.tokenSymbol)
              )}
            </TableCellNodes>
          ),
          'max-percentage': (
            <TableCellNodes>
              {ark.maxDepositPercentage != null ? (
                <EditPercentageValueModal
                  buttonLabel={formatPercent(new BigNumber(ark.maxDepositPercentage), {
                    precision: 2,
                  })}
                  modalTitle={`Edit ${marketName} Ark Max Deposit % of TVL`}
                  modalDescription={`Edit the maximum deposit percentage of TVL for ${marketName} ark.`}
                  editValue={{
                    label: 'Ark Max Deposit Percentage of TVL',
                    valueNormalized: ark.maxDepositPercentage,
                  }}
                  onAddTransaction={onSetArkMaxDepositPercentage(ark, marketName)}
                  loading={controlsDisabled}
                />
              ) : (
                'n/a'
              )}
            </TableCellNodes>
          ),
          // Implied cap isn't exposed by the RWA contracts/subgraph, so it's always n/a here.
          'implied-cap': <TableCellNodes>n/a</TableCellNodes>,
        },
      }
    })

  const onTxSuccess = () => {
    // Cache tags are keyed by the SDK network name (e.g. `arbitrum_one`), not the URL slug
    // (`arbitrum`) — derive it from the chain id so the right entry is busted on every network.
    const sdkNetworkName = chainIdToSDKNetwork(chainId).toLowerCase()

    revalidateTags({
      tags: [
        `rwa-vault-risk-parameters-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName}`,
        `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName}`,
      ],
    })
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
