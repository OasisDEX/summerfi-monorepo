import {
  CurrencySymbol,
  Token,
  Price,
  TokenAmount,
  ChainFamilyMap,
  ChainInfo,
  Percentage,
  Address,
} from '@summerfi/sdk-common/common'
import { IDebtConfig } from '@summerfi/sdk-common/protocols'

const chainInfo: ChainInfo = ChainFamilyMap.Ethereum.Mainnet

// TODO: Add getters/setters as required
export class DebtConfigMock implements IDebtConfig {
  token: Token
  price: Price
  priceUSD: Price
  rate: Percentage
  totalBorrowed: TokenAmount
  debtCeiling: TokenAmount
  debtAvailable: TokenAmount
  dustLimit: TokenAmount
  originationFee: Percentage

  constructor(params: Partial<IDebtConfig>) {
    const token = params.token ?? {
      chainInfo,
      address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
      symbol: 'DAI',
      name: 'Dai Stablecoin',
      decimals: 18,
    }
    this.token = Token.createFrom(token)
    this.price = params.price
      ? Price.createFrom(params.price)
      : Price.createFrom({
          baseToken: this.token,
          quoteToken: CurrencySymbol.USD,
          value: '0',
        })
    this.priceUSD = Price.createFrom({
      baseToken: this.token,
      quoteToken: CurrencySymbol.USD,
      value: '0',
    })

    const rate = params.rate ?? {
      value: 0,
    }
    this.rate = Percentage.createFrom(rate)

    const totalBorrowed = params.totalBorrowed ?? {
      token: this.token,
      amount: '0',
    }
    this.totalBorrowed = TokenAmount.createFrom(totalBorrowed)

    const debtCeiling = params.debtCeiling ?? {
      token: this.token,
      amount: '0',
    }
    this.debtCeiling = TokenAmount.createFrom(debtCeiling)

    const debtAvailable = params.debtAvailable ?? {
      token: this.token,
      amount: '0',
    }
    this.debtAvailable = TokenAmount.createFrom(debtAvailable)

    const dustLimit = params.dustLimit ?? {
      token: this.token,
      amount: '0',
    }
    this.dustLimit = TokenAmount.createFrom(dustLimit)

    const originationFee = params.originationFee ?? {
      value: 0,
    }
    this.originationFee = Percentage.createFrom(originationFee)
  }
}
