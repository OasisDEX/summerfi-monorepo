import { GraphQLClient } from 'graphql-request'
import {
  GetAccountsWithHourlySnapshotsQuery,
  GetReferredAccountsQuery,
  ValidatePositionsQuery,
} from './generated/graphql'
import {
  ACCOUNTS_WITH_HOURLY_SNAPSHOTS_QUERY,
  REFERRED_ACCOUNTS_QUERY,
  VALIDATE_POSITIONS_QUERY,
} from './graphql/operations'
import { Account, convertAccount, Network, SUPPORTED_CHAINS, SupportedChain } from './types'

const SUBGRAPH_URLS: Record<SupportedChain, string> = {
  [Network.MAINNET]: 'https://subgraph.staging.oasisapp.dev/summer-protocol',
  [Network.ARBITRUM]: 'https://subgraph.staging.oasisapp.dev/summer-protocol-arbitrum',
  [Network.BASE]: 'https://subgraph.staging.oasisapp.dev/summer-protocol-base',
  [Network.SONIC]: 'https://subgraph.staging.oasisapp.dev/summer-protocol-sonic',
}

export interface ReferredAccountsOptions {
  timestampGt?: string
  timestampLt?: string
}

export interface PaginationOptions {
  first: number
  lastId?: string
}

export interface HourlySnapshotOptions {
  timestampGt: bigint
  timestampLt: bigint
}

export class ReferralClient {
  private clients: Record<SupportedChain, GraphQLClient>

  constructor() {
    this.clients = SUPPORTED_CHAINS.reduce(
      (acc, chain) => {
        acc[chain] = new GraphQLClient(SUBGRAPH_URLS[chain])
        return acc
      },
      {} as Record<SupportedChain, GraphQLClient>,
    )
  }

  async getReferredAccounts(
    chain: SupportedChain,
    options: ReferredAccountsOptions = {},
  ): Promise<Account[]> {
    try {
      const data = await this.clients[chain].request<GetReferredAccountsQuery>(
        REFERRED_ACCOUNTS_QUERY,
        options,
      )
      return data.accounts.filter(Boolean).map((a) => convertAccount(a as any)) as Account[]
    } catch (error) {
      console.error(`Error fetching referred accounts from ${chain}:`, error)
      return []
    }
  }

  // New method to get accounts with hourly snapshots for specific time range
  async getAccountsWithHourlySnapshots(
    chain: SupportedChain,
    accountIds: string[],
    pagination: PaginationOptions,
    snapshotOptions: HourlySnapshotOptions,
  ): Promise<Account[]> {
    try {
      const lowercasedIds = accountIds.map((id) => id.toLowerCase())
      const variables: any = {
        accountIds: lowercasedIds,
        first: pagination.first,
        timestampGt: snapshotOptions.timestampGt.toString(),
        timestampLt: snapshotOptions.timestampLt.toString(),
      }
      if (pagination.lastId) {
        variables.lastId = pagination.lastId
      } else {
        variables.lastId = ''
      }

      const data = await this.clients[chain].request<GetAccountsWithHourlySnapshotsQuery>(
        ACCOUNTS_WITH_HOURLY_SNAPSHOTS_QUERY,
        variables,
      )
      return data.accounts.filter(Boolean).map((a) => convertAccount(a)) as Account[]
    } catch (error) {
      console.error(`Error fetching accounts with hourly snapshots from ${chain}:`, error)
      return []
    }
  }

  /**
   * Validates positions for a set of accounts on a specific chain to ensure they comply with referral rules.
   *
   * This method checks if accounts have valid positions based on the following criteria:
   * 1. If an account has positions created before their referral timestamp, it's considered invalid
   * 2. The referral timestamp is determined by the earliest referral timestamp across all chains
   * 3. Accounts with positions created after their referral timestamp are considered valid
   *
   * @param chain - The blockchain network to validate positions on
   * @param accounts - A map of account IDs to their Account objects containing referral data
   * @returns A map of account IDs to boolean values indicating whether their positions are valid
   *          (true = valid, false = invalid)
   *
   * @example
   * ```typescript
   * const accounts = {
   *   '0x123': { referralTimestamp: '1234567890', ... },
   *   '0x456': { referralTimestamp: '1234567891', ... }
   * };
   * const validations = await client.validateAccounts('ethereum', accounts);
   * // Returns: { '0x123': true, '0x456': false }
   * ```
   */
  async validateAccounts(
    chain: SupportedChain,
    accounts: { [accountId: string]: Account },
  ): Promise<{ [accountId: string]: boolean }> {
    try {
      const lowercasedIds = Object.keys(accounts).map((accountId) => accountId.toLowerCase())
      const data = await this.clients[chain].request<ValidatePositionsQuery>(
        VALIDATE_POSITIONS_QUERY,
        {
          accountIds: lowercasedIds,
        },
      )

      const result: { [accountId: string]: boolean } = {}
      for (const account of data.accounts) {
        const earliestReferralTimestamp = accounts[account.id].referralTimestamp

        // Define validation conditions as named constants for clarity
        const hasPositions = account.positions.length > 0
        const hasEarliestReferralTimestamp = Boolean(earliestReferralTimestamp)
        const hasReferralTimestamp = Boolean(account.referralTimestamp)
        const positionsCreatedBeforeReferral =
          hasPositions &&
          hasEarliestReferralTimestamp &&
          Number(account.positions[0].createdTimestamp) < Number(earliestReferralTimestamp)
        const wasReferredEarlierThanCurrentPeriod =
          hasEarliestReferralTimestamp &&
          hasReferralTimestamp &&
          Number(earliestReferralTimestamp) > Number(account.referralTimestamp)

        // An account is invalid if:
        // 1. It has a referral timestamp AND positions created before referral, OR
        // 2. It was referred earlier than the current period being processed, OR
        // 3. It has no referral timestamp (shouldn't be in results)
        const isInvalid =
          (hasEarliestReferralTimestamp && positionsCreatedBeforeReferral) ||
          wasReferredEarlierThanCurrentPeriod

        result[account.id] = !isInvalid
      }
      return result
    } catch (error) {
      console.error(`Error validating positions from ${chain}:`, error)
      return {}
    }
  }

  // Method to get all positions with hourly snapshots for valid accounts
  async getAllPositionsWithHourlySnapshots(
    accountIds: string[],
    snapshotOptions: HourlySnapshotOptions,
  ): Promise<{ [chain: string]: Account[] }> {
    const result: { [chain: string]: Account[] } = {}

    for (const chain of SUPPORTED_CHAINS) {
      const allAccounts: Account[] = []
      let lastId: string | undefined
      const batchSize = 50
      // Paginate through accounts
      while (true) {
        const accounts = await this.getAccountsWithHourlySnapshots(
          chain,
          accountIds,
          {
            first: batchSize,
            lastId,
          },
          snapshotOptions,
        )
        if (accounts.length === 0) break

        allAccounts.push(...accounts)

        if (accounts.length < batchSize) break

        lastId = accounts[accounts.length - 1].id
      }

      result[chain] = allAccounts
    }

    return result
  }

  /**
   * Gets a list of valid accounts that were referred in a specific time period.
   * This method validates accounts across all chains and ensures they meet all referral criteria.
   *
   * The process consists of four main steps:
   * 1. Fetches referred accounts from all chains (Ethereum, Sonic, Arbitrum, Base) for the specified time period
   * 2. Consolidates accounts across chains, keeping the earliest referral timestamp for each account
   * 3. Validates positions across all chains to ensure accounts haven't created positions before being referred
   * 4. Validates if the account was not referred before the currently processed time period
   *
   * Time period handling:
   * - For first run (isFirstRun=true): Only uses timestampLt to get all historical data up to that point
   * - For subsequent runs: Uses both timestampGt and timestampLt to process the specified time period
   *
   * @param timestampGt - The start timestamp of the period (in seconds since epoch)
   * @param timestampLt - The end timestamp of the period (in seconds since epoch)
   * @param isFirstRun - Whether this is the first run of the processor
   * @returns Object containing an array of valid account IDs that passed all validation checks
   *
   * @example
   * ```typescript
   * // First run - process all historical data up to now
   * const { validAccountIds } = await client.getValidReferredAccounts(
   *   undefined,
   *   BigInt(Math.floor(Date.now() / 1000)),
   *   true
   * );
   *
   * // Process a specific time period
   * const periodStart = BigInt(Math.floor(Date.now() / 1000) - 3600); // 1 hour ago
   * const periodEnd = BigInt(Math.floor(Date.now() / 1000));
   * const { validAccountIds } = await client.getValidReferredAccounts(
   *   periodStart,
   *   periodEnd,
   *   false
   * );
   * ```
   *
   * Note: This method is designed to work with any time period because:
   * 1. It processes referral data in time-bound chunks
   * 2. It validates positions against referral timestamps
   * 3. It ensures no positions were created before referral across all chains
   * 4. It verifies that accounts weren't referred before the current period
   *
   * The time period approach is safe because:
   * - It maintains data consistency by processing complete time periods
   * - It prevents double-counting by using timestamp boundaries
   * - It allows for efficient backfilling of historical data
   * - It ensures all chains are synchronized in their validation
   */
  async getValidReferredAccounts(
    timestampGt: bigint,
    timestampLt: bigint,
  ): Promise<{ validAccounts: Account[] }> {
    const allAccts: Account[] = []

    // Step 1: Get all referred accounts from all chains
    for (const chain of SUPPORTED_CHAINS) {
      const options: ReferredAccountsOptions = {
        timestampGt: timestampGt.toString(),
        timestampLt: timestampLt.toString(),
      }

      const accounts = await this.getReferredAccounts(chain, options)
      const accountsWithChain = accounts.map((a) => ({
        ...a,
        referralChain: chain,
      }))
      allAccts.push(...accountsWithChain)
    }

    // Step 2: Get all referred accounts from all chains - keep only the earliest referral timestamp
    allAccts.sort((a, b) => Number(a.referralTimestamp) - Number(b.referralTimestamp))

    const allReferredAccounts = allAccts.reduce(
      (acc, account) => {
        if (!acc[account.id]) {
          acc[account.id] = account
        } else {
          if (Number(account.referralTimestamp) < Number(acc[account.id].referralTimestamp)) {
            acc[account.id] = account
          }
        }
        return acc
      },
      {} as { [id: string]: Account },
    )

    // Step3: Validate accounts across all chains (check if they have positions created before earliest referral timestamp)
    const validationResults: { [accountId: string]: boolean } = {}
    for (const chain of SUPPORTED_CHAINS) {
      const chainValidation = await this.validateAccounts(chain, allReferredAccounts)
      Object.entries(chainValidation).forEach(([accountId, isValid]) => {
        if (validationResults[accountId] === undefined) {
          validationResults[accountId] = isValid
        } else {
          // Account is valid only if it's valid on ALL chains
          validationResults[accountId] = validationResults[accountId] && isValid
        }
      })
    }

    return {
      validAccounts: Object.values(allReferredAccounts).filter(
        (account) => validationResults[account.id],
      ),
    }
  }
}
