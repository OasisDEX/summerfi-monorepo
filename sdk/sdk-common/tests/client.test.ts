import { makeSDK } from '~sdk-common/client'

describe('SDK Client', () => {
  it('should create SDK client', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
