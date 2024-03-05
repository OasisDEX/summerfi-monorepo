import type { ChainInfo, Wallet, Position } from '@summerfi/sdk-common/common'
import type { IPortfolioManager } from '~sdk-client/interfaces/IPortfolioManager'

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
