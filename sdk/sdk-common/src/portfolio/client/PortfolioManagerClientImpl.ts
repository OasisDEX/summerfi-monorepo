import { Wallet } from '~sdk-common/common'
import { PortfolioManager } from '~sdk-common/portfolio'
import { ChainInfo } from '~sdk-common/chains'
import { Position } from '~sdk-common/users'

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
