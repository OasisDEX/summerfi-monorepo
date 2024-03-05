import type { ChainInfo, Maybe } from '@summerfi/sdk-common/common'
import {
  type Protocol,
  ProtocolName,
  type ProtocolParameters,
  type IPool,
  ProtocolsRegistry,
  type LendingPoolParameters,
} from '@summerfi/sdk-common/protocols'
import { mockPool } from '~sdk-client/mocks/mockPool'

export class mockProtocolSpark implements Protocol {
  public readonly name: ProtocolName
  private readonly chainInfo: ChainInfo

  public constructor(params: { chainInfo: ChainInfo }) {
    this.chainInfo = params.chainInfo
    this.name = ProtocolName.Spark
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getPool(params: {
    poolParameters: LendingPoolParameters
    protocolParameters?: ProtocolParameters
  }): Promise<Maybe<IPool>> {
    return mockPool({ protocol: this, poolParameters: params.poolParameters })
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  public async getAllPools(_params: { protocolParameters?: ProtocolParameters }): Promise<IPool[]> {
    return []
  }
}

export async function registerMockProtocols() {
  const chainInfo = { chainId: 1, name: 'Mainnet' }

  ProtocolsRegistry.registerProtocol({
    chainInfo: chainInfo,
    name: ProtocolName.Spark,
    protocol: new mockProtocolSpark({ chainInfo }),
  })
}
