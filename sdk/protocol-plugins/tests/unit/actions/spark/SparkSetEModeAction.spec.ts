import { decodeActionCalldata, getTargetHash } from '@summerfi/testing-utils'
import { EmodeType, SparkSetEmodeAction, aaveV3EmodeCategoryMap } from '../../../../src'

describe('MorphoPaybackAction Action', () => {
  const action = new SparkSetEmodeAction()
  const contractNameWithVersion = `${action.config.name}`

  it('should return the versioned name', () => {
    expect(action.getVersionedName()).toBe(contractNameWithVersion)
  })

  it('should encode calls', async () => {
    const call = action.encodeCall(
      {
        emode: EmodeType.Stablecoins,
      },
      [2, 6, 7, 9],
    )

    expect(call.targetHash).toBe(getTargetHash(action))

    const actionDecodedArgs = decodeActionCalldata({
      action,
      calldata: call.callData,
    })

    expect(actionDecodedArgs).toBeDefined()
    expect(actionDecodedArgs?.args).toEqual([
      {
        categoryId: aaveV3EmodeCategoryMap[EmodeType.Stablecoins],
      },
    ])
    expect(actionDecodedArgs?.mapping).toEqual([2, 6, 7, 9])
  })
})
