import { viem } from 'hardhat'

export type Contract = Awaited<ReturnType<typeof viem.deployContract>>
export type WalletClient = Awaited<ReturnType<typeof viem.getWalletClient>>
export type ContractAndDeploymentTransaction = Awaited<
  ReturnType<typeof viem.sendDeploymentTransaction>
>
export type DeploymentTransaction = ContractAndDeploymentTransaction['deploymentTransaction']
export type PublicClient = Awaited<ReturnType<typeof viem.getPublicClient>>
export type TransactionReceipt = Awaited<ReturnType<PublicClient['getTransactionReceipt']>>
