import getLendingPoolTest from './getLendingPool.subtest'
import getLendingPoolInfoTest from './getLendingPoolInfo.subtest'
import getTokenByAddress from './getTokenByAddress.subtest'
import getTokenByName from './getTokenByName.subtest'
import getTokenBySymbol from './getTokenBySymbol.subtest'
import makeSDKTest from './makeSDK.subtest'
import simulateNewOrder from './newOrder.subtest'
import simulateRefinanceTest from './simulateRefinance.subtest'

describe('SDK Client', () => {
  it('should create SDK client', makeSDKTest.bind(this))
  it('should use the getLendingPool query', getLendingPoolTest.bind(this))
  it('should use the getLendingPoolInfo query', getLendingPoolInfoTest.bind(this))
  it('should use the simulateRefinance query', simulateRefinanceTest.bind(this))
  it('should use the newOrder query', simulateNewOrder.bind(this))
  it('should use the getTokenBySymbol query', getTokenBySymbol.bind(this))
  it('should use the getTokenByAddress query', getTokenByAddress.bind(this))
  it('should use the getTokenByName query', getTokenByName.bind(this))
})
