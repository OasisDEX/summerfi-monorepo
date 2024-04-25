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
      value: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    chainInfo: { chainId: 1, name: 'Ethereum' },
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  debtToken: {
    address: {
      type: AddressType.Ethereum,
      value: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    chainInfo: { chainId: 1, name: 'Ethereum' },
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
  },
  ilkType: ILKType.ETH_A,
}
