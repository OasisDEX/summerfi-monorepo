import fs, { existsSync, readFileSync } from 'fs'
import path, { resolve } from 'path'

import type {
  DeploymentInitParams,
  Deployment,
  DeploymentParams,
  DeploymentObject,
  DeploymentType,
  ImportPair,
  DeploymentExportPair,
  Dependency,
} from './types'
import {
  DeploymentFlags,
  DeploymentOptions,
  DeploymentChain,
  ProviderTypes,
  DirectoryFilterType,
} from './types'
import { verifyContract } from './verify-contract'
import { viem } from 'hardhat'
import { Contract, DeploymentTransaction, TransactionReceipt, WalletClient } from './viem-types'
import {
  DeploymentFileExtension,
  DeploymentTypeSeparator,
  LocalExportsFileName,
  RemoteExportsFileName,
} from './constants'
import {
  getDeploymentNameFromType,
  getDeploymentsName,
  isDeploymentParams,
  isWalletClient,
} from './utils'
import { Address } from '@summerfi/common'
import { toCamelCase } from '../utils/camelCase'

export class Deployments {
  public readonly deploymentType: DeploymentType
  public readonly options: DeploymentOptions
  public readonly deploymentsDir?: string
  public readonly indexDir?: string
  public readonly deployments: Record<string, DeploymentObject> = {}
  public readonly dependencies: Record<string, Dependency> = {}

  private static readonly DefaultParams: DeploymentInitParams = {
    type: {
      provider: ProviderTypes.Internal,
      chain: DeploymentChain.Develop,
      config: 'test',
    },
    options: DeploymentFlags.None,
  }

  /**
    PUBLIC
  */
  public constructor(params: DeploymentInitParams = Deployments.DefaultParams) {
    this.validateParams(params)

    this.deploymentType = params.type
    this.options = params.options
    this.deploymentsDir = params.deploymentsDir
    this.indexDir = params.indexDir
  }

  public validateParams(params: DeploymentInitParams): void {
    if (
      (params.type.chain === DeploymentChain.Develop &&
        params.type.provider === ProviderTypes.Remote) ||
      (params.type.provider === ProviderTypes.Internal &&
        params.type.chain !== DeploymentChain.Develop)
    ) {
      throw new Error(
        `Provider ${params.type.provider} is not supported for network ${params.type.chain}`,
      )
    }
  }

  public getAddress(contractName: string): Address | undefined {
    return (
      this.deployments[contractName]?.contract.address ??
      this.dependencies[contractName]?.address ??
      undefined
    )
  }

  public getContract(contractName: string): Contract | undefined {
    return this.deployments[contractName]?.contract ?? this.dependencies[contractName]?.contract
  }

  public async deploy(
    contractName: string,
    args: unknown[] = [],
    overrides: (WalletClient | DeploymentParams) | undefined = undefined,
  ): Promise<Contract> {
    let options = this.options
    let alias = undefined
    let walletClient = undefined

    if (isDeploymentParams(overrides)) {
      options = overrides.options || options
      alias = overrides.alias
    } else if (isWalletClient(overrides)) {
      walletClient = overrides
    }

    const deployment: DeploymentObject = await this._deploy(contractName, args, alias, walletClient)

    this.deployments[contractName] = deployment

    if (this._hasVerifyOption(options) && this._isDevelopNetwork() == false) {
      await this._verify(deployment, args)
    }

    return deployment.contract
  }

  public async attach(
    contractName: string,
    contractAddress: Address,
    alias?: string,
  ): Promise<Contract> {
    const contract = await viem.getContractAt(contractName, contractAddress)

    // Push without receipt to indicate that this is an attached contract
    this.dependencies[contractName] = {
      contract,
      address: contractAddress,
      name: alias || contractName,
    }

    return contract
  }

  public addDependency(contractName: string, contractAddress: Address) {
    // Push without receipt to indicate that this is an attached contract
    this.dependencies[contractName] = {
      address: contractAddress,
      name: contractName,
    }
  }

  public persist(): void {
    if (this.deploymentsDir === undefined || this.indexDir === undefined) {
      throw new Error('Deployments directory not set')
    }
    if (this._isInternalProvider()) {
      return
    }

    // Cycle the previous deployment info to keep a history of deployments.
    // When deploying to develop only the latest deployment is kept.
    if (this._isDevelopNetwork() === false) {
      this._cycleDeploymentFile()
    }

    const deployments = this._getDeploymentTemplate()

    for (const deployedContract of Object.values(this.deployments)) {
      deployments.contracts[deployedContract.name] = {
        address: deployedContract.contract.address,
        blockNumber: deployedContract.receipt.blockNumber.toString(),
      }
    }

    for (const dependency of Object.values(this.dependencies)) {
      deployments.dependencies[dependency.name] = {
        address: dependency.address,
      }
    }

    const deploymentFile = this.getDeploymentsPath()
    const dirName = path.dirname(deploymentFile)

    fs.mkdirSync(dirName, { recursive: true })
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2))

    this.rebuildIndex(this.deploymentsDir, this.indexDir)
  }

  public rebuildIndex(deploymentsDir: string, indexDir: string): void {
    // Remote Index
    this._rebuildIndex(
      deploymentsDir,
      indexDir,
      RemoteExportsFileName,
      [ProviderTypes.Hardhat],
      DirectoryFilterType.Exclude,
    )

    // Local Index
    this._rebuildIndex(
      deploymentsDir,
      indexDir,
      LocalExportsFileName,
      [ProviderTypes.Hardhat],
      DirectoryFilterType.Include,
    )
  }

  /**
    GETTERS
   */
  public get indexFileName(): string | undefined {
    if (this.deploymentType.provider === ProviderTypes.Remote) {
      return RemoteExportsFileName
    } else if (this.deploymentType.provider === ProviderTypes.Hardhat) {
      return LocalExportsFileName
    } else {
      return undefined
    }
  }

  public getDeploymentsPath(timestamp: number | undefined = undefined): string {
    if (this.deploymentsDir === undefined) {
      return ''
    }

    const deploymentsDir = this.deploymentsDir
    const providerDir = `${this.deploymentType.provider}`
    const deploymentsFileName = getDeploymentsName(this.deploymentType, timestamp)

    return resolve(deploymentsDir, providerDir, deploymentsFileName)
  }

  public retrieveDeployments() {
    const deploymentsPath = this.getDeploymentsPath()

    if (existsSync(deploymentsPath)) {
      return JSON.parse(readFileSync(deploymentsPath, 'utf-8'))
    } else {
      return undefined
    }
  }

  /**
    PRIVATE
   */
  private _writeIndex(
    indexDir: string,
    indexFileName: string,
    imports: ImportPair[],
    indexObject: DeploymentExportPair[],
  ) {
    const indexFilePath = resolve(indexDir, indexFileName)

    fs.writeFileSync(indexFilePath, `// Autogenerated by the deployments script\n`, 'utf8')

    imports.forEach((importStatement) => {
      fs.appendFileSync(
        indexFilePath,
        `import ${importStatement.name} from "${importStatement.path}";\n`,
        'utf8',
      )
    })

    fs.appendFileSync(indexFilePath, `\nexport const Deployments = {`, 'utf8')

    indexObject.forEach((deploymentExport) => {
      fs.appendFileSync(
        indexFilePath,
        `\n  "${deploymentExport.name}": ${deploymentExport.value},`,
        'utf8',
      )
    })

    fs.appendFileSync(indexFilePath, `\n};\n`, 'utf8')
  }

  private async _getTransactionReceipt(
    deploymentTransaction: DeploymentTransaction,
  ): Promise<TransactionReceipt> {
    const publicClient = await viem.getPublicClient()
    return publicClient.getTransactionReceipt({ hash: deploymentTransaction.hash })
  }

  private async _deploy(
    contractName: string,
    args: unknown[] = [],
    alias?: string,
    walletClient?: WalletClient,
  ): Promise<DeploymentObject> {
    let contract: Contract
    let deploymentTransaction: DeploymentTransaction
    let receipt: TransactionReceipt

    try {
      ;({ contract, deploymentTransaction } = await viem.sendDeploymentTransaction(
        contractName,
        args,
        {
          walletClient,
        },
      ))

      receipt = await this._getTransactionReceipt(deploymentTransaction)
    } catch (error) {
      throw new Error(`Error deploying contract ${contractName}: ` + error)
    }

    return {
      contract,
      name: alias || contractName,
      receipt,
    }
  }

  private async _verify(deployment: DeploymentObject, args: unknown[]) {
    const address: string = await deployment.contract.address
    const parameters: unknown[] = args

    try {
      await verifyContract(address, parameters)
    } catch (error) {
      console.log('Error verifying contract: ' + error)
    }
  }

  private _cycleDeploymentFile(): void {
    const deploymentFile = this.getDeploymentsPath()

    if (!fs.existsSync(deploymentFile)) {
      return
    }

    const latestDeploymentJSON = fs.readFileSync(deploymentFile, 'utf8')
    const latestDeployment = JSON.parse(latestDeploymentJSON)

    const timestamp = latestDeployment.timestamp

    const timestamDeploymentFile = this.getDeploymentsPath(timestamp)

    fs.renameSync(deploymentFile, timestamDeploymentFile)
  }

  private _rebuildIndex(
    deploymentsDir: string,
    indexDir: string,
    indexFileName: string,
    directoriesList: string[],
    filterType: DirectoryFilterType,
    canInclude?: (deployment: Deployment) => boolean,
  ): void {
    const indexImports: ImportPair[] = []
    const deploymentsIndex: DeploymentExportPair[] = []

    // Loop through all the inner directories
    const deploymentDirs = fs
      .readdirSync(deploymentsDir, {
        withFileTypes: true,
      })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)

    deploymentDirs.forEach((deploymentDir) => {
      // Filter out non-required directories
      if (
        (filterType === DirectoryFilterType.Include && !directoriesList.includes(deploymentDir)) ||
        (filterType === DirectoryFilterType.Exclude && directoriesList.includes(deploymentDir))
      ) {
        return
      }

      const deploymentDirPath = resolve(deploymentsDir, deploymentDir)
      const deploymentFiles = fs
        .readdirSync(deploymentDirPath)
        .filter(
          (fileName) => fileName.endsWith(DeploymentFileExtension) && !/\.\d+\.json/.test(fileName),
        )

      // Read the contents of each file
      deploymentFiles.forEach((deploymentFile) => {
        const deploymentFilePath = resolve(deploymentDirPath, deploymentFile)
        const deploymentJSON = fs.readFileSync(deploymentFilePath, 'utf8')
        const deployment: Deployment = JSON.parse(deploymentJSON)

        const deploymentTypeName = getDeploymentNameFromType(deployment)

        if (canInclude === undefined || canInclude(deployment)) {
          const importName = toCamelCase(deploymentTypeName, DeploymentTypeSeparator).replace(
            /-/g,
            '_',
          )

          const importPath = path.relative(indexDir, deploymentFilePath)

          indexImports.push({
            name: importName,
            path: importPath.startsWith('.') ? importPath : `./${importPath}`,
          })

          deploymentsIndex.push({
            name: `${deployment.chain}${DeploymentTypeSeparator}${deployment.config}`,
            value: importName,
          })
        }
      })
    })

    this._writeIndex(indexDir, indexFileName, indexImports, deploymentsIndex)
  }

  private _getDeploymentTemplate(): Deployment {
    return {
      date: new Date().toISOString(),
      timestamp: this._getNowTimestamp(),
      provider: this.deploymentType.provider,
      chain: this.deploymentType.chain,
      config: this.deploymentType.config,
      contracts: {},
      dependencies: {},
    }
  }

  private _getNowTimestamp(): number {
    return Math.floor(new Date().getTime() / 1000)
  }

  private _hasVerifyOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Verify ? true : false
  }

  private _isDevelopNetwork(): boolean {
    return this.deploymentType.chain === DeploymentChain.Develop
  }

  private _isInternalProvider(): boolean {
    return this.deploymentType.provider === ProviderTypes.Internal
  }
}
