export const getForkUrl = (rpcGatewayUrl: string, chainId: number) => {
  try {
    const forkConfig: Record<number, string> = JSON.parse(rpcGatewayUrl)
    const forkUrl = forkConfig[chainId]
    if (!forkUrl || typeof forkUrl !== 'string') {
      throw Error('Invalid Fork URL in SDK_FORK_CONFIG for chainId: ' + chainId)
    }

    return forkUrl as string
  } catch (e) {
    throw Error('Failed to parse SDK_FORK_CONFIG: ' + rpcGatewayUrl)
  }
}
