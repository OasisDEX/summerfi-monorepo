import type { ChainInfo, Wallet, Position } from '@summerfi/sdk-common'
import { IPortfolioManager } from '../interfaces/IPortfolioManager'
import { IRPCClient } from '../interfaces/IRPCClient'
import { RPCMainClientType } from '../rpc/SDKMainClient'

export class PortfolioManager extends IRPCClient implements IPortfolioManager {
  constructor(params: { rpcClient: RPCMainClientType }) {
    super(params)
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositions(_params: {
    networks: ChainInfo[]
    wallet: Wallet
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
