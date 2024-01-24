import { Wallet } from '~sdk/common'
import { PortfolioManager } from '~sdk/portfolio'
import { ChainInfo } from '~sdk/chains'
import { Position } from '~sdk/users'

export class PortfolioManagerClientImpl implements PortfolioManager {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPositions(params: {
    networks: ChainInfo[]
    wallet: Wallet
  }): Promise<Position[]> {
    // TODO: Implement
    return [] as Position[]
  }
}
