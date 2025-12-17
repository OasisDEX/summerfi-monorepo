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
  vaultCap,
}: {
  address: string
  chainId: number
  vaultCap: string
}) => {
  return `change-minimum-buffer-balance-${address}-${chainId}-${vaultCap}`
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
