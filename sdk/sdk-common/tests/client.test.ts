import { makeSDK } from '~sdk-common/client/implementation'

describe('SDK Client', () => {
  it('should create SDK client', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
