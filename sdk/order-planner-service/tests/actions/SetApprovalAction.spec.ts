import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargethash as getTargetHash } from '../utils/ActionDecoding'
import { SetApprovalAction } from '../../src/actions'

describe('SetApproval Action', () => {
  const action = new SetApprovalAction()
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

  const delegate = Address.createFrom({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should add calls', async () => {
    const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '1919' })

    const call = action.encodeCall(
      {
        approvalAmount: tokenAmount,
        delegate: delegate,
        sumAmounts: true,
      },
      [1, 1, 3, 7],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata(action, call.callData)

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      DAI.address.value,
      delegate.value,
      BigInt(tokenAmount.toBaseUnit()),
      true,
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 1, 3, 7])
  })
})
