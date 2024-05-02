import getLendingPoolTest from './getLendingPool.subtest'
import getLendingPoolInfoTest from './getLendingPoolInfo.subtest'
import makeSDKTest from './makeSDK.subtest'
import simulateNewOrder from './newOrder.subtest'
import simulateRefinanceTest from './simulateRefinance.subtest'

describe('SDK Client', () => {
  it('should create SDK client', makeSDKTest.bind(this))
  it('should use the getLendingPool query', getLendingPoolTest.bind(this))
  it('should use the getLendingPoolInfo query', getLendingPoolInfoTest.bind(this))
  it('should use the simulateRefinance query', simulateRefinanceTest.bind(this))
  it('should use the newOrder query', simulateNewOrder.bind(this))
})
