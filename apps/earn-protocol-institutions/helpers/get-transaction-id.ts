export const getRevokeContractRoleTransactionId = (address: string, role: string) => {
  return `revoke-role-${address}-${role}`
}

export const getGrantContractRoleTransactionId = (address: string, role: string) => {
  return `grant-role-${address}-${role}`
}
