export { Deployments } from './deployment'
export { asMock, ifMocksEnabled } from './test/mocks'
export type { MockOrContract } from './test/mocks'
export { getDeploymentType, parseDeploymentName } from './config'
export type { Provider, Network, ConfigName, DeploymentType, DeploymentOptions } from './types'
export { ProviderTypes, DeploymentFlags, DeploymentNetwork, isProvider, isNetwork } from './types'
export { showConsoleLogs } from './test/console'
export {
  fastForwardChain,
  getCurrentBlock,
  getCurrentTimestamp,
  getNextTimestamp,
  getLastTimestamp,
  setNextBlockTimestamp,
} from './utils/blockchain'
