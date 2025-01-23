export const getForkUrl = (rpcGatewayUrl: string, chainId: number) => {
  try {
    const forkConfig: Record<number, string> = JSON.parse(rpcGatewayUrl)
    return forkConfig[chainId] as string | undefined
  } catch (e) {
    throw Error('Failed to parse SDK_FORK_CONFIG: ' + rpcGatewayUrl)
  }
}
