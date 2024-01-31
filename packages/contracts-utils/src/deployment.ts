import fs, { existsSync, readFileSync } from 'fs'
import path, { resolve } from 'path'

import '@nomicfoundation/hardhat-ethers'
import '@openzeppelin/hardhat-upgrades'
import { ethers, upgrades } from 'hardhat'
import type { FactoryOptions } from '@nomicfoundation/hardhat-ethers/types'
import type { DeployProxyOptions } from '@openzeppelin/hardhat-upgrades/src/utils/options'

import type { Contract, Signer, ContractTransactionReceipt } from 'ethers'

import { smock } from '@defi-wonderland/smock'
import type { MockContract } from '@defi-wonderland/smock'

import { getImplementationAddress } from '@openzeppelin/upgrades-core'

import type {
  DeploymentInitParams,
  Deployment,
  DeploymentParams,
  DeploymentObject,
  DeploymentObjectLegacy,
  DeploymentType,
  Provider,
  Network,
  ConfigName,
  ImportPair,
  DeploymentExportPair,
  LegacyDeploymentObject,
} from './types'
import {
  DeploymentFlags,
  DeploymentOptions,
  DeploymentNetwork,
  ProviderTypes,
  DirectoryFilterType,
  isProvider,
  isNetwork,
} from './types'
import { verify } from './utils/hardhat'
import { toCamelCase } from './utils/camelCase'

export class Deployments {
  private static type: DeploymentType
  private static options: DeploymentOptions
  private static deploymentsDir?: string
  private static indexDir?: string

  private static deployments: Deployment[] = []

  private static readonly NumConfirmationsWait = 5
  private static readonly RemoteExportsFileName = 'index.ts'
  private static readonly LocalExportsFileName = 'local.ts'
  private static readonly DbSeedsExportsFileName = 'db-seeds.ts'
  private static readonly DbSeedsConfigString = 'db-seeds'
  private static readonly DeploymentTypeSeparator = '.'
  private static readonly DeploymentFileExtension = '.json'
  private static readonly LegacyDeploymentFileExtension = '.json'

  private static readonly DefaultParams: DeploymentInitParams = {
    type: {
      provider: ProviderTypes.Internal,
      network: DeploymentNetwork.Develop,
      config: 'test',
    },
    options: DeploymentFlags.None,
  }

  /**
    PUBLIC
  */
  public static initialize(params: DeploymentInitParams = Deployments.DefaultParams) {
    Deployments.validateParams(params)

    this.type = params.type
    this.options = params.options
    this.deploymentsDir = params.deploymentsDir
    this.indexDir = params.indexDir
  }

  public static validateParams(params: DeploymentInitParams): void {
    if (
      (params.type.network === DeploymentNetwork.Develop &&
        params.type.provider === ProviderTypes.Remote) ||
      (params.type.provider === ProviderTypes.Internal &&
        params.type.network !== DeploymentNetwork.Develop)
    ) {
      throw new Error(
        `Provider ${params.type.provider} is not supported for network ${params.type.network}`,
      )
    }
  }

  public static async deploy<T extends Contract>(
    contractName: string,
    args: unknown[] = [],
    overrides: (Signer | DeploymentParams) | undefined = undefined,
    proxyOptions?: DeployProxyOptions,
  ): Promise<T | MockContract<T>> {
    let options = this.options
    let alias = undefined

    if (this._isDeploymentParams(overrides)) {
      options = overrides.options || options
      alias = overrides.alias
    }

    let deployment: Deployment
    if (this._hasMockOption(options) && this._isInternalProvider()) {
      deployment = await this._deployMock(contractName, args, alias)
    } else {
      deployment = await this._deploy(contractName, args, options, alias, overrides, proxyOptions)
    }

    this.deployments.push(deployment)

    if (this._hasVerifyOption(options) && this._isDevelopNetwork() == false) {
      await this._verify(deployment, args, options)
    }

    if (this._hasMockOption(options)) {
      return deployment.contract as unknown as MockContract<T>
    } else {
      return deployment.contract.deployed() as Promise<T>
    }
  }

  public static async attach<T extends Contract>(
    contractName: string,
    contractAddress: string,
    alias?: string,
  ): Promise<T> {
    const contract = await ethers.getContractAt(contractName, contractAddress)

    // Push without receipt to indicate that this is an attached contract
    this.deployments.push({
      contract,
      address: contractAddress,
      name: alias || contractName,
    })

    return contract.deployed() as Promise<T>
  }

  public static persist(includeLegacy = false): void {
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

    const deployments = this._getDeploymentObjectTemplate()
    const legacyDeployments = this._getLegacyDeploymentObjectTemplate()

    this.deployments.forEach((deployedContract) => {
      // If there is a receipt then the contract was deployed, otherwise
      // it was attached and it is considered as a dependency
      if (deployedContract.receipt) {
        deployments.contracts[deployedContract.name] = {
          address: deployedContract.address,
          blockNumber: deployedContract.receipt.blockNumber,
        }
      } else {
        deployments.dependencies[deployedContract.name] = {
          address: deployedContract.address,
        }
      }

      legacyDeployments.contracts[deployedContract.name] = {
        address: deployedContract.address,
        blockNumber: deployedContract.receipt?.blockNumber || 0,
      }
    })

    const deploymentFile = this.getDeploymentsPath()
    const dirName = path.dirname(deploymentFile)

    fs.mkdirSync(dirName, { recursive: true })
    fs.writeFileSync(deploymentFile, JSON.stringify(deployments, null, 2))

    if (includeLegacy) {
      const legacyDeploymentFile = this.getLegacyDeploymentsPath()
      fs.writeFileSync(legacyDeploymentFile, JSON.stringify(legacyDeployments, null, 2))
    }

    this.rebuildIndex(this.deploymentsDir, this.indexDir, includeLegacy)
  }

  public static rebuildIndex(
    deploymentsDir: string,
    indexDir: string,
    includeLegacy = false,
  ): void {
    // Legacy Index
    let legacyIndex: LegacyDeploymentObject = undefined
    if (includeLegacy) {
      legacyIndex = this._buildLegacyIndex(deploymentsDir)
    }

    // Remote Index
    this._rebuildIndex(
      deploymentsDir,
      indexDir,
      this.RemoteExportsFileName,
      [ProviderTypes.Hardhat, ProviderTypes.Ganache],
      DirectoryFilterType.Exclude,
      (deployment) => !deployment.config.includes(this.DbSeedsConfigString),
      legacyIndex,
    )

    // Local Index
    this._rebuildIndex(
      deploymentsDir,
      indexDir,
      this.LocalExportsFileName,
      [ProviderTypes.Hardhat, ProviderTypes.Ganache],
      DirectoryFilterType.Include,
      (deployment) => !deployment.config.includes(this.DbSeedsConfigString),
    )

    // DbSeeds Index
    this._rebuildIndex(
      deploymentsDir,
      indexDir,
      this.DbSeedsExportsFileName,
      [],
      DirectoryFilterType.None,
      (deployment) => deployment.config.includes(this.DbSeedsConfigString),
    )
  }

  /**
    GETTERS
   */
  public static getDeployments(): Deployment[] {
    return this.deployments
  }

  public static getDeploymentTypeFromName(name: string): DeploymentType {
    const [provider, network, config] = name.split(Deployments.DeploymentTypeSeparator)

    if (!isProvider(provider)) {
      throw new Error(`Invalid provider in deployment type: ${provider}`)
    }
    if (!isNetwork(network)) {
      throw new Error(`Invalid network in deployment type: ${network}`)
    }

    return {
      provider: provider as Provider,
      network: network as Network,
      config: config as ConfigName,
    }
  }

  public static getDeploymentNameFromType(type: DeploymentType): string {
    return `${type.provider}${Deployments.DeploymentTypeSeparator}${type.network}${Deployments.DeploymentTypeSeparator}${type.config}`
  }

  public static getLegacyDeploymentNameFromType(type: DeploymentType): string {
    let deploymentName = ''

    if (type.provider === ProviderTypes.Remote) {
      deploymentName = type.network + Deployments.DeploymentTypeSeparator + type.config
    } else if (type.provider === ProviderTypes.Internal) {
      deploymentName = 'hardhat'
    } else {
      deploymentName = 'localhost' + Deployments.DeploymentTypeSeparator + type.config
    }
    return deploymentName
  }

  public static getType(): DeploymentType {
    return this.type
  }

  public static getOptions(): DeploymentOptions {
    return this.options
  }

  public static getDeploymentsDir(): string | undefined {
    return this.deploymentsDir
  }

  public static getIndexDir(): string | undefined {
    return this.indexDir
  }

  public static getIndexFileName(): string | undefined {
    if (this.type.config.includes(Deployments.DbSeedsConfigString)) {
      return Deployments.DbSeedsExportsFileName
    } else if (this.type.provider === ProviderTypes.Remote) {
      return Deployments.RemoteExportsFileName
    } else if (
      this.type.provider === ProviderTypes.Hardhat ||
      this.type.provider === ProviderTypes.Ganache
    ) {
      return Deployments.LocalExportsFileName
    } else {
      return undefined
    }
  }

  public static getDeploymentsName(timestamp: number | undefined = undefined): string {
    let deploymentsFileName = Deployments.getDeploymentNameFromType(this.type)
    const deploymentExtension = Deployments.DeploymentFileExtension

    if (timestamp) {
      deploymentsFileName += `${Deployments.DeploymentTypeSeparator}` + String(timestamp)
    }

    return deploymentsFileName + deploymentExtension
  }

  public static getDeploymentsPath(timestamp: number | undefined = undefined): string {
    if (this.deploymentsDir === undefined) {
      return ''
    }

    const deploymentsDir = this.deploymentsDir
    const providerDir = `${this.type.provider}`
    const deploymentsFileName = this.getDeploymentsName(timestamp)

    return resolve(deploymentsDir, providerDir, deploymentsFileName)
  }

  public static getLegacyDeploymentsName(timestamp: number | undefined = undefined): string {
    const deploymentExtension = Deployments.LegacyDeploymentFileExtension

    let deploymentsPath = ''
    if (
      this.type.network === DeploymentNetwork.Develop &&
      this.type.provider === ProviderTypes.Internal
    ) {
      deploymentsPath = 'hardhat'
    } else if (this.type.provider === ProviderTypes.Remote) {
      deploymentsPath =
        this.type.network + Deployments.DeploymentTypeSeparator + `${this.type.config}`
    } else {
      deploymentsPath = `localhost` + Deployments.DeploymentTypeSeparator + `${this.type.config}`
    }

    if (timestamp) {
      deploymentsPath += `${Deployments.DeploymentTypeSeparator}` + String(timestamp)
    }

    return deploymentsPath + deploymentExtension
  }

  public static getLegacyDeploymentsPath(timestamp: number | undefined = undefined): string {
    if (this.deploymentsDir === undefined) {
      return ''
    }

    const deploymentsDir = this.deploymentsDir
    const deploymentsFileName = this.getLegacyDeploymentsName(timestamp)

    return resolve(deploymentsDir, deploymentsFileName)
  }

  public static retrieveDeployments() {
    const deploymentsPath = this.getDeploymentsPath()
    const legacyDeploymentsPath = this.getLegacyDeploymentsPath()

    if (existsSync(deploymentsPath)) {
      return JSON.parse(readFileSync(deploymentsPath, 'utf-8'))
    } else if (existsSync(legacyDeploymentsPath)) {
      return JSON.parse(readFileSync(legacyDeploymentsPath, 'utf-8'))
    } else {
      return undefined
    }
  }

  /**
    PRIVATE
   */
  private static _writeIndex(
    indexDir: string,
    indexFileName: string,
    imports: ImportPair[],
    indexObject: DeploymentExportPair[],
    legacyIndex?: LegacyDeploymentObject,
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

    if (legacyIndex) {
      // Remove already exported keys
      indexObject.forEach((deploymentExport) => {
        if (legacyIndex[deploymentExport.name]) {
          delete legacyIndex[deploymentExport.name]
        }
      })

      const objectString = JSON.stringify(legacyIndex, null, 2)

      fs.appendFileSync(indexFilePath, `\n  ${objectString.slice(4, -2)},`, 'utf8')
    }

    fs.appendFileSync(indexFilePath, `\n};\n`, 'utf8')
  }

  private static async _deploy(
    contractName: string,
    args: unknown[] = [],
    options: DeploymentOptions,
    alias?: string,
    overrides: (Signer | FactoryOptions) | undefined = undefined,
    proxyOptions: DeployProxyOptions | undefined = undefined,
  ): Promise<Deployment> {
    let contract: Contract
    let receipt: ContractTransactionReceipt

    try {
      const contractFactory = await ethers.getContractFactory(contractName, overrides)
      if (this._hasUpgradeableOption(options)) {
        contract = await upgrades.deployProxy(contractFactory, args, proxyOptions)
      } else {
        contract = await contractFactory.deploy(...args)
      }

      const deploymentTx = await contract.deploymentTransaction()
      if (!deploymentTx) {
        throw new Error('Deployment transaction not found')
      }

      const deploymentReceipt = await deploymentTx.wait()
      if (!deploymentReceipt) {
        throw new Error('Deployment receipt not found')
      }

      receipt = deploymentReceipt
    } catch (error) {
      throw new Error(`Error deploying contract ${contractName}: ` + error)
    }

    const address = await contract.getAddress()

    return {
      contract,
      address,
      name: alias || contractName,
      receipt,
    }
  }

  private static async _deployMock(
    contractName: string,
    args: unknown[] = [],
    alias?: string,
  ): Promise<Deployment> {
    let contract: MockContract<Contract>
    let receipt: ContractTransactionReceipt

    try {
      const contractFactory = await smock.mock(contractName)

      contract = (await contractFactory.deploy(...args)) as MockContract<Contract>

      const tx = await contract.deploymentTransaction()
      if (!tx) {
        throw new Error('Deployment transaction not found')
      }

      const txReceipt = await tx.wait()
      if (!txReceipt) {
        throw new Error('Deployment receipt not found')
      }

      receipt = txReceipt
    } catch (error) {
      throw new Error(`Error deploying contract ${contractName}: ` + error)
    }

    const address = await contract.getAddress()

    // Fund the mock wallet
    const amount = ethers.parseEther('10000')
    const hexAmount = ethers.stripZerosLeft(ethers.toBeHex(amount))

    await ethers.provider.send('hardhat_setBalance', [address, hexAmount])

    return {
      contract,
      address,
      name: alias || contractName,
      receipt,
    }
  }

  private static async _verify(
    deployment: Deployment,
    args: unknown[],
    options: DeploymentOptions,
  ) {
    const deployTransaction = (deployment.contract as Contract).deploymentTransaction()
    if (!deployTransaction) {
      throw new Error('Deployment transaction not found')
    }

    await deployTransaction.wait(Deployments.NumConfirmationsWait)

    let address: string
    let parameters: unknown[]

    if (this._hasUpgradeableOption(options)) {
      const proxyAddress = await deployment.contract.getAddress()
      address = await getImplementationAddress(ethers.provider, proxyAddress)
      parameters = []
    } else {
      address = await deployment.contract.getAddress()
      parameters = args
    }

    try {
      await verify(address, parameters)
    } catch (error) {
      console.log('Error verifying contract: ' + error)
    }
  }

  private static _cycleDeploymentFile(): void {
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

  private static _rebuildIndex(
    deploymentsDir: string,
    indexDir: string,
    indexFileName: string,
    directoriesList: string[],
    filterType: DirectoryFilterType,
    canInclude: (deployment: DeploymentObject) => boolean,
    extraIndex: LegacyDeploymentObject = undefined,
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
          (fileName) =>
            fileName.endsWith(Deployments.DeploymentFileExtension) && !/\.\d+\.json/.test(fileName),
        )

      // Read the contents of each file
      deploymentFiles.forEach((deploymentFile) => {
        const deploymentFilePath = resolve(deploymentDirPath, deploymentFile)
        const deploymentJSON = fs.readFileSync(deploymentFilePath, 'utf8')
        const deployment: DeploymentObject = JSON.parse(deploymentJSON)

        const deploymentTypeName = Deployments.getDeploymentNameFromType(deployment)

        if (canInclude(deployment)) {
          const importName = toCamelCase(deploymentTypeName, this.DeploymentTypeSeparator).replace(
            /-/g,
            '_',
          )

          indexImports.push({
            name: importName,
            path: path.relative(indexDir, deploymentFilePath),
          })

          deploymentsIndex.push({
            name: `${deployment.network}${this.DeploymentTypeSeparator}${deployment.config}`,
            value: importName,
          })
        }
      })
    })

    this._writeIndex(indexDir, indexFileName, indexImports, deploymentsIndex, extraIndex)
  }

  private static _buildLegacyIndex(deploymentsDir: string): LegacyDeploymentObject {
    let legacyIndex = {}

    const legacyFiles = fs
      .readdirSync(deploymentsDir)
      .filter(
        (fileName) =>
          fileName.endsWith(Deployments.LegacyDeploymentFileExtension) && !/\d/.test(fileName),
      )

    legacyFiles.forEach((legacyFile) => {
      const legacyFilePath = resolve(deploymentsDir, legacyFile)
      const legacyDeploymentJSON = fs.readFileSync(legacyFilePath, 'utf8')
      const legacyDeployment = JSON.parse(legacyDeploymentJSON)

      const legacyTypeName = path
        .basename(legacyFilePath)
        .replace(Deployments.LegacyDeploymentFileExtension, '')

      legacyIndex = Object.assign(legacyIndex, {
        [legacyTypeName]: legacyDeployment,
      })
    })

    return legacyIndex as LegacyDeploymentObject
  }

  private static _getLegacyDeploymentObjectTemplate(): DeploymentObjectLegacy {
    return {
      timestamp: this._getNowTimestamp(),
      network: this.type.network,
      contracts: {},
    }
  }

  private static _getDeploymentObjectTemplate(): DeploymentObject {
    return {
      timestamp: this._getNowTimestamp(),
      provider: this.type.provider,
      network: this.type.network,
      config: this.type.config,
      contracts: {},
      dependencies: {},
    }
  }

  private static _getDeploymentType(deployment: DeploymentObject): DeploymentType {
    return {
      provider: deployment.provider,
      network: deployment.network,
      config: deployment.config,
    }
  }

  private static _getNowTimestamp(): number {
    return Math.floor(new Date().getTime() / 1000)
  }

  private static _hasVerifyOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Verify ? true : false
  }

  private static _hasUpgradeableOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Upgradeable ? true : false
  }

  private static _hasMockOption(options?: DeploymentOptions): boolean {
    return options && options & DeploymentFlags.Mock ? true : false
  }

  private static _isDeploymentParams(
    options: Signer | DeploymentParams | DeployProxyOptions | undefined,
  ): options is DeploymentParams {
    return (
      options !== undefined &&
      ((options as DeploymentParams).options !== undefined ||
        (options as DeploymentParams).alias !== undefined)
    )
  }

  private static _isDevelopNetwork(): boolean {
    return this.type.network === DeploymentNetwork.Develop
  }

  private static _isInternalProvider(): boolean {
    return this.type.provider === ProviderTypes.Internal
  }
}
