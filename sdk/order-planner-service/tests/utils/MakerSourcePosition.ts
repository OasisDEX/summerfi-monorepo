import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  Position,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { PoolType, ProtocolName } from '@summerfi/sdk-common/protocols'
import {
  ILKType,
  IMakerLendingPoolData,
  IMakerLendingPoolIdData,
  IMakerProtocolData,
  MakerPositionId,
} from '@summerfi/protocol-plugins/plugins/maker'
import { PositionType } from '@summerfi/sdk-common/common'

export function getMakerPosition(): Position {
  const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

  const WETH = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    symbol: 'WETH',
    name: 'Wrapped Ether',
    decimals: 18,
  })

  const DAI = Token.createFrom({
    chainInfo,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
  })

  const collateralAmount = TokenAmount.createFrom({
    token: WETH,
    amount: '5.0',
  })

  const debtAmount = TokenAmount.createFrom({
    token: DAI,
    amount: '700.0',
  })

  const protocol: IMakerProtocolData = {
    name: ProtocolName.Maker,
    chainInfo: chainInfo,
  }

  const poolId: IMakerLendingPoolIdData = {
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    ilkType: ILKType.ETH_A,
  }

  const pool: IMakerLendingPoolData = {
    type: PoolType.Lending,
    id: poolId,
  }

  const position = {
    type: PositionType.Multiply,
    id: MakerPositionId.createFrom({ id: 'makerPosition', vaultId: '34' }),
    debtAmount,
    collateralAmount,
    pool,
  } as unknown as Position

  return position
}
