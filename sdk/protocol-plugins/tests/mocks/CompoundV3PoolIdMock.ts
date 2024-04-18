import { ChainInfo, TokenSymbol } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export const compoundV3PoolIdMock = {
  protocol: {
    name: ProtocolName.CompoundV3,
    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
  },
  collaterals: [TokenSymbol.WETH],
  debts: [TokenSymbol.USDC],
}
