import { Address, Percentage, Token, TokenAmount } from '@summerfi/sdk-common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { SwapAction } from '../../../src/plugins/common/actions'

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

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        fromAsset: fromAmount.token.address.value,
        toAsset: toMinimumAmount.token.address.value,
        amount: fromAmount.toSolidityValue(),
        receiveAtLeast: toMinimumAmount.toSolidityValue(),
        fee: fee.toSolidityValue({ decimals: 2 }),
        withData: '0xd83ddc68200dd83ddc68200dd83ddc66200dd83ddc66d83cdff4200d2620fe0f',
        collectFeeFromToken: true,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([9, 8, 7, 6])
  })
})
