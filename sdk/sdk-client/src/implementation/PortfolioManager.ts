import type { ChainInfo, Wallet, Position } from '@summerfi/sdk-common'
import { IPortfolioManager } from '../interfaces/IPortfolioManager'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

/**
 * Client-side implementation of {@link IPortfolioManager} that aggregates a wallet's positions
 * across the requested networks.
 */
export class PortfolioManager extends IRPCClient implements IPortfolioManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /**
   * Returns the wallet's positions across the requested networks.
   *
   * @returns A promise resolving to the wallet's positions across the given networks.
   * @remarks Not yet implemented — currently returns an empty array.
   */
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositions(_params: {
    networks: ChainInfo[]
    wallet: Wallet
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
