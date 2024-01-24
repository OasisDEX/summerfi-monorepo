import { Wallet } from '~sdk/common'
import { PortfolioManager } from '~sdk/managers'
import { ChainInfo } from '~sdk/chain'
import { Position } from '~sdk/user'

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
