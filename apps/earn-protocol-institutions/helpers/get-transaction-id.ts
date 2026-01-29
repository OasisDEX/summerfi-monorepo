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
