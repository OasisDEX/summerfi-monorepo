export const getManagementFee = (tokenSymbol: string): number => {
  // check if it has USD in the symbol, if so return 1%, otherwise return 0.3%
  // EURC now also has 0.3% fee, same as ETH
  const isStablecoin = tokenSymbol.includes('USD')

  return isStablecoin ? 0.01 : 0.003
}
