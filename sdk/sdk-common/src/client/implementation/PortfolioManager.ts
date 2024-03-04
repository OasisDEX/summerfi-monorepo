import type { IPortfolioManager } from '~sdk-common/client/interfaces/IPortfolioManager'
import type { ChainInfo } from '~sdk-common/common/implementation/ChainInfo'
import type { Position } from '~sdk-common/common/implementation/Position'
import type { Wallet } from '~sdk-common/common/implementation/Wallet'

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
