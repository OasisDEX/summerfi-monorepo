import { Address, Token, TokenAmount } from '@summerfi/sdk-common'
import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { PullTokenAction } from '../../../src/plugins/common/actions'

describe('PullToken Action', () => {
  const action = new PullTokenAction()
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

  const recipient = Address.createFromEthereum({
    value: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  })

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '578' })
    const call = action.encodeCall(
      {
        pullAmount: tokenAmount,
        pullFrom: recipient,
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
        asset: DAI.address.value,
        from: recipient.value,
        amount: tokenAmount.toSolidityValue(),
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([1, 8, 5, 3])
  })
})
