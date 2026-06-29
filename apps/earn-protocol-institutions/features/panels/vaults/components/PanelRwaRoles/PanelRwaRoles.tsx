'use client'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  Dropdown,
  ERROR_TOAST_CONFIG,
  Input,
  SkeletonLine,
  Text,
  Tooltip,
  useEarnProtocolChain,
  useEarnProtocolWallet,
} from '@summerfi/app-earn-ui'
import { type NetworkNames } from '@summerfi/app-types'
import { formatAddress } from '@summerfi/app-utils'
import { type AddressValue, type Role, type RwaRole } from '@summerfi/sdk-common'

import { SwitchChainButton } from '@/components/molecules/SwitchChainButton/SwitchChainButton'
import { TransactionQueue } from '@/components/organisms/TransactionQueue/TransactionQueue'
import { useTransactionQueue } from '@/contexts/TransactionQueueContext/TransactionQueueContext'
import { getInstitutionVaultCacheTags } from '@/helpers/get-institution-vault-cache-tags'
import {
  getRwaGrantRoleId,
  getRwaGrantWhitelistId,
  getRwaRevokeRoleId,
  getRwaRevokeWhitelistId,
  getRwaSetWhitelistOpenId,
} from '@/helpers/get-transaction-id'
import { isValidAddress } from '@/helpers/is-valid-address'
import { urlNetworkToChainId } from '@/helpers/rwa'
import { buildContractRoleHashMap, resolveRwaRoleLabel } from '@/helpers/rwa-roles'
import { withRetry } from '@/helpers/with-retry'
import { useAdminAppRwaSDK } from '@/hooks/useAdminAppSDK'

// All 11 grantable roles. Global roles take only an account; contract-specific roles also target a
// contract (a Fleet for Keeper/Curator/Operator, an Ark for Commander).
const ROLE_KINDS: {
  kind: RwaRole['kind']
  label: string
  needsTarget: boolean
  targetLabel?: string
}[] = [
  { kind: 'GOVERNOR', label: 'Governor', needsTarget: false },
  { kind: 'SUPER_KEEPER', label: 'Super Keeper', needsTarget: false },
  { kind: 'GUARDIAN', label: 'Guardian', needsTarget: false },
  { kind: 'DECAY_CONTROLLER', label: 'Decay Controller', needsTarget: false },
  { kind: 'ADMIRALS_QUARTERS', label: 'Admirals Quarters', needsTarget: false },
  { kind: 'FOUNDATION', label: 'Foundation', needsTarget: false },
  { kind: 'WHITELIST_MANAGER', label: 'Whitelist Manager', needsTarget: false },
  { kind: 'KEEPER', label: 'Keeper (per fleet)', needsTarget: true, targetLabel: 'Fleet address' },
  {
    kind: 'CURATOR',
    label: 'Curator (per fleet)',
    needsTarget: true,
    targetLabel: 'Fleet address',
  },
  {
    kind: 'OPERATOR',
    label: 'Operator (per fleet)',
    needsTarget: true,
    targetLabel: 'Fleet address',
  },
  {
    kind: 'COMMANDER',
    label: 'Commander (per ark)',
    needsTarget: true,
    targetLabel: 'Ark address',
  },
]

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--color-text-secondary)',
  borderBottom: '1px solid var(--color-border-light)',
}

const tdStyle: React.CSSProperties = {
  padding: '8px 12px',
  verticalAlign: 'top',
}

const SCOPE_LABELS: { [scope in 'global' | 'contract' | 'unknown']: string } = {
  global: 'Institution',
  contract: 'Per-fleet',
  unknown: 'Unknown',
}

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--color-text-secondary)',
}

// A truncated, monospace address that copies its full value on click. Hovering reveals the full
// address plus a hint ("Click to copy" → "Copied!") via the shared Tooltip.
const CopyableAddress: FC<{ value: string; display: string }> = ({ value, display }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(() => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [value])

  return (
    <Tooltip
      tooltip={
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, whiteSpace: 'nowrap' }}>
          <Text as="span" variant="p4semi" style={{ fontFamily: 'monospace' }}>
            {value}
          </Text>
          <Text as="span" variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
            {copied ? 'Copied!' : 'Click to copy'}
          </Text>
        </div>
      }
      tooltipCardVariant="cardSecondarySmallPaddings"
      tooltipWrapperStyles={{ top: '20px' }}
    >
      <span onClick={onCopy} style={{ cursor: 'pointer' }}>
        <Text as="span" variant="p3" style={{ fontFamily: 'monospace' }}>
          {display}
        </Text>
      </span>
    </Tooltip>
  )
}

interface PanelRwaRolesProps {
  institutionName: string
  // RWA SDK clientId (the vault's `vaultInstitutionId`), not the institution name.
  clientId: string
  vaultAddress: string
  network: NetworkNames
  // Fleet ark addresses — candidate targets for reversing raw contract-role hashes (Commander roles
  // target arks, which the subgraph leaves as a zero `targetContract`).
  arks: string[]
}

export const PanelRwaRoles: FC<PanelRwaRolesProps> = ({
  institutionName,
  clientId,
  vaultAddress,
  network,
  arks,
}) => {
  const chainId = urlNetworkToChainId(network)
  const fleetAddress = vaultAddress.toLowerCase() as `0x${string}`
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const {
    getRwaGrantRoleTx,
    getRwaRevokeRoleTx,
    getAllRoles,
    getRwaSetWhitelistOpenTx,
    getRwaSetWhitelistedTx,
    getRwaIsWhitelistOpen,
    getRwaIsWhitelisted,
  } = useAdminAppRwaSDK(clientId)
  const { addTransaction } = useTransactionQueue()

  const revalidateTags = useMemo(
    () => getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    [institutionName, vaultAddress, network],
  )

  const [selectedKind, setSelectedKind] = useState<RwaRole['kind']>('KEEPER')
  const [account, setAccount] = useState('')
  const [target, setTarget] = useState(vaultAddress)
  const [holders, setHolders] = useState<Role[] | null>(null)
  const [rolesStatus, setRolesStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [whitelistOpen, setWhitelistOpen] = useState<boolean | null>(null)
  const [grantAddress, setGrantAddress] = useState('')
  const [revokeAddress, setRevokeAddress] = useState('')
  const [checkAddress, setCheckAddress] = useState('')
  const [checkResult, setCheckResult] = useState<string | null>(null)

  const isProperChain = useMemo(() => chain.id === chainId, [chain.id, chainId])
  const controlsDisabled = !isProperChain || isSettingChain || !userWalletAddress

  const roleDef = useMemo(
    () => ROLE_KINDS.find((r) => r.kind === selectedKind) ?? ROLE_KINDS[0],
    [selectedKind],
  )

  // Reverse-lookup for contract-specific role hashes the subgraph couldn't decode (raw bytes32 name +
  // zero targetContract). Candidate targets: the vault, its arks, and every address already in the
  // role set (owners + non-zero targets — e.g. operator accounts that hold contract roles).
  const contractRoleMap = useMemo(() => {
    const candidates: (string | null)[] = [vaultAddress, ...arks]

    holders?.forEach((role) => candidates.push(role.owner, role.targetContract))

    return buildContractRoleHashMap(candidates)
  }, [vaultAddress, arks, holders])

  // Flattened, role-sorted rows for the grants table. Grouping is implicit via the sort; the role
  // label, scope and count render only on the first row of each role block. Unknown roles sort last.
  const tableRows = useMemo(() => {
    if (!holders) return null

    return holders
      .map((role) => {
        const resolved = resolveRwaRoleLabel(role.name, role.targetContract, contractRoleMap)

        return {
          role,
          label: resolved.label,
          scope: resolved.scope,
          // Resolved target wins over the (often zero) subgraph `targetContract` for raw-hash roles.
          appliesTo: resolved.target ?? role.targetContract,
        }
      })
      .sort((a, b) => {
        const rank = (scope: 'global' | 'contract' | 'unknown') => (scope === 'unknown' ? 1 : 0)

        return (
          rank(a.scope) - rank(b.scope) ||
          a.label.localeCompare(b.label) ||
          a.role.owner.localeCompare(b.role.owner)
        )
      })
  }, [holders, contractRoleMap])

  const roleCounts = useMemo(() => {
    const counts = new Map<string, number>()

    tableRows?.forEach((row) => counts.set(row.label, (counts.get(row.label) ?? 0) + 1))

    return counts
  }, [tableRows])

  const refreshHolders = useCallback(() => {
    setRolesStatus('loading')
    withRetry(() => getAllRoles({ chainId }))
      .then((res) => {
        setHolders(res.roles)
        setRolesStatus('ready')
      })
      .catch(() => {
        setHolders(null)
        setRolesStatus('error')
      })
  }, [getAllRoles, chainId])

  useEffect(() => {
    refreshHolders()
  }, [refreshHolders])

  // Builds the RwaRole descriptor from the form, or null when inputs are invalid.
  const buildRole = useCallback((): RwaRole | null => {
    if (!roleDef.needsTarget) {
      return { kind: roleDef.kind } as RwaRole
    }
    if (!isValidAddress(target)) return null

    return { kind: roleDef.kind, target: target as AddressValue } as RwaRole
  }, [roleDef, target])

  const submit = useCallback(
    (action: 'grant' | 'revoke') => {
      const role = buildRole()

      if (!role || !isValidAddress(account)) return
      const roleTarget = 'target' in role ? role.target : undefined
      const id =
        action === 'grant'
          ? getRwaGrantRoleId({ chainId, role: role.kind, target: roleTarget, account })
          : getRwaRevokeRoleId({ chainId, role: role.kind, target: roleTarget, account })

      try {
        addTransaction(
          {
            id,
            txDescription: `${roleDef.label} ${formatAddress(account)}`,
            txLabel: {
              label: action === 'grant' ? 'Grant' : 'Revoke',
              charge: action === 'grant' ? 'positive' : 'negative',
            },
            chainId,
            vaultAddress,
            revalidateTags,
          },
          action === 'grant'
            ? getRwaGrantRoleTx({ chainId, role, account: account as AddressValue })
            : getRwaRevokeRoleTx({ chainId, role, account: account as AddressValue }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [
      buildRole,
      account,
      chainId,
      roleDef,
      addTransaction,
      getRwaGrantRoleTx,
      getRwaRevokeRoleTx,
      revalidateTags,
      vaultAddress,
    ],
  )

  // Whitelist open/closed reads through the backend proxy and is independent of the connected chain.
  const refreshWhitelistOpen = useCallback(() => {
    withRetry(() => getRwaIsWhitelistOpen({ fleetAddress, chainId }))
      .then(setWhitelistOpen)
      .catch(() => setWhitelistOpen(null))
  }, [getRwaIsWhitelistOpen, fleetAddress, chainId])

  useEffect(() => {
    refreshWhitelistOpen()
  }, [refreshWhitelistOpen])

  const onToggleWhitelistOpen = useCallback(() => {
    const nextOpen = !whitelistOpen

    try {
      addTransaction(
        {
          id: getRwaSetWhitelistOpenId({ address: fleetAddress, chainId, isOpen: nextOpen }),
          txDescription: 'whitelist',
          txLabel: {
            label: nextOpen ? 'Open' : 'Close',
            charge: nextOpen ? 'positive' : 'negative',
          },
          chainId,
          vaultAddress,
          revalidateTags,
        },
        getRwaSetWhitelistOpenTx({ fleetAddress, chainId, isOpen: nextOpen }),
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
    getRwaSetWhitelistOpenTx,
    revalidateTags,
    vaultAddress,
    whitelistOpen,
  ])

  const onSetWhitelisted = useCallback(
    ({ address, allowed }: { address: `0x${string}`; allowed: boolean }) => {
      const id = allowed
        ? getRwaGrantWhitelistId({ address, chainId })
        : getRwaRevokeWhitelistId({ address, chainId })

      try {
        addTransaction(
          {
            id,
            txDescription: `${allowed ? 'whitelist' : 'remove'} ${address}`,
            txLabel: {
              label: allowed ? 'Grant' : 'Revoke',
              charge: allowed ? 'positive' : 'negative',
            },
            chainId,
            vaultAddress,
            revalidateTags,
          },
          getRwaSetWhitelistedTx({ fleetAddress, chainId, accountAddress: address, allowed }),
        )
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to add transaction to queue', error)
        toast.error('Failed to add transaction to queue', ERROR_TOAST_CONFIG)
      }
    },
    [addTransaction, chainId, fleetAddress, getRwaSetWhitelistedTx, revalidateTags, vaultAddress],
  )

  const onCheckWhitelisted = useCallback(() => {
    if (!isValidAddress(checkAddress)) return
    setCheckResult('Checking…')
    getRwaIsWhitelisted({ fleetAddress, chainId, accountAddress: checkAddress as `0x${string}` })
      .then((allowed) =>
        setCheckResult(
          `${formatAddress(checkAddress)} is ${allowed ? 'whitelisted' : 'not whitelisted'}`,
        ),
      )
      .catch(() => setCheckResult('Failed to read whitelist status'))
  }, [checkAddress, chainId, fleetAddress, getRwaIsWhitelisted])

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SwitchChainButton requiredChainId={chainId} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Grant / revoke role
        </Text>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                width: '100%',
                alignItems: 'flex-end',
              }}
            >
              <div style={fieldStyle}>
                <Text as="span" variant="p4" style={labelStyle}>
                  Role
                </Text>
                <Dropdown
                  asPill
                  dropdownValue={{
                    content: <Text variant="p4semi">{selectedKind}</Text>,
                    value: selectedKind,
                  }}
                  dropdownChildrenStyle={{
                    padding: '13px 14px 12px',
                    width: '220px',
                  }}
                  onChange={(e) => setSelectedKind(e.value as RwaRole['kind'])}
                  options={ROLE_KINDS.map((r) => ({
                    value: r.kind,
                    content: r.label,
                  }))}
                >
                  <Text variant="p4semi">{selectedKind}</Text>
                </Dropdown>
              </div>
              <div style={{ ...fieldStyle, flex: 1 }}>
                <Text as="span" variant="p4" style={labelStyle}>
                  Account
                </Text>
                <Input
                  variant="withBorder"
                  placeholder="0x..."
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  wrapperStyles={{ width: '100%' }}
                  inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
                />
              </div>
              {roleDef.needsTarget ? (
                <div style={{ ...fieldStyle, flex: 1 }}>
                  <Text as="span" variant="p4" style={labelStyle}>
                    {roleDef.targetLabel ?? 'Target'}
                  </Text>
                  <Input
                    variant="withBorder"
                    placeholder="0x..."
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    wrapperStyles={{ width: '100%' }}
                    inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
                  />
                </div>
              ) : null}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button
                variant="primarySmall"
                disabled={controlsDisabled || buildRole() === null || !isValidAddress(account)}
                onClick={() => submit('grant')}
              >
                Grant
              </Button>
              <Button
                variant="secondarySmall"
                disabled={controlsDisabled || buildRole() === null || !isValidAddress(account)}
                onClick={() => submit('revoke')}
              >
                Revoke
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Active role grants
        </Text>
        <Card>
          {rolesStatus === 'loading' && tableRows === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonLine key={index} width="100%" height="20px" />
              ))}
            </div>
          ) : rolesStatus === 'error' ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Unable to load role grants.
            </Text>
          ) : !tableRows || tableRows.length === 0 ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              No active role grants found.
            </Text>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: '24%' }}>Role</th>
                  <th style={{ ...thStyle, width: '18%' }}>Scope</th>
                  <th style={{ ...thStyle, width: '29%' }}>Holder</th>
                  <th style={{ ...thStyle, width: '29%' }}>Applies to</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, index) => {
                  const previous = index > 0 ? tableRows[index - 1] : null
                  const isGroupStart = !previous || previous.label !== row.label
                  const hasTarget =
                    !!row.appliesTo &&
                    isValidAddress(row.appliesTo) &&
                    !/^0x0+$/u.test(row.appliesTo)

                  return (
                    <tr
                      key={row.role.id}
                      style={{
                        borderTop: isGroupStart ? '1px solid var(--color-border-light)' : undefined,
                      }}
                    >
                      <td style={tdStyle}>
                        {isGroupStart ? (
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                            <Text as="span" variant="p3semi">
                              {row.label}
                            </Text>
                            <Text
                              as="span"
                              variant="p4"
                              style={{ color: 'var(--color-text-secondary)' }}
                            >
                              {roleCounts.get(row.label)}
                            </Text>
                          </div>
                        ) : null}
                      </td>
                      <td style={tdStyle}>
                        {isGroupStart ? (
                          <Text
                            as="span"
                            variant="p4"
                            style={{ color: 'var(--color-text-secondary)' }}
                          >
                            {SCOPE_LABELS[row.scope]}
                          </Text>
                        ) : null}
                      </td>
                      <td style={tdStyle}>
                        {isValidAddress(row.role.owner) ? (
                          <CopyableAddress
                            value={row.role.owner}
                            display={formatAddress(row.role.owner)}
                          />
                        ) : (
                          <Text as="span" variant="p3" style={{ fontFamily: 'monospace' }}>
                            {row.role.owner}
                          </Text>
                        )}
                      </td>
                      <td style={tdStyle}>
                        {hasTarget ? (
                          <CopyableAddress
                            value={row.appliesTo as string}
                            display={formatAddress(row.appliesTo as string)}
                          />
                        ) : (
                          <Text
                            as="span"
                            variant="p3"
                            style={{
                              fontFamily: 'monospace',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            —
                          </Text>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Whitelist status
        </Text>
        <Card>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 16,
            }}
          >
            <Text variant="p2">
              Whitelist is currently:&nbsp;
              <Text as="span" variant="p2semi" style={{ color: 'var(--color-text-link)' }}>
                {whitelistOpen === null ? 'unknown' : whitelistOpen ? 'OPEN' : 'CLOSED'}
              </Text>
            </Text>
            <Button
              variant="secondarySmall"
              disabled={controlsDisabled || whitelistOpen === null}
              onClick={onToggleWhitelistOpen}
            >
              {whitelistOpen ? 'Close whitelist' : 'Open whitelist'}
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Add address to whitelist
        </Text>
        <Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              variant="withBorder"
              placeholder="0x..."
              value={grantAddress}
              onChange={(e) => setGrantAddress(e.target.value)}
              wrapperStyles={{ width: '405px' }}
              inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <Button
              variant="primaryLarge"
              disabled={controlsDisabled || !isValidAddress(grantAddress)}
              onClick={() => {
                onSetWhitelisted({ address: grantAddress as `0x${string}`, allowed: true })
                setGrantAddress('')
              }}
            >
              <Text variant="p4">Add</Text>
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Remove address from whitelist
        </Text>
        <Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              variant="withBorder"
              placeholder="0x..."
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
              wrapperStyles={{ width: '405px' }}
              inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
            />
            <Button
              variant="secondaryLarge"
              disabled={controlsDisabled || !isValidAddress(revokeAddress)}
              onClick={() => {
                onSetWhitelisted({ address: revokeAddress as `0x${string}`, allowed: false })
                setRevokeAddress('')
              }}
            >
              <Text variant="p4">Remove</Text>
            </Button>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Check address
        </Text>
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Input
                variant="withBorder"
                placeholder="0x..."
                value={checkAddress}
                onChange={(e) => {
                  setCheckAddress(e.target.value)
                  setCheckResult(null)
                }}
                wrapperStyles={{ width: '405px' }}
                inputWrapperStyles={{ fontFamily: 'monospace', fontSize: '14px' }}
              />
              <Button
                variant="secondaryLarge"
                disabled={!isValidAddress(checkAddress)}
                onClick={onCheckWhitelisted}
              >
                <Text variant="p4">Check</Text>
              </Button>
            </div>
            {checkResult ? (
              <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
                {checkResult}
              </Text>
            ) : null}
          </div>
        </Card>
      </div>

      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue
        onLocalTxSuccess={() => {
          refreshHolders()
          refreshWhitelistOpen()
        }}
      />
    </Card>
  )
}
