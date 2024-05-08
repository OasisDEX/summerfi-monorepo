import { Address, ChainInfo, TokenSymbol } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'

export const compoundV3PoolIdMock = {
  protocol: {
    name: ProtocolName.CompoundV3,
    chainInfo: ChainInfo.createFrom({ chainId: 1, name: 'Ethereum' }),
  },
  collaterals: [TokenSymbol.WETH],
  debt: TokenSymbol.USDC,
  comet: Address.createFromEthereum({ value: '0xc3d688B66703497DAA19211EEdff47f25384cdc3' }),
}
