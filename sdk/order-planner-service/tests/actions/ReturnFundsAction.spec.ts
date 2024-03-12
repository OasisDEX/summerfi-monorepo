import { Address, Token } from '@summerfi/sdk-common/common'
import { decodeActionCalldata, getTargethash as getTargetHash } from '../utils/ActionDecoding'
import { ReturnFundsAction } from '../../src/actions'

describe('ReturnFunds Action', () => {
  const action = new ReturnFundsAction()
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

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        asset: DAI,
      },
      [8, 9, 1, 3],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata(action, call.callData)

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([DAI.address.value])
    expect(actionDecodedArgs?.mapping).toEqual([8, 9, 1, 3])
  })
})
