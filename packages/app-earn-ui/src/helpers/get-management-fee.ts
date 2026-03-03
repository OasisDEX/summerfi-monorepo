export const getManagementFee = (tokenSymbol: string): number => {
  // check if it has USD or EUR in the name
  const isStablecoin = tokenSymbol.includes('USD') || tokenSymbol.includes('EUR')

  return isStablecoin ? 0.01 : 0.003
}
