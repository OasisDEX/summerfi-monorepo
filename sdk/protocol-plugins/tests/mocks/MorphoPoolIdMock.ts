import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { IMorphoLendingPoolIdData, MorphoProtocol } from '../../src'
import { Address, ChainFamilyMap, Percentage, Token } from '@summerfi/sdk-common'

export const morphoPoolIdMock: IMorphoLendingPoolIdData = {
  protocol: MorphoProtocol.createFrom({
    name: ProtocolName.Morpho,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }),
  collateralToken: Token.createFrom({
    address: Address.createFromEthereum({ value: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' }),
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    name: 'Wrapped liquid staked Ether 2.0',
    symbol: 'wstETH',
    decimals: 18,
  }),
  debtToken: Token.createFrom({
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  }),
  oracle: Address.createFromEthereum({ value: '0x2a01EB9496094dA03c4E364Def50f5aD1280AD72' }),
  irm: Address.createFromEthereum({ value: '0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC' }),
  lltv: Percentage.createFrom({ value: 94.5 }),
}
