import { type ChainId, type IChainInfo } from '@summerfi/sdk-common'

export abstract class ArmadaManagerShared {
  private readonly _clientId: string | undefined

  constructor(params: { clientId?: string }) {
    this._clientId = params.clientId
  }

  getClientIdOrUndefined(): string | undefined {
    return this._clientId
  }

  getClientIdOrThrow(): string {
    const clientId = this._clientId
    if (!clientId) {
      throw new Error('You must be using makeAdminSdk to access Admin functionality.')
    }
    return clientId
  }

  /**
   * @name assertSupportedChain
   * @description Throws unless `chainId` is present in `supportedChains`, with an error listing the
   *              supported chain ids. Matches the error wording used by the deployment provider.
   */
  protected assertSupportedChain(params: {
    chainId: ChainId
    supportedChains: IChainInfo[]
  }): void {
    const isSupported = params.supportedChains.some((c) => c.chainId === params.chainId)
    if (!isSupported) {
      throw new Error(
        `Chain ${params.chainId} is not supported. Supported chains: ${params.supportedChains
          .map((c) => c.chainId)
          .join(', ')}`,
      )
    }
  }
}
