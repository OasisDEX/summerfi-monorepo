import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargethash as getTargetHash } from '../utils/ActionDecoding'
import { PullTokenAction } from '../../src/actions'

describe('PullToken Action', () => {
  const action = new PullTokenAction()
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

  const recipient = Address.createFrom({ value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })
    const call = action.encodeCall(
      {
        pullAmount: tokenAmount,
        pullTo: recipient,
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
      DAI.address.value,
      recipient.value,
      BigInt(tokenAmount.toBaseUnit()),
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 8, 5, 3])
  })
})
