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
