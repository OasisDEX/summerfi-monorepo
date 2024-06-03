import { ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  IMorphoLendingPoolId,
  MorphoLendingPoolId,
  MorphoMarketParameters,
  MorphoProtocol,
} from '../../src'
import {
  Address,
  ChainFamilyMap,
  Percentage,
  RiskRatio,
  RiskRatioType,
  Token,
} from '@summerfi/sdk-common'

export const morphoPoolIdMock: IMorphoLendingPoolId = MorphoLendingPoolId.createFrom({
  protocol: MorphoProtocol.createFrom({
    name: ProtocolName.MorphoBlue,
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
  }),
  marketId: '0xc54d7acf14de29e0e5527cabd7a576506870346a78a11a6762e2cca66322ec41',
})

export const morphoPoolMarketParams: MorphoMarketParameters = {
  collateralToken: Token.createFrom({
    address: Address.createFromEthereum({ value: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' }),
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    name: 'Wrapped staked ETH',
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
  lltv: RiskRatio.createFrom({
    value: Percentage.createFrom({ value: 94.5 }),
    type: RiskRatioType.LTV,
  }),
}
