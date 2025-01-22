export const getForkUrl = (rpcGatewayUrl: string, chainId: number) => {
  try {
    const forkConfig: Record<number, string> = JSON.parse(rpcGatewayUrl)
    const forkUrl = forkConfig[chainId]
    if (forkUrl == null) {
      throw Error('No forkUrl for chainId: ' + chainId)
    }
    return forkUrl
  } catch (e) {
    throw Error('Failed to parse SDK_FORK_CONFIG: ' + rpcGatewayUrl)
  }
}
