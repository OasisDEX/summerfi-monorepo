export const getRevokeContractRoleTransactionId = ({
  address,
  role,
  chainId,
}: {
  address: string
  role: string
  chainId: number
}) => {
  return `revoke-role-${address}-${role}-${chainId}`
}

export const getGrantContractRoleTransactionId = ({
  address,
  role,
  chainId,
}: {
  address: string
  role: string
  chainId: number
}) => {
  return `grant-role-${address}-${role}-${chainId}`
}

export const getRevokeWhitelistId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `revoke-whitelist-${address}-${chainId}`
}

export const getGrantWhitelistId = ({ address, chainId }: { address: string; chainId: number }) => {
  return `grant-whitelist-${address}-${chainId}`
}

export const getRevokeAQWhitelistId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `revoke-aq-whitelist-${address}-${chainId}`
}

export const getGrantAQWhitelistId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `grant-aq-whitelist-${address}-${chainId}`
}

export const getChangeVaultCapId = ({
  address,
  chainId,
  vaultCap,
}: {
  address: string
  chainId: number
  vaultCap: string
}) => {
  return `change-vault-cap-${address}-${chainId}-${vaultCap}`
}

export const getChangeMinimumBufferBalanceId = ({
  address,
  chainId,
  minimumBufferBalance,
}: {
  address: string
  chainId: number
  minimumBufferBalance: string
}) => {
  return `change-minimum-buffer-balance-${address}-${chainId}-${minimumBufferBalance}`
}

export const getChangeArkDepositCapId = ({
  address,
  chainId,
  arkDepositCap,
  arkId,
}: {
  address: string
  chainId: number
  arkDepositCap: string
  arkId: string
}) => {
  return `change-ark-deposit-cap-${address}-${chainId}-${arkDepositCap}-${arkId}`
}

export const getChangeArkMaxDepositPercentageId = ({
  address,
  chainId,
  arkMaxDepositPercentage,
  arkId,
}: {
  address: string
  chainId: number
  arkMaxDepositPercentage: string
  arkId: string
}) => {
  return `change-ark-max-deposit-percentage-${address}-${chainId}-${arkMaxDepositPercentage}-${arkId}`
}

export const getDepositId = ({
  address,
  chainId,
  depositAmount,
}: {
  address: string
  chainId: number
  depositAmount: number
}) => {
  return `deposit-${address}-${chainId}-${depositAmount}`
}

export const getWithdrawId = ({
  address,
  chainId,
  withdrawAmount,
}: {
  address: string
  chainId: number
  withdrawAmount: number
}) => {
  return `withdraw-${address}-${chainId}-${withdrawAmount}`
}

// region RWA

export const getRwaSetWhitelistOpenId = ({
  address,
  chainId,
  isOpen,
}: {
  address: string
  chainId: number
  isOpen: boolean
}) => {
  return `rwa-set-whitelist-open-${address}-${chainId}-${isOpen}`
}

export const getRwaGrantWhitelistId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `rwa-grant-whitelist-${address}-${chainId}`
}

export const getRwaRevokeWhitelistId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `rwa-revoke-whitelist-${address}-${chainId}`
}

export const getRwaSetMinimumPositionSizeId = ({
  address,
  chainId,
  vaultType,
  minimumPositionSize,
}: {
  address: string
  chainId: number
  vaultType: string
  minimumPositionSize: string
}) => {
  return `rwa-set-minimum-position-size-${address}-${chainId}-${vaultType}-${minimumPositionSize}`
}

export const getRwaNextRoundId = ({
  address,
  chainId,
  vaultType,
}: {
  address: string
  chainId: number
  vaultType: string
}) => {
  return `rwa-next-round-${address}-${chainId}-${vaultType}`
}

export const getRwaSetRoundSettledId = ({
  address,
  chainId,
  vaultType,
  roundId,
}: {
  address: string
  chainId: number
  vaultType: string
  roundId: string
}) => {
  return `rwa-set-round-settled-${address}-${chainId}-${vaultType}-${roundId}`
}

export const getRwaRetryRoundId = ({
  address,
  chainId,
  vaultType,
  roundId,
}: {
  address: string
  chainId: number
  vaultType: string
  roundId: string
}) => {
  return `rwa-retry-round-${address}-${chainId}-${vaultType}-${roundId}`
}

export const getRwaEmergencyRollbackRoundId = ({
  address,
  chainId,
  vaultType,
  roundId,
}: {
  address: string
  chainId: number
  vaultType: string
  roundId: string
}) => {
  return `rwa-emergency-rollback-round-${address}-${chainId}-${vaultType}-${roundId}`
}

export const getRwaGrantRoleId = ({
  chainId,
  role,
  target,
  account,
}: {
  chainId: number
  role: string
  target?: string
  account: string
}) => {
  return `rwa-grant-role-${role}-${target ?? 'global'}-${account}-${chainId}`
}

export const getRwaRevokeRoleId = ({
  chainId,
  role,
  target,
  account,
}: {
  chainId: number
  role: string
  target?: string
  account: string
}) => {
  return `rwa-revoke-role-${role}-${target ?? 'global'}-${account}-${chainId}`
}

export const getRwaSetTransferabilityId = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  return `rwa-set-transferability-${address}-${chainId}`
}

// endregion
