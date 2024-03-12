import { FlashloanAction } from '../../src/actions/FlashloanAction'
import { Address, Token, TokenAmount } from '@summerfi/sdk-common/common'
import { FlashloanProvider } from '@summerfi/sdk-common/simulation'
import { decodeActionCalldata, getTargethash as getTargetHash } from '../utils/ActionDecoding'

describe('Flashloan Action', () => {
  const action = new FlashloanAction()
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

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should add calls', async () => {
    const tokenAmount = TokenAmount.createFrom({ token: DAI, amount: '100' })
    const call = action.encodeCall(
      {
        amount: tokenAmount,
        provider: FlashloanProvider.Balancer,
        calls: [
          {
            targetHash: '0x3434343434343434343434343434343456565656565656565656565656565656',
            callData: '0x1234567890123456789012345678901234',
          },
          {
            targetHash: '0x1212121212121212121212121212121278787878787878787878787878787878',
            callData: '0x9876543210987654321098765432109876',
          },
        ],
      },
      [6, 7, 8, 9],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata(action, call.callData)

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      BigInt(tokenAmount.toBaseUnit()),
      DAI.address.value,
      true,
      true,
      FlashloanProvider.Balancer,
      [
        {
          targetHash: '0x3434343434343434343434343434343456565656565656565656565656565656',
          callData: '0x1234567890123456789012345678901234',
          skipped: false,
        },
        {
          targetHash: '0x1212121212121212121212121212121278787878787878787878787878787878',
          callData: '0x9876543210987654321098765432109876',
          skipped: false,
        },
      ],
    ])
    expect(actionDecodedArgs?.mapping).toEqual([6, 7, 8, 9])
  })
})
