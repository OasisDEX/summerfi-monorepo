import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { AaveV3DepositAction } from '../../../../src'
import { ChainFamilyMap } from '@summerfi/sdk-common'

describe('AaveV3DepositAction Action', () => {
  const action = new AaveV3DepositAction()
  const contractNameWithVersion = `${action.config.name}`

  const DAI = Token.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        depositAmount: tokenAmount,
        sumAmounts: false,
        setAsCollateral: true,
      },
      [1, 8, 5, 3],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        asset: tokenAmount.token.address.value,
        amount: BigInt(tokenAmount.toBaseUnit()),
        sumAmounts: false,
        setAsCollateral: true,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 8, 5, 3])
  })
})
