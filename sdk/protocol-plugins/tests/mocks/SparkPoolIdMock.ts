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
      value: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    },
    chainInfo: { chainId: 1, name: 'Ethereum' },
    name: 'Dai Stablecoin',
    symbol: 'DAI',
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
