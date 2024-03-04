import { Wallet, type Position, type ChainInfo } from '~sdk-common/common/implementation'
import type { IPortfolioManager } from '~sdk-common/client/interfaces/IPortfolioManager'

export class PortfolioManager implements IPortfolioManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositions(_params: {
    networks: ChainInfo[]
    wallet: Wallet
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
