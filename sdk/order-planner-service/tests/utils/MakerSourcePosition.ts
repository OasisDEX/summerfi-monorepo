import {
  ILKType,
  IMakerLendingPool,
  IMakerLendingPoolIdData,
  IMakerLendingPosition,
  IMakerProtocolData,
  MakerLendingPool,
  MakerLendingPosition,
  MakerLendingPositionId,
} from '@summerfi/protocol-plugins/plugins/maker'
import {
  Address,
  ChainFamilyMap,
  ChainInfo,
  PoolType,
  PositionType,
  ProtocolName,
  Token,
  TokenAmount,
} from '@summerfi/sdk-common/common'
import { LendingPositionType } from '@summerfi/sdk-common/lending-protocols'

export function getMakerPosition(): IMakerLendingPosition {
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

  const pool: IMakerLendingPool = MakerLendingPool.createFrom({
    type: PoolType.Lending,
    id: poolId,
    debtToken: DAI,
    collateralToken: WETH,
  })

  const position = MakerLendingPosition.createFrom({
    type: PositionType.Lending,
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      type: PositionType.Lending,
      id: 'makerPosition',
      vaultId: '34',
    }),
    debtAmount,
    collateralAmount,
    pool,
  })

  return position
}
