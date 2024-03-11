import { makeSDK } from '~sdk-client/implementation/MakeSDK'

describe('SDK Client', () => {
  it('should create SDK client', () => {
    const sdk = makeSDK()

    expect(sdk).toBeDefined()
  })
})
