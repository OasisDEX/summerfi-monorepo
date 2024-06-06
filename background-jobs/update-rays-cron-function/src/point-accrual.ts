import {
  MigrationEvent,
  Position,
  RecentSwapInPosition,
  RecentSwapInUser,
  START_POINTS_TIMESTAMP,
  SummerPointsSubgraphClient,
  User,
  UsersData,
} from '@summerfi/summer-events-subgraph'
import { Logger } from '@aws-lambda-powertools/logger'
export type PositionPointsItem = {
  positionId: string
  vaultId: number
  user: string
  protocol: string
  marketId: string
  positionCreated: number
  points: {
    openPositionsPoints: number
    migrationPoints: number
    swapPoints: number
  }
  netValue: number
  multipliers: {
    protocolBoostMultiplier: number
    swapMultiplier: number
    timeOpenMultiplier: number
    automationProtectionMultiplier: number
    lazyVaultMultiplier: number
  }
}
export type PositionPoints = {
  positionId: string
  vaultId: number
  user: string
  protocol: string
  marketId: string
  positionCreated: number
  points: {
    openPositionsPoints: number
    migrationPoints: number
    swapPoints: number
  }
  netValue: number
  multipliers: {
    protocolBoostMultiplier: number
    swapMultiplier: number
    timeOpenMultiplier: number
    automationProtectionMultiplier: number
    lazyVaultMultiplier: number
  }
}[]

/**
 * Service for fetching summer features.
 */
export class SummerPointsService {
  private SECONDS_PER_YEAR = 365 * 24 * 60 * 60
  private SECONDS_PER_DAY = 86400

  private MIGRATION_POINTS_FRACTION = 0.2
  private CORRELATED_SWAP_POINTS_FRACTION = 0.06
  private UNCORRELATED_SWAP_POINTS_FRACTION = 0.2
  private NET_VALUE_MULTIPLIER_THRESHOLD = 5000

  private AUTOMATION_OPTIMISATION_MULTIPLIER = 1.5
  private AUTOMATION_PROTECTION_MULTIPLIER = 1.1

  private NET_VALUE_CAP = 10000000

  /**
   * Creates an instance of SummerPointsService.
   * @param clients - An array of clients for fetching data from the summer points subgraph.
   * @param logger - The logger instance.
   */
  constructor(
    private clients: SummerPointsSubgraphClient[],
    private logger: Logger,
  ) {}

  async accruePoints(startTimestamp: number, endTimestamp: number): Promise<PositionPoints> {
    const results = await Promise.all(
      this.clients.map((client) => client.getUsersPoints({ startTimestamp, endTimestamp })),
    )

    const usersMap: Record<string, User> = {}

    results.forEach((result) => {
      result.users.forEach((user) => {
        if (!usersMap[user.id]) {
          // If the user doesn't exist in the map, add them
          usersMap[user.id] = user
        } else {
          // If the user does exist, merge the data
          usersMap[user.id].positions = [...usersMap[user.id].positions, ...user.positions]
          usersMap[user.id].swaps = [...usersMap[user.id].swaps, ...user.swaps]
        }
      })
    })

    return this.getBasisPointsForUsers(Object.values(usersMap), startTimestamp, endTimestamp)
  }

  /**
   * Calculates the points per USD per year based on the given USD amount.
   * @param usdAmount - The USD amount for which to calculate the points.
   * @returns The points per USD per year.
   */
  getPointsPerUsdPerYear(usdAmount: number): number {
    const a = 1.0005
    const b = 0.99999
    const c = 138.1456715
    const d = 1
    const x0 = 10000
    const frac = 2000
    return usdAmount <= x0 ? Math.pow(a * b, usdAmount) / frac : (c * Math.pow(d, usdAmount)) / frac
  }

  /**
   * Calculates the total points earned over a given period of time, based on the amount and period in seconds.
   * @param _amount - The amount used to calculate the points. It will be capped at 10,000,000.
   * @param periodInSeconds - The period of time in seconds.
   * @returns The total points earned over the given period of time.
   */
  private getPointsPerPeriodInSeconds(_amount: number, periodInSeconds: number) {
    const amount = Math.min(_amount, this.NET_VALUE_CAP)
    const pointsPerSecond = this.getPointsPerUsdPerSecond(amount)
    return pointsPerSecond * periodInSeconds * amount
  }

  /**
   * Calculates the points per USD per second.
   *
   * @param usdAmount - The amount in USD.
   * @returns The points per USD per second.
   */
  private getPointsPerUsdPerSecond(usdAmount: number): number {
    return this.getPointsPerUsdPerYear(usdAmount) / this.SECONDS_PER_YEAR
  }

  /**
   * Calculates the swap multiplier based on the number of swaps.
   * @param swaps - An array of swap objects containing a timestamp.
   * @returns The swap multiplier.
   */
  getSwapMultiplier(swaps: unknown[]): number {
    const swapCount = swaps.length
    if (swapCount > 25) {
      return 5
    } else if (swapCount > 10) {
      return 2
    } else if (swapCount > 5) {
      return 1.5
    } else {
      return 1
    }
  }

  /**
   * Calculates the multiplier for the lazy vault based on the given position.
   * If the position has a lazy vault trigger, the multiplier is 1.2, otherwise it is 1.
   *
   * @param position - The position to calculate the multiplier for.
   * @returns The multiplier for the lazy vault.
   */
  getLazyVaultMultiplier(position: Position): number {
    const hasLazyVault = position.protocol === 'erc4626'
    return hasLazyVault ? 1.2 : 1
  }

  /**
   * Calculates the basis points earned by users for a given time period.
   * @param usersData - The data of the users.
   * @param startTimestamp - The start timestamp of the time period.
   * @param endTimestamp - The end timestamp of the time period.
   * @returns The basis points earned by users.
   */
  getBasisPointsForUsers(
    users: UsersData,
    startTimestamp: number,
    endTimestamp: number,
  ): PositionPoints {
    const pointsEarned = users.map((user) => {
      const swapMultiplier = this.getSwapMultiplier(user.swaps)
      const protocolBoostMultiplier = this.getNetValueMutliplier(user)
      const closedPositionsPoints = this.getClosedPositionSwapPoints(
        user,
        protocolBoostMultiplier,
        swapMultiplier,
      )

      const openPositionsPoints = user.positions.map((position) => {
        const openPositionsPoints = this.getOpenPositionsPoints(
          startTimestamp,
          position,
          endTimestamp,
        )
        const migrationPoints = this.getMigrationPoints(position.migration)
        const swapPoints = swapMultiplier * this.getSwapPoints(position.recentSwaps)

        const timeOpenMultiplier = this.getTimeOpenMultiplier(position, endTimestamp)
        const automationProtectionMultiplier = this.getAutomationProtectionMultiplier(position)
        const lazyVaultMultiplier = this.getLazyVaultMultiplier(position)
        const totalMultiplier =
          protocolBoostMultiplier *
          timeOpenMultiplier *
          automationProtectionMultiplier *
          lazyVaultMultiplier

        return {
          vaultId: position.account.vaultId,
          positionId: position.id,
          protocol: position.protocol,
          marketId: position.marketId,
          positionCreated:
            position.firstEvent[0] && position.firstEvent[0].timestamp
              ? position.firstEvent[0].timestamp
              : START_POINTS_TIMESTAMP,
          user: user.id,
          points: {
            openPositionsPoints: totalMultiplier * openPositionsPoints,
            migrationPoints: migrationPoints,
            swapPoints: swapPoints,
          },
          netValue: position.netValue,
          multipliers: {
            protocolBoostMultiplier,
            swapMultiplier,
            timeOpenMultiplier,
            automationProtectionMultiplier,
            lazyVaultMultiplier,
          },
        }
      })
      return closedPositionsPoints.concat(openPositionsPoints)
    })

    return pointsEarned
      .flat()
      .sort((a, b) => b.points.openPositionsPoints - a.points.openPositionsPoints)
  }

  /**
   * Calculates the closed position swap points for a user.
   *
   * @remarks The closed position swap points are calculated based on the swaps that are not associated with open positions.
   *
   * @param user - The user object containing positions, swaps, and other relevant data.
   * @param protocolBoostMultiplier - The multiplier for protocol boost points.
   * @param swapMultiplier - The multiplier for swap points.
   * @returns An array of objects representing the closed position swap points.
   */
  private getClosedPositionSwapPoints(
    user: User,
    protocolBoostMultiplier: number,
    swapMultiplier: number,
  ) {
    const userSwaps = user.recentSwaps

    const idsOfUserOpenPositions = user.positions.map((position) => position.id)
    /* @dev filter out swaps that are related to an open position -> position in `user.positions` - this is enforced by `netValue_gt: 0` in subgraph query */
    const filteredSwaps = userSwaps.filter(
      (swap) => !swap.position || !idsOfUserOpenPositions.includes(swap.position.id),
    )
    // Group swaps by position id
    const swapsByPositionId = filteredSwaps.reduce(
      (acc, swap) => {
        const positionId = swap.position!.id
        if (!acc[positionId]) {
          acc[positionId] = []
        }
        acc[positionId].push(swap)
        return acc
      },
      {} as { [key: string]: (typeof filteredSwaps)[0][] },
    )

    const closedPositionsPoints = Object.entries(swapsByPositionId).map(([positionId, swaps]) => {
      const swapPoints = swapMultiplier * this.getSwapPoints(swaps)
      const swap = swaps[0] // Assuming all swaps for a position have the same position data

      return {
        positionId: positionId,
        vaultId: swap.position!.account.vaultId,
        protocol: swap.position!.protocol,
        marketId: swap.position!.marketId,
        positionCreated:
          swap.position!.firstEvent[0] && swap.position!.firstEvent[0].timestamp
            ? swap.position!.firstEvent[0].timestamp
            : START_POINTS_TIMESTAMP,
        user: user.id,
        points: {
          openPositionsPoints: 0,
          migrationPoints: 0,
          swapPoints: swapPoints,
        },
        netValue: swap.position!.netValue,
        multipliers: {
          protocolBoostMultiplier,
          swapMultiplier,
          timeOpenMultiplier: 1,
          automationProtectionMultiplier: 1,
          lazyVaultMultiplier: 1,
        },
      }
    })
    return closedPositionsPoints
  }

  /**
   * Calculates the points for open positions within a given time range.
   *
   * @remarks The points are calculated based on the net value of the position and the time range.
   * if there are no summer events, the points are calculated based on the net value of the position.
   * if thre are summer events - for each time range between events, the points are calculated based on the net value of the position before the event
   *
   * @param startTimestamp - The start timestamp of the time range.
   * @param position - The position object containing summer events and net value.
   * @param endTimestamp - The end timestamp of the time range.
   * @returns The total points for the open positions within the specified time range.
   */
  private getOpenPositionsPoints(startTimestamp: number, position: Position, endTimestamp: number) {
    let previousTimestamp = startTimestamp
    let openPositionsPoints = 0

    for (const event of position.summerEvents) {
      const timeDifference = event.timestamp - previousTimestamp
      openPositionsPoints += this.getPointsPerPeriodInSeconds(event.netValueBefore, timeDifference)
      previousTimestamp = event.timestamp
    }

    // Calculate points for the time period after the last event
    const timeDifference = endTimestamp - previousTimestamp
    openPositionsPoints += this.getPointsPerPeriodInSeconds(position.netValue, timeDifference)
    return openPositionsPoints
  }

  /**
   * Calculates the migration points based on the provided migration events.
   *
   * @remarks The migration points are calculated based on the net value after the migration event.
   *
   * @param events - An array of migration events.
   * @returns The total migration points.
   */
  getMigrationPoints(events: MigrationEvent[]): number {
    let migrationPoints = 0
    for (const event of events) {
      const pointsPerYear = this.getPointsPerPeriodInSeconds(
        event.netValueAfter,
        this.SECONDS_PER_YEAR,
      )
      migrationPoints += pointsPerYear * this.MIGRATION_POINTS_FRACTION
    }

    return migrationPoints
  }

  /**
   * Calculates the total swap points for the given array of recent swaps.
   *
   * @remarks The swap points are calculated based on the amount in USD of the swap and whether the assets are correlated.
   * @param swaps - An array of recent swaps.
   * @returns The total swap points.
   */
  getSwapPoints(swaps: RecentSwapInPosition[] | RecentSwapInUser[]): number {
    let points = 0
    for (const swap of swaps) {
      const pointsPerYear = this.getPointsPerPeriodInSeconds(
        swap.amountInUSD,
        this.SECONDS_PER_YEAR,
      )
      const isCorrelatedAsset = this.isCorrelatedAsset(swap.assetIn.symbol, swap.assetOut.symbol)
      const fraction = isCorrelatedAsset
        ? this.CORRELATED_SWAP_POINTS_FRACTION
        : this.UNCORRELATED_SWAP_POINTS_FRACTION
      points += pointsPerYear * fraction
    }
    return points
  }

  /**
   * Checks if two symbols are correlated.
   * @param symbolA - The first symbol.
   * @param symbolB - The second symbol.
   * @returns True if the symbols are correlated.
   */
  isCorrelatedAsset(symbolA: string, symbolB: string) {
    const correlatedAssetMatrix = [
      [
        'SUSDE',
        'USDE',
        'DAI',
        'USDT',
        'USDC',
        'PYUSD',
        'FRAX',
        'LUSD',
        'GUSD',
        'CRVUSD',
        'SDAI',
        'AETHSDAI',
        'AETHUSDC',
        'AETHUSDT',
        'AETHDAI',
        'AETHPYUSD',
        'AETHLUSD',
        'AUSDC',
        'ADAI',
        'AUSDT',
        'CUSDCV3',
        'CDAI',
        'CUSDC',
        'SUSD',
        'USDC.E',
        'GHO',
      ],
      [
        'WSTETH',
        'RETH',
        'CBETH',
        'STETH',
        'AETHWSTETH',
        'AETHWETH',
        'AETHRETH',
        'AETHCBETH',
        'ASETH',
        'AWETH',
        'CETH',
        'CWETHV3',
        'WEETH',
        'WETH',
        'WETH.E',
        'WETHV3',
        'WETHV2',
        'WETHV1',
        'ETH',
        'apxETH',
      ],
      ['WBTC', 'TBTC', 'AWBTC', 'AETHWBTC'],
      // Add more arrays here to expand the matrix in the future
    ]

    // Iterate over each row in the matrix
    for (let i = 0; i < correlatedAssetMatrix.length; i++) {
      // Check if both symbols are in the same row
      if (
        correlatedAssetMatrix[i].includes(symbolA.toUpperCase()) &&
        correlatedAssetMatrix[i].includes(symbolB.toUpperCase())
      ) {
        return true
      }
    }

    // If we haven't found both symbols in the same row, they're not correlated
    return false
  }

  /**
   * Calculates the time open multiplier based on the position's first event timestamp and the end timestamp.
   * @param position - The position object.
   * @param endTimestamp - The end timestamp.
   * @returns The time open multiplier.
   */
  getTimeOpenMultiplier(position: Position, endTimestamp: number): number {
    if (!position.firstEvent.length) {
      // there is one position with no first event, but it has net value
      // it's due to the fact it was opened in a safe multicall transaction
      // that included multiple summer.fi operations
      return 1
    }
    const firstEvent = position.firstEvent[0].timestamp
    const lastEvent = endTimestamp
    const effectiveStartTime = Math.max(firstEvent, START_POINTS_TIMESTAMP)

    const howLongWasPositionOpenBeforePointsStart = START_POINTS_TIMESTAMP - firstEvent
    let additionalMultiplier = 1
    if (howLongWasPositionOpenBeforePointsStart > 180 * this.SECONDS_PER_DAY) {
      additionalMultiplier = 1.3
    } else if (howLongWasPositionOpenBeforePointsStart > 90 * this.SECONDS_PER_DAY) {
      additionalMultiplier = 1.15
    } else if (howLongWasPositionOpenBeforePointsStart > 30 * this.SECONDS_PER_DAY) {
      additionalMultiplier = 1.05
    } else if (howLongWasPositionOpenBeforePointsStart > 0) {
      additionalMultiplier = 1.01
    }

    const elapsedTime = lastEvent - effectiveStartTime
    let multiplier = 1
    if (elapsedTime > 180 * this.SECONDS_PER_DAY) {
      multiplier = 2
    } else if (elapsedTime > 90 * this.SECONDS_PER_DAY) {
      multiplier = 1.5
    } else if (elapsedTime > 30 * this.SECONDS_PER_DAY) {
      multiplier = 1.2
    }
    return multiplier * additionalMultiplier
  }

  protectionKinds = ['stoploss', 'basicsell']
  optimisationKinds = ['takeprofit', 'basicbuy']

  /**
   * Calculates the automation protection multiplier based on the given position.
   *
   * 1.1 for protection
   * 1.5 for optimisation
   *
   * multipliers stack
   * @param position - The position for which to calculate the automation protection multiplier.
   * @returns The automation protection multiplier.
   */
  getAutomationProtectionMultiplier(position: Position): number {
    const hasProtectionTrigger = position.activeTriggers.some((trigger) =>
      this.protectionKinds.some((kind) => trigger.kind.toLowerCase().includes(kind.toLowerCase())),
    )
    const hasOptimisationTrigger = position.activeTriggers.some((trigger) =>
      this.optimisationKinds.some((kind) =>
        trigger.kind.toLowerCase().includes(kind.toLowerCase()),
      ),
    )

    let protectionMultiplier = 1
    if (hasProtectionTrigger) {
      protectionMultiplier *= this.AUTOMATION_PROTECTION_MULTIPLIER
    }
    if (hasOptimisationTrigger) {
      protectionMultiplier *= this.AUTOMATION_OPTIMISATION_MULTIPLIER
    }

    return protectionMultiplier
  }

  /**
   * Calculates the net value multiplier based on the user's positions.
   *
   * @remarks The net value multiplier is based on the number of protocols with cumulative net value per protocol above 5000$.
   * @param user - The user object containing positions.
   * @returns The net value multiplier.
   */
  getNetValueMutliplier(user: User): number {
    const protocolSums: Record<string, number> = {}

    user.positions.forEach((position) => {
      if (!protocolSums[position.protocol]) {
        protocolSums[position.protocol] = 0
      }
      protocolSums[position.protocol] += position.netValue
    })

    let eligibleProtocolCount = 0
    for (const protocol in protocolSums) {
      if (protocolSums[protocol] > this.NET_VALUE_MULTIPLIER_THRESHOLD) {
        eligibleProtocolCount++
      }
    }

    let protocolMultiplier
    switch (eligibleProtocolCount) {
      case 1:
        protocolMultiplier = 1
        break
      case 2:
        protocolMultiplier = 1.2
        break
      case 3:
        protocolMultiplier = 1.5
        break
      case 4:
        protocolMultiplier = 2
        break
      case 5:
        protocolMultiplier = 3
        break
      default:
        protocolMultiplier = 1
    }

    return protocolMultiplier
  }
}
