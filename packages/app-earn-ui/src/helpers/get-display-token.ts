export const getDisplayToken = (tokenSymbol: string) => {
  return tokenSymbol === 'WETH' ? 'ETH' : tokenSymbol
}
