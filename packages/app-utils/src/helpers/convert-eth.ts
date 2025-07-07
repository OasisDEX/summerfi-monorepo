export const convertEthToWeth = (token: string): string => {
  return token === 'ETH' ? 'WETH' : token
}

export const convertWethToEth = (token: string): string => {
  return token === 'WETH' ? 'ETH' : token
}
