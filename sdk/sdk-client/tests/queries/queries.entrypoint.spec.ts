import getPoolTest from './getPool.subtest'
import makeSDKTest from './makeSDK.subtest'
import simulateRefinanceTest from './simulateRefinance.subtest'

describe('SDK Client', () => {
  it('should create SDK client', makeSDKTest.bind(this))
  it('should use the getPool query', getPoolTest.bind(this))
  it('should use the simulateRefinance query', simulateRefinanceTest.bind(this))
})
