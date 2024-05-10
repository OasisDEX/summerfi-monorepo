import { AddressType, ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { ILKType } from '../../src/plugins/maker'
import { IMakerLendingPoolIdData } from '../../src/plugins/maker/interfaces/IMakerLendingPoolId'

export const makerPoolIdMock: IMakerLendingPoolIdData = {
  protocol: {
    name: ProtocolName.Maker,
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
  ilkType: ILKType.ETH_A,
}
