import { Denomination, IPrice, IToken } from '@summerfi/sdk-common/common'

export interface IPriceService {
  getPrice: (params: { base: IToken; quote: Denomination }) => Promise<IPrice>
  getPriceUSD: (token: IToken) => Promise<IPrice>
}
