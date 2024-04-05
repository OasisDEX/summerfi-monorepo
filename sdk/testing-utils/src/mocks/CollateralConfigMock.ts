import {
  CurrencySymbol,
  Token,
  Price,
  RiskRatio,
  TokenAmount,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  Address,
} from '@summerfi/sdk-common/common'
import { ICollateralConfig } from '@summerfi/sdk-common/protocols'

const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

// TODO: Add getters/setters as required
export class CollateralConfigMock implements ICollateralConfig {
  token: Token
  price: Price
  priceUSD: Price
  liquidationThreshold: RiskRatio
  maxSupply: TokenAmount
  tokensLocked: TokenAmount
  liquidationPenalty: Percentage

  constructor(params: Partial<ICollateralConfig>) {
    const DAI = Token.createFrom({
      chainInfo,
      address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    })
    const token = params.token ?? {
      chainInfo,
      address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18,
    }
    this.token = Token.createFrom(token)
    this.price = params.price
      ? Price.createFrom(params.price)
      : Price.createFrom({
          baseToken: this.token,
          quoteToken: DAI,
          value: '0',
        })
    this.priceUSD = Price.createFrom({
      baseToken: this.token,
      quoteToken: CurrencySymbol.USD,
      value: '0',
    })

    const liquidationThreshold = params.liquidationThreshold ?? {
      type: RiskRatio.type.LTV,
      ratio: Percentage.createFrom({
        value: 0,
      }),
    }
    this.liquidationThreshold = RiskRatio.createFrom(liquidationThreshold)

    const maxSupply = params.maxSupply ?? {
      token: this.token,
      amount: '0',
    }
    this.maxSupply = TokenAmount.createFrom(maxSupply)

    const tokensLocked = params.tokensLocked ?? {
      token: this.token,
      amount: '0',
    }
    this.tokensLocked = TokenAmount.createFrom(tokensLocked)

    const liquidationPenalty = params.liquidationPenalty ?? {
      value: 0,
    }
    this.liquidationPenalty = Percentage.createFrom(liquidationPenalty)
  }
}
