import { IChainInfo, type IAddress, type ITokenAmount } from '@summerfi/sdk-common'
import { numberToHex } from 'viem'

export type ForkResponse = {
  id: string
  rpcs: { url: string; name: string }[]
}

export type Vnet = {
  getRpc: () => string
  fork: () => Promise<Vnet>
  delete: () => Promise<void>
  setErc20Balance: (params: { amount: ITokenAmount; walletAddress: IAddress }) => Promise<void>
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
  public exist: boolean = false

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
   * @name createFork
   * @description Creates a new Tenderly fork
   */
  async createFork(params: { chainInfo: IChainInfo; atBlock?: number | 'latest' }): Promise<Vnet> {
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
    this.exist = true

    return {
      getRpc: () => this.getRpc(data.rpcs),
      fork: async () => this.fork(data.id),
      delete: () => this.delete(data.id),
      setErc20Balance: (params: { amount: ITokenAmount; walletAddress: IAddress }) =>
        this.setErc20Balance(this.getRpc(data.rpcs), params),
    }
  }

  getRpc(rpcs: { url: string }[]): string {
    if (!this.exist) {
      throw new Error('Tenderly fork has been deleted')
    }
    if (!rpcs || rpcs.length === 0) {
      throw new Error('No RPCs available for the created Tenderly fork')
    }
    return rpcs[0].url
  }

  // delete fork
  async delete(forkId: string): Promise<void> {
    if (!this.exist) {
      throw new Error('Tenderly fork already deleted')
    }
    const { tenderlyApiUrl, tenderlyAccessKey } = this
    const res = await fetch(`${tenderlyApiUrl}/vnets`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Key': tenderlyAccessKey,
      },
      body: JSON.stringify({ vnet_ids: [forkId] }),
    })
    if (!res.ok) {
      throw new Error(`Failed to delete Tenderly fork: ${res.statusText}`)
    }
  }

  async fork(vnetId: string): Promise<Vnet> {
    if (!this.exist) {
      throw new Error('Tenderly fork has been deleted')
    }
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
    return {
      getRpc: () => this.getRpc(data.rpcs),
      fork: async () => this.fork(data.id),
      delete: () => this.delete(data.id),
      setErc20Balance: (params: { amount: ITokenAmount; walletAddress: IAddress }) =>
        this.setErc20Balance(this.getRpc(data.rpcs), params),
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
    if (!this.exist) {
      throw new Error('Tenderly fork has been deleted')
    }

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
}
