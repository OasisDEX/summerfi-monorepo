import {
    Token,
    Price,
    CurrencySymbol
} from '@summerfi/sdk-common/common'

export interface IPriceService {
    getPrice: (args: { baseToken: Token; quoteToken: Token | CurrencySymbol }) => Promise<Price>
    getPriceUSD: (token: Token) => Promise<Price>
}