import {
  ILKType,
  IMakerLendingPool,
  IMakerLendingPosition,
  MakerLendingPool,
  MakerLendingPoolId,
  MakerLendingPosition,
  MakerLendingPositionId,
  MakerProtocol,
} from '@summerfi/protocol-plugins'
import { Address, ChainFamilyMap, ChainInfo, Token, TokenAmount } from '@summerfi/sdk-common'
import { LendingPositionType } from '@summerfi/sdk-common'

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

  const protocol = MakerProtocol.createFrom({
    chainInfo: chainInfo,
  })

  const poolId = MakerLendingPoolId.createFrom({
    protocol: protocol,
    collateralToken: WETH,
    debtToken: DAI,
    ilkType: ILKType.ETH_A,
  })

  const pool: IMakerLendingPool = MakerLendingPool.createFrom({
    id: poolId,
    debtToken: DAI,
    collateralToken: WETH,
  })

  const position = MakerLendingPosition.createFrom({
    subtype: LendingPositionType.Multiply,
    id: MakerLendingPositionId.createFrom({
      id: 'makerPosition',
      vaultId: '34',
    }),
    debtAmount,
    collateralAmount,
    pool,
  })

  return position
}
