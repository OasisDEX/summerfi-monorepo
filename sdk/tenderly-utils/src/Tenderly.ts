import { IChainInfo, type IAddress, type ITokenAmount } from '@summerfi/sdk-common'
import { numberToHex } from 'viem'

export type ForkResponse = {
  id: string
  slug: string
  display_name: string
  rpcs: { url: string; name: string }[]
}

export type Vnet = {
  getName: () => string
  getRpc: () => string
  fork: () => Promise<Vnet>
  delete: () => Promise<void>
  createSnapshot: () => Promise<string>
  revertSnapshot: (snapshotId: string) => Promise<void>
  setErc20Balance: (params: { amount: ITokenAmount; walletAddress: IAddress }) => Promise<void>
  setBalance: (params: { amount: ITokenAmount; walletAddress: IAddress }) => Promise<void>
}

/**
 * Class that offers utility functions for interacting with Tenderly, including sending transactions
 *
 * It makes use of different utilities across the repo to offer a unified experience
 */
export class Tenderly {
  public readonly tenderlyAccount: string
  public readonly tenderlySlug: string
  public readonly tenderlyApiUrl: string
  public readonly tenderlyAccessKey: string

  /** CONSTRUCTOR */
  constructor() {
    const { TENDERLY_USER, TENDERLY_PROJECT, TENDERLY_ACCESS_KEY } = process.env

    if (!TENDERLY_USER || !TENDERLY_PROJECT || !TENDERLY_ACCESS_KEY) {
      throw new Error('Tenderly environment variables not set')
    }

    this.tenderlyAccount = TENDERLY_USER
    this.tenderlySlug = TENDERLY_PROJECT
    this.tenderlyAccessKey = TENDERLY_ACCESS_KEY
    this.tenderlyApiUrl = `https://api.tenderly.co/api/v1/account/${this.tenderlyAccount}/project/${this.tenderlySlug}`
  }

  /**
   * @name createVnet
   * @description Creates a new Tenderly vnet
   */
  async createVnet(params: { chainInfo: IChainInfo; atBlock?: number | 'latest' }): Promise<Vnet> {
    console.log('Creating vnet...')
    const { tenderlyApiUrl, tenderlyAccessKey } = this
    // use fetch to tenderly API to create a /vnet, here are docs: https://docs.tenderly.co/reference/api#/operations/createVnet
    const res = await fetch(`${tenderlyApiUrl}/vnets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': tenderlyAccessKey,
      },
      body: JSON.stringify({
        network_id: params.chainInfo.chainId,
        block_number: params.atBlock ?? 'latest',
        slug: this.tenderlySlug,
        fork_config: { network_id: params.chainInfo.chainId },
        virtual_network_config: {
          chain_config: {
            chain_id: params.chainInfo.chainId,
          },
        },
        sync_state_config: {
          enabled: false,
        },
      }),
    })
    if (!res.ok) {
      throw new Error(`Failed to create Tenderly fork: ${res.statusText}`)
    }
    const data = (await res.json()) as ForkResponse
    console.log('Success: ' + data.display_name)

    return this.createVnetInstance(data)
  }

  private createVnetInstance(data: ForkResponse, isFork?: boolean): Vnet {
    let exist = true
    const assertVnetExist = (methodName: string): void => {
      if (!exist) {
        throw new Error(`Cannot call ${methodName}. Tenderly vnet does not exist.`)
      }
    }

    return {
      getName: () => {
        assertVnetExist('getName')
        return data.display_name
      },
      getRpc: () => {
        assertVnetExist('getRpc')
        return this.getRpc(data.rpcs)
      },
      fork: async () => {
        assertVnetExist('fork')
        const vnet = await this.fork(data.id)
        console.log('Forked vnet: ' + data.display_name + ' => ' + vnet.getName())
        return vnet
      },
      delete: async () => {
        assertVnetExist('delete')
        await this.delete(data.id)
        exist = false
        console.log(`Deleted vnet ${isFork ? 'fork' : ''}: ` + data.display_name)
      },
      createSnapshot: () => {
        console.log('Creating snapshot for vnet: ' + data.display_name)
        assertVnetExist('createSnapshot')
        return this.createSnapshot(this.getRpc(data.rpcs))
      },
      revertSnapshot: (snapshotId: string) => {
        console.log(`Reverting snapshot ${snapshotId} for vnet: ` + data.display_name)
        assertVnetExist('revertSnapshot')
        return this.revertSnapshot(this.getRpc(data.rpcs), snapshotId)
      },
      setErc20Balance: (params: { amount: ITokenAmount; walletAddress: IAddress }) => {
        console.log(
          `Setting ERC20 balance ${params.amount.toString()} for address ${params.walletAddress.value}...`,
        )
        assertVnetExist('setErc20Balance')
        return this.setErc20Balance(this.getRpc(data.rpcs), params)
      },
      setBalance: (params: { amount: ITokenAmount; walletAddress: IAddress }) => {
        console.log(
          `Setting native balance ${params.amount.toString()} for address ${params.walletAddress.value}...`,
        )
        assertVnetExist('setBalance')
        return this.setBalance(this.getRpc(data.rpcs), params)
      },
    }
  }

  getRpc(rpcs: { url: string }[]): string {
    if (!rpcs || rpcs.length === 0) {
      throw new Error('No RPCs available for the created Tenderly vnet')
    }
    return rpcs[0].url
  }

  async fork(vnetId: string): Promise<Vnet> {
    const { tenderlyApiUrl, tenderlyAccessKey } = this
    const res = await fetch(`${tenderlyApiUrl}/vnets/fork`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': tenderlyAccessKey,
      },
      body: JSON.stringify({ vnet_id: vnetId, wait: true }),
    })

    if (!res.ok) {
      throw new Error(`Failed to fork Tenderly vnet: ${res.statusText}`)
    }

    const data = (await res.json()) as ForkResponse

    return this.createVnetInstance(data, true)
  }

  // delete vnet
  async delete(vnetId: string): Promise<void> {
    const { tenderlyApiUrl, tenderlyAccessKey } = this
    const res = await fetch(`${tenderlyApiUrl}/vnets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': tenderlyAccessKey,
      },
      body: JSON.stringify({ vnet_ids: [vnetId] }),
    })
    if (!res.ok) {
      throw new Error(`Failed to delete Tenderly fork: ${res.statusText}`)
    }
  }

  async createSnapshot(rpc: string): Promise<string> {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'evm_snapshot',
        id: 1,
      }),
    })
    if (!res.ok) {
      throw new Error(`Failed to create Tenderly snapshot: ${res.statusText}`)
    }
    const data = (await res.json()) as { result: string }
    return data.result
  }

  async revertSnapshot(rpc: string, snapshotId: string): Promise<void> {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'evm_revert', params: [snapshotId], id: 1 }),
    })
    if (!res.ok) {
      throw new Error(`Failed to revert Tenderly snapshot: ${res.statusText}`)
    }
  }

  async setErc20Balance(
    rpc: string,
    {
      amount,
      walletAddress,
    }: {
      amount: ITokenAmount
      walletAddress: IAddress
    },
  ): Promise<void> {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tenderly_setErc20Balance',
        params: [
          amount.token.address.value,
          [walletAddress.value],
          numberToHex(amount.toSolidityValue()),
        ],
        id: 1,
      }),
    })
    if (!res.ok) {
      throw new Error(`Failed to set ERC20 balance: ${res.statusText}`)
    }
  }

  async setBalance(
    rpc: string,
    {
      amount,
      walletAddress,
    }: {
      amount: ITokenAmount
      walletAddress: IAddress
    },
  ): Promise<void> {
    const res = await fetch(rpc, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tenderly_setBalance',
        params: [walletAddress.value, numberToHex(amount.toSolidityValue())],
        id: 1,
      }),
    })
    if (!res.ok) {
      throw new Error(`Failed to set balance: ${res.statusText}`)
    }
  }
}
