import { AddressType, ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../src/plugins/common'
import { IAaveV3LendingPoolIdData } from '../../src'

export const aaveV3PoolIdMock: IAaveV3LendingPoolIdData = {
  protocol: {
    name: ProtocolName.AAVEv3,
    chainInfo: { chainId: 1, name: 'Ethereum' },
  },
  collateralToken: {
    address: {
      type: AddressType.Ethereum,
      value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    },
    chainInfo: { chainId: 1, name: 'Ethereum' },
    name: 'Wrapped Ether',
    symbol: 'WETH',
    decimals: 18,
  },
  debtToken: {
    address: {
      type: AddressType.Ethereum,
      value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    chainInfo: { chainId: 1, name: 'Ethereum' },
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
  },
  emodeType: EmodeType.None,
}
