'use client'

import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import {
  Button,
  Card,
  Dropdown,
  ERROR_TOAST_CONFIG,
  Input,
  Text,
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
import { getRwaGrantRoleId, getRwaRevokeRoleId } from '@/helpers/get-transaction-id'
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
  const { chain, isSettingChain } = useEarnProtocolChain()
  const { address: userWalletAddress } = useEarnProtocolWallet()
  const { getRwaGrantRoleTx, getRwaRevokeRoleTx, getAllRoles } = useAdminAppRwaSDK(clientId)
  const { addTransaction } = useTransactionQueue()

  const revalidateTags = useMemo(
    () => getInstitutionVaultCacheTags({ institutionName, vaultAddress, network }),
    [institutionName, vaultAddress, network],
  )

  const [selectedKind, setSelectedKind] = useState<RwaRole['kind']>('KEEPER')
  const [account, setAccount] = useState('')
  const [target, setTarget] = useState(vaultAddress)
  const [holders, setHolders] = useState<Role[] | null>(null)

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
    withRetry(() => getAllRoles({ chainId }))
      .then((res) => setHolders(res.roles))
      .catch(() => setHolders(null))
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

  return (
    <Card variant="cardSecondary" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <SwitchChainButton requiredChainId={chainId} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Text as="h5" variant="h5">
          Grant / revoke role
        </Text>
        <Card>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
              width: '100%',
              justifyContent: 'space-between',
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
            <div style={fieldStyle}>
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
              <div style={fieldStyle}>
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
            <div style={{ display: 'flex', gap: 12, marginBottom: '8px' }}>
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
        <Text variant="p4" style={{ color: 'var(--color-text-secondary)' }}>
          All active grants on this institution, grouped by role.
        </Text>
        <Card>
          {tableRows === null ? (
            <Text variant="p3" style={{ color: 'var(--color-text-secondary)' }}>
              Unable to load role grants.
            </Text>
          ) : tableRows.length === 0 ? (
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
                        <Text as="span" variant="p3" style={{ fontFamily: 'monospace' }}>
                          {isValidAddress(row.role.owner)
                            ? formatAddress(row.role.owner)
                            : row.role.owner}
                        </Text>
                      </td>
                      <td style={tdStyle}>
                        <Text
                          as="span"
                          variant="p3"
                          style={{
                            fontFamily: 'monospace',
                            color: hasTarget ? undefined : 'var(--color-text-secondary)',
                          }}
                        >
                          {hasTarget ? formatAddress(row.appliesTo as string) : '—'}
                        </Text>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      <Text as="h5" variant="h5">
        Transaction Queue
      </Text>
      <TransactionQueue onLocalTxSuccess={() => refreshHolders()} />
    </Card>
  )
}
