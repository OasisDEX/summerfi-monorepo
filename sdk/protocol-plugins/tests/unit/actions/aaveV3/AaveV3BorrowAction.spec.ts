import { Address, Token, TokenAmount, ChainFamilyMap } from '@summerfi/sdk-common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { AaveV3BorrowAction } from '../../../../src'

describe('AaveV3BorrowAction Action', () => {
  const action = new AaveV3BorrowAction()
  const contractNameWithVersion = `${action.config.name}_${action.config.version}`

  const DAI = Token.createFrom({
    chainInfo: ChainFamilyMap.Ethereum.Mainnet,
    address: Address.createFromEthereum({ value: '0x6B175474E89094C44Da98b954EedeAC495271d0F' }),
    decimals: 18,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
  })

  const recipient = Address.createFromEthereum({
    value: '0x6ADb2E268de2aA1aBF6578E4a8119b960E02928F',
  })

  const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        borrowAmount: tokenAmount,
        borrowTo: recipient,
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
        amount: tokenAmount.toSolidityValue(),
        to: recipient.value,
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 8, 5, 3])
  })
})
