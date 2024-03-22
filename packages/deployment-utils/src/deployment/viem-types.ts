import { viem } from 'hardhat'

export type Contract = Awaited<ReturnType<typeof viem.deployContract>>
export type WalletClient = Awaited<ReturnType<typeof viem.getWalletClient>>
export type ContractAndDeploymentTransaction = Awaited<
  ReturnType<typeof viem.sendDeploymentTransaction>
>
export type DeploymentTransaction = ContractAndDeploymentTransaction['deploymentTransaction']
export type PublicClient = Awaited<ReturnType<typeof viem.getPublicClient>>
export type TestClient = Awaited<ReturnType<typeof viem.getTestClient>>
export type TransactionReceipt = Awaited<ReturnType<PublicClient['getTransactionReceipt']>>

export type CurrentBlock = Awaited<ReturnType<PublicClient['getBlock']>>
export type BlockNumber = Awaited<ReturnType<PublicClient['getBlockNumber']>>
export type Quantity = Awaited<ReturnType<TestClient['increaseTime']>>
