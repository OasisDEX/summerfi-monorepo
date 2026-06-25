'use client'

import { type FC, type ReactNode, useMemo } from 'react'
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
import { formatPercent, formatWithSeparators } from '@summerfi/app-utils'
import { RoundsVaultType } from '@summerfi/sdk-common'
import BigNumber from 'bignumber.js'

import { type RwaVaultRiskParameters } from '@/app/server-handlers/institution/institution-vaults'
import { EditTokenValueModal } from '@/components/molecules/EditValueModal/EditValueModal'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { marketRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/columns'
import { vaultRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/columns'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import { getRwaSetMinimumPositionSizeId } from '@/helpers/get-transaction-id'
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

const displayAmount = (value: string | null | undefined, symbol?: string | null): string =>
  value != null
    ? `${formatWithSeparators(Number(value), { precision: 2 })} ${symbol ?? ''}`.trim()
    : 'n/a'

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
  const { getRwaSetMinimumPositionSizeTx } = useAdminAppRwaSDK(clientId)
  const { addTransaction, removeTransaction, transactionQueue } = useSDKTransactionQueue()
  const { revalidateTags } = useRevalidateTags()

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain

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

  const vaultRows = vaultRiskParametersMapper({
    rawData: [
      {
        id: 'vault-cap',
        parameter: 'Vault Cap',
        value: displayAmount(riskParameters?.vaultCap, riskParameters?.inputTokenSymbol),
      },
      {
        id: 'deposit-limit',
        parameter: 'Deposit Limit',
        value: displayAmount(riskParameters?.depositLimit, riskParameters?.inputTokenSymbol),
      },
      {
        id: 'buffer',
        parameter: 'Buffer',
        value: displayAmount(
          riskParameters?.minimumBufferBalance,
          riskParameters?.inputTokenSymbol,
        ),
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
            <TableCellNodes>{displayAmount(ark.depositCap, ark.tokenSymbol)}</TableCellNodes>
          ),
          'max-percentage': (
            <TableCellNodes>
              {ark.maxDepositPercentage != null
                ? formatPercent(new BigNumber(ark.maxDepositPercentage), { precision: 2 })
                : 'n/a'}
            </TableCellNodes>
          ),
          // Implied cap isn't exposed by the RWA contracts/subgraph, so it's always n/a here.
          'implied-cap': <TableCellNodes>n/a</TableCellNodes>,
        },
      }
    })

  const onTxSuccess = () => {
    revalidateTags({
      tags: [
        `rwa-vault-risk-parameters-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${network.toLowerCase()}`,
        `institution-vault-${institutionName.toLowerCase()}`,
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
