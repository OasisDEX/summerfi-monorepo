import { Address, HexData, Percentage, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { SwapAction } from '../../src/plugins/common/actions'

describe('Swap Action', () => {
  const action = new SwapAction()
  const contractNameWithVersion = `${action.config.name}_${action.config.version}`

  const DAI = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const WETH = Token.createFrom({
    chainInfo: {
      name: 'Mainnet',
      chainId: 1,
    },
    address: Address.createFromEthereum({ value: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' }),
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
    const fee = Percentage.createFrom({ value: 2.5 })

    const call = action.encodeCall(
      {
        fromAmount: fromAmount,
        toMinimumAmount: toMinimumAmount,
        fee: fee,
        withData: '0xd83ddc68200dd83ddc68200dd83ddc66200dd83ddc66d83cdff4200d2620fe0f',
        collectFeeInFromToken: true,
      },
      [9, 8, 7, 6],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    console.log('call', call.callData)
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
