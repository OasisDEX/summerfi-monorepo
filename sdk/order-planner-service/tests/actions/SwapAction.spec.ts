import { Address, HexData, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargethash as getTargetHash } from '../utils/ActionDecoding'
import { SwapAction } from '../../src/actions'

describe('Swap Action', () => {
  const action = new SwapAction()
  const contractNameWithVersion = `${action.config.name}_v${action.config.version}`

  const DAI = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFrom({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const WETH = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFrom({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
    decimals: 18,
    name: 'Wrapped Ether',
    symbol: 'WETH',
  })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should add calls', async () => {
    const fromAmount = TokenAmount.createFrom({ token: DAI, amount: '1919' })
    const toMinimumAmount = TokenAmount.createFrom({ token: WETH, amount: '0.6' })
    const fee = Percentage.createFrom({ percentage: 2.5 })

    const call = action.encodeCall(
      {
        fromAmount: fromAmount,
        toMinimumAmount: toMinimumAmount,
        fee: fee,
        withData: '0x912381298aef89899c5498948b409230ca3234',
        collectFeeInFromToken: true,
      },
      [9, 8, 7, 6],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      fromAmount.token.address.value,
      toMinimumAmount.token.address.value,
      BigInt(fromAmount.toBaseUnit()),
      BigInt(toMinimumAmount.toBaseUnit()),
      BigInt(fee.toBaseUnit({ decimals: 8 })),
      '0x912381298aef89899c5498948b409230ca3234',
      true,
    ])
    expect(actionDecodedArgs?.mapping).toEqual([9, 8, 7, 6])
  })
})
