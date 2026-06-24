import { IBlockchainClient } from '@summerfi/blockchain-client-common'
import { IProtocolAccessManagerV2Contract } from '@summerfi/contracts-provider-common'
import { IAddress, IChainInfo, type RwaRole, type TransactionInfo } from '@summerfi/sdk-common'
import { ContractWrapper } from '../ContractWrapper'

import { ProtocolAccessManagerV2Abi } from '@summerfi/armada-protocol-abis'

/**
 * @name ProtocolAccessManagerV2Contract
 * @description Implementation for the ProtocolAccessManagerV2 contract wrapper (per-context whitelist)
 * @implements IProtocolAccessManagerV2Contract
 */
export class ProtocolAccessManagerV2Contract<
  const TClient extends IBlockchainClient,
  TAddress extends IAddress,
>
  extends ContractWrapper<typeof ProtocolAccessManagerV2Abi, TClient, TAddress>
  implements IProtocolAccessManagerV2Contract
{
  /** FACTORY METHOD */

  /**
   * Creates a new instance of the ProtocolAccessManagerV2Contract
   *
   * @see constructor
   */
  static async create<TClient extends IBlockchainClient, TAddress extends IAddress>(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }): Promise<ProtocolAccessManagerV2Contract<TClient, TAddress>> {
    return new ProtocolAccessManagerV2Contract(params)
  }

  /** CONSTRUCTOR */
  private constructor(params: {
    blockchainClient: TClient
    chainInfo: IChainInfo
    address: TAddress
  }) {
    super(params)
  }

  /** METHODS */

  /** @see IContractWrapper.getAbi */
  getAbi() {
    return ProtocolAccessManagerV2Abi
  }

  /** READ METHODS */

  /** @see IProtocolAccessManagerV2Contract.isWhitelisted */
  async isWhitelisted(
    params: Parameters<IProtocolAccessManagerV2Contract['isWhitelisted']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['isWhitelisted']> {
    return this.contract.read.isWhitelisted([params.context.value, params.account.value])
  }

  /** @see IProtocolAccessManagerV2Contract.isWhitelistOpen */
  async isWhitelistOpen(
    params: Parameters<IProtocolAccessManagerV2Contract['isWhitelistOpen']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['isWhitelistOpen']> {
    return this.contract.read.isWhitelistOpen([params.context.value])
  }

  /** WRITE METHODS */

  /** @see IProtocolAccessManagerV2Contract.setWhitelisted */
  async setWhitelisted(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelisted']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelisted']> {
    return this._createTransaction({
      functionName: 'setWhitelisted',
      args: [params.context.value, params.account.value, params.allowed],
      description: `Set whitelist status of ${params.account.value} to ${params.allowed} for context ${params.context.value}`,
    })
  }

  /** @see IProtocolAccessManagerV2Contract.setWhitelistedBatch */
  async setWhitelistedBatch(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelistedBatch']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelistedBatch']> {
    return this._createTransaction({
      functionName: 'setWhitelistedBatch',
      args: [params.context.value, params.accounts.map((a) => a.value), params.allowed],
      description: `Set whitelist status for ${params.accounts.length} accounts for context ${params.context.value}`,
    })
  }

  /** @see IProtocolAccessManagerV2Contract.setWhitelistOpen */
  async setWhitelistOpen(
    params: Parameters<IProtocolAccessManagerV2Contract['setWhitelistOpen']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['setWhitelistOpen']> {
    return this._createTransaction({
      functionName: 'setWhitelistOpen',
      args: [params.context.value, params.isOpen],
      description: `Set whitelist open flag to ${params.isOpen} for context ${params.context.value}`,
    })
  }

  /** @see IProtocolAccessManagerV2Contract.grantRole */
  async grantRole(
    params: Parameters<IProtocolAccessManagerV2Contract['grantRole']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['grantRole']> {
    return this._createRoleTransaction('grant', params.role, params.account)
  }

  /** @see IProtocolAccessManagerV2Contract.revokeRole */
  async revokeRole(
    params: Parameters<IProtocolAccessManagerV2Contract['revokeRole']>[0],
  ): ReturnType<IProtocolAccessManagerV2Contract['revokeRole']> {
    return this._createRoleTransaction('revoke', params.role, params.account)
  }

  /**
   * Dispatches a grant/revoke to the matching typed on-chain wrapper. `ProtocolAccessManager` disables
   * OZ's generic grantRole/revokeRole, so each role maps to its own function: global roles take
   * `(account)`, contract-specific roles take `(target, account)`. The function name is computed, so it
   * and its args are cast at the `_createTransaction` boundary (viem can't correlate a computed name).
   */
  private _createRoleTransaction(
    action: 'grant' | 'revoke',
    role: RwaRole,
    account: IAddress,
  ): Promise<TransactionInfo> {
    const roleSuffix: Record<RwaRole['kind'], string> = {
      GOVERNOR: 'GovernorRole',
      SUPER_KEEPER: 'SuperKeeperRole',
      GUARDIAN: 'GuardianRole',
      DECAY_CONTROLLER: 'DecayControllerRole',
      ADMIRALS_QUARTERS: 'AdmiralsQuartersRole',
      FOUNDATION: 'FoundationRole',
      WHITELIST_MANAGER: 'WhitelistManagerRole',
      KEEPER: 'KeeperRole',
      CURATOR: 'CuratorRole',
      COMMANDER: 'CommanderRole',
      OPERATOR: 'OperatorRole',
    }
    const functionName = `${action}${roleSuffix[role.kind]}`
    // Contract-specific roles take (target, account); global roles take (account).
    const args = 'target' in role ? [role.target, account.value] : [account.value]
    const targetSuffix = 'target' in role ? ` on ${role.target}` : ''
    return this._createTransaction({
      functionName: functionName as never,
      args: args as never,
      description: `${action === 'grant' ? 'Grant' : 'Revoke'} ${role.kind} role ${
        action === 'grant' ? 'to' : 'from'
      } ${account.value}${targetSuffix}`,
    })
  }
}
