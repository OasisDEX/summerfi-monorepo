import { Token } from '../src/common/implementation/Token'
import { TokenAmount } from '../src/common/implementation/TokenAmount'
import { Address } from '../src/common/implementation/Address'
import { AddressType } from '../src/common/enums/AddressType'
import { Price } from '../src/common/implementation/Price'
import { exchange } from '../src/common/utils/TokenUtils'
import { describe } from 'node:test'

describe('TokenUtils', () => {
 describe('exchange', () => {
    const DAI = Token.createFrom({ 
        address: Address.createFrom({type: AddressType.Ethereum, value: '0x6b175474e89094c44da98b954eedeac495271d0f' }), chainInfo: { chainId: 1, name: 'eth' },
        symbol: 'DAI', 
        name: 'Dai', 
        decimals: 18
    })
    const ETH = Token.createFrom({ 
        address: Address.createFrom({type: AddressType.Ethereum, value: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' }), chainInfo: { chainId: 1, name: 'eth' },
        symbol: 'ETH', 
        name: 'Ethereium', 
        decimals: 18
    })
    describe("When the quote token is a Token", () => {
        const tokenAmount = TokenAmount.createFrom({
            token: DAI,
            amount: '300',
        })
        const price = Price.createFrom({
            value: '3000',
            baseToken: ETH,
            quoteToken: DAI,
        })

        const result = exchange(tokenAmount, price)

        it('Should return an amount in base token', () => {
            expect(result.token).toEqual(ETH)
        })

        it('Should return the correct amount', () => {
            expect(result.amount).toEqual('0.1')
        })
    })

    describe("When the quote token does not match the tokenAmount token", () => {
        const tokenAmount = TokenAmount.createFrom({
            token: DAI,
            amount: '300',
        })
        const price = Price.createFrom({
            value: '0.000333',
            baseToken: DAI,
            quoteToken: ETH,
        })

        it('Should throw an error when price is quoted in different token', () => {
            expect(() => exchange(tokenAmount, price)).toThrow('Price needs to be quoted in the same token as the tokenAmount')
        })
    })
 })
})
