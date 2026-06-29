'use client'

import { type FC, type ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  ERROR_TOAST_CONFIG,
  getArkNiceName,
  Table,
  TableCellNodes,
  TableCellText,
  Text,
  useEarnProtocolChain,
  useEarnProtocolWallet,
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
import { SwitchChainButton } from '@/components/molecules/SwitchChainButton/SwitchChainButton'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { marketRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/market-risk-parameters-table/columns'
import { vaultRiskParametersColumns } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/columns'
import { vaultRiskParametersMapper } from '@/features/panels/vaults/components/PanelRiskParameters/vault-risk-parameters-table/mapper'
import { getInstitutionVaultCacheTags } from '@/helpers/get-institution-vault-cache-tags'
import {
  getChangeArkDepositCapId,
  getChangeArkMaxDepositPercentageId,
  getChangeMinimumBufferBalanceId,
  getChangeVaultCapId,
  getRwaSetMinimumPositionSizeId,
  getRwaSetTransferabilityId,
} from '@/helpers/get-transaction-id'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { withRetry } from '@/helpers/with-retry'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'

import styles from '@/features/panels/vaults/components/PanelRiskParameters/PanelRiskParameters.module.css'

interface PanelRwaRiskParametersProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
  riskParameters: RwaVaultRiskParameters | null
  // Effective (implied) ark deposit caps, keyed by ark address — raw on-chain values read from the
  // FleetCommander's `getEffectiveArkDepositCap`, scaled by the ark's input-token decimals.
  arksImpliedCapsMap: { [x: string]: string | undefined }
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
  arksImpliedCapsMap,
}) => {
  const chainId = urlNetworkToChainId(network)
  // Cache tags are keyed by the SDK network name (e.g. `arbitrum_one`), not the URL slug
  // (`arbitrum`), so it must be derived from the chain id to bust the right cache entry.
  const sdkNetworkName = chainIdToSDKNetwork(chainId).toLowerCase()
  const revalidateTags = useMemo(
    () => [
      `rwa-vault-risk-parameters-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName}`,
      `institution-vault-arks-implied-caps-${vaultAddress.toLowerCase()}-${sdkNetworkName}`,
      `institution-vault-${institutionName.toLowerCase()}-${vaultAddress.toLowerCase()}-${sdkNetworkName}`,
    ],
    [institutionName, vaultAddress, sdkNetworkName],
  )
  // Cache tags for the share-transferability toggle — keyed the same way the (now-merged) Transfers
  // panel busted them, independent of the risk-parameter tags above.
  const transfersRevalidateTags = useMemo(
    () => getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    [institutionName, vaultAddress, network],
  )
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()
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
    getRwaIsFleetTransfersEnabled,
    getRwaSetFleetTransferabilityTx,
  } = useAdminAppRwaSDK(clientId)
  const { addTransaction } = useTransactionQueue()

  // The cap / buffer / ark-cap setters need a resolved `IToken`; resolve the vault input token once
  // and reuse it for all three (arks share the vault input token, as the standard panel assumes).
  const [vaultInputToken, setVaultInputToken] = useState<IToken>()
  const [transfersEnabled, setTransfersEnabled] = useState<boolean | null>(null)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain
  // The transferability toggle additionally requires a connected wallet (unlike the value-edit modals,
  // which gate on the wallet inside the modal flow).
  const transfersControlsDisabled = controlsDisabled || !userWalletAddress

  const refreshTransfersEnabled = useCallback(() => {
    withRetry(() => getRwaIsFleetTransfersEnabled({ fleetAddress, chainId }))
      .then(setTransfersEnabled)
      .catch(() => setTransfersEnabled(null))
  }, [getRwaIsFleetTransfersEnabled, fleetAddress, chainId])

  useEffect(() => {
    refreshTransfersEnabled()
  }, [refreshTransfersEnabled])

  const onToggleTransfers = useCallback(() => {
    // The contract method is a no-arg flip; the next state is the inverse of the current read.
    const willEnable = transfersEnabled === false

    try {
      addTransaction(
        {
          id: getRwaSetTransferabilityId({ address: fleetAddress, chainId }),
          txDescription: 'share transfers',
          txLabel: {
            label: willEnable ? 'Enable' : 'Disable',
            charge: willEnable ? 'positive' : 'negative',
          },
          chainId,
          vaultAddress,
          revalidateTags: transfersRevalidateTags,
        },
        getRwaSetFleetTransferabilityTx({ fleetAddress, chainId }),
      )
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add transaction to queue', error)
      toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
    }
  }, [
    addTransaction,
    chainId,
    fleetAddress,
    getRwaSetFleetTransferabilityTx,
    transfersRevalidateTags,
    transfersEnabled,
    vaultAddress,
  ])

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
          txDescription: `${vaultType === RoundsVaultType.Input ? 'deposit' : 'withdrawal'} minimum to ${minimumPositionSize}`,
          txLabel: { label: 'Set', charge: 'neutral' },
          chainId,
          vaultAddress,
          revalidateTags,
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
          txDescription: `vault cap from ${displayAmount(riskParameters?.vaultCap, vaultInputToken.symbol)} to ${displayAmount(cap, vaultInputToken.symbol)}`,
          txLabel: createTransactionLabel(cap, riskParameters?.vaultCap ?? '0'),
          chainId,
          vaultAddress,
          revalidateTags,
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
          txDescription: `minimum buffer balance from ${displayAmount(riskParameters?.minimumBufferBalance, vaultInputToken.symbol)} to ${displayAmount(minimumBufferBalance, vaultInputToken.symbol)}`,
          txLabel: createTransactionLabel(
            minimumBufferBalance,
            riskParameters?.minimumBufferBalance ?? '0',
          ),
          chainId,
          vaultAddress,
          revalidateTags,
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
          txDescription: `${marketName} ark deposit cap from ${displayAmount(ark.depositCap, ark.tokenSymbol)} to ${displayAmount(cap, vaultInputToken.symbol)}`,
          txLabel: createTransactionLabel(cap, ark.depositCap ?? '0'),
          chainId,
          vaultAddress,
          revalidateTags,
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
          txDescription: `${marketName} ark max deposit % of TVL from ${ark.maxDepositPercentage != null ? formatPercent(new BigNumber(ark.maxDepositPercentage), { precision: 4 }) : 'n/a'} to ${formatPercent(next, { precision: 4 })}`,
          txLabel: createTransactionLabel(
            maxDepositPercentage.toString(),
            currentMaxDepositPercentage.toString(),
          ),
          chainId,
          vaultAddress,
          revalidateTags,
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

      // Effective ark deposit cap from `getEffectiveArkDepositCap`, raw on-chain → normalize by the
      // ark's input-token decimals (same as the standard PanelRiskParameters).
      const rawImpliedCap = arksImpliedCapsMap[ark.id]
      const impliedCap =
        typeof rawImpliedCap === 'string'
          ? new BigNumber(rawImpliedCap).shiftedBy(-ark.decimals).toString()
          : null

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
          'implied-cap': (
            <TableCellNodes>{displayAmount(impliedCap, ark.tokenSymbol)}</TableCellNodes>
          ),
        },
      }
    })

  return (
    <Card variant="cardSecondary" className={styles.panelRiskParametersWrapper}>
      <SwitchChainButton requiredChainId={chainId} />
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Share-token transferability
        </Text>
        <Card style={{ display: 'flex', flexDirection: 'column' }}>
          <Text variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
            Controls whether holders can transfer the fleet share token.
          </Text>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Text variant="p2">
              Transfers are currently:&nbsp;
              <Text as="span" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
                {transfersEnabled === null ? 'unknown' : transfersEnabled ? 'ENABLED' : 'DISABLED'}
              </Text>
            </Text>
            <Button
              variant="secondarySmall"
              disabled={transfersControlsDisabled || transfersEnabled === null}
              onClick={onToggleTransfers}
            >
              {transfersEnabled ? 'Disable transfers' : 'Enable transfers'}
            </Button>
          </div>
        </Card>
      </div>

      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue onLocalTxSuccess={() => refreshTransfersEnabled()} />
    </Card>
  )
}
