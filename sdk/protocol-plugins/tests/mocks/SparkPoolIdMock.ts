import { AddressType, ChainInfo } from '@summerfi/sdk-common/common'
import { ProtocolName } from '@summerfi/sdk-common/protocols'
import { EmodeType } from '../../src/plugins/common'
import { ISparkLendingPoolIdData } from '../../src'

export const sparkPoolIdMock: ISparkLendingPoolIdData = {
  protocol: {
    name: ProtocolName.Spark,
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
  emodeType: EmodeType.None,
}
