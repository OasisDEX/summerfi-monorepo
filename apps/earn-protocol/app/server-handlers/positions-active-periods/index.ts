import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

type ActivePeriod = {
  openTimestamp: string
  closeTimestamp: string | undefined
}

type PositionsActivePeriods = {
  [vaultId: string]: ActivePeriod[]
}

// Helper function to check if balance is effectively zero
const isBalanceZero = (balance: string): boolean => {
  const balanceNum = parseFloat(balance)

  return balanceNum === 0 || balanceNum < 0.000001 // Consider very small amounts as zero
}

export const getPositionsActivePeriods = async (walletAddress: string) => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('Summer Protocol DB Connection string is not set')
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })

    // get all the latest activity for the user
    const userLatestActivity = await dbInstance.db
      .selectFrom('latestActivity')
      .selectAll()
      .where('userAddress', '=', walletAddress)
      .orderBy('timestamp', 'asc')
      .execute()

    // now based on deposits & withdrawals get active periods
    // meaning search for the first deposit and the last withdrawal which resulted in
    // position having 0 balance
    const positionsActivePeriods: PositionsActivePeriods = {}

    // Group activities by vaultId
    const activitiesByVault = userLatestActivity.reduce<{
      [vaultId: string]: typeof userLatestActivity
    }>((acc, activity) => {
      if (!acc[activity.vaultId]) {
        acc[activity.vaultId] = []
      }
      acc[activity.vaultId].push(activity)

      return acc
    }, {})

    // Calculate active periods for each vault
    for (const [vaultId, activities] of Object.entries(activitiesByVault)) {
      //   console.log(`Processing vault ${vaultId} with ${activities.length} activities`)

      const activePeriods: ActivePeriod[] = []
      let runningBalance = 0
      let periodStart: string | null = null

      for (const activity of activities) {
        // console.log(
        //   `Activity: ${activity.actionType}, Amount: ${activity.amount}, Running Balance: ${runningBalance}, Timestamp: ${activity.timestamp}`,
        // )

        if (activity.actionType === 'deposit') {
          // If this is a deposit and we don't have an active period, start a new one
          if (periodStart === null) {
            // console.log(`Starting new period at timestamp ${activity.timestamp}`)
            periodStart = activity.timestamp
          }
          runningBalance += parseFloat(activity.amount)
        } else if (activity.actionType === 'withdraw') {
          runningBalance -= Math.abs(parseFloat(activity.amount)) // Withdrawals are negative amounts

          // If balance becomes 0 after withdrawal, close the current period
          if (isBalanceZero(runningBalance.toString()) && periodStart) {
            // console.log(`Closing period: ${periodStart} -> ${activity.timestamp}`)
            activePeriods.push({
              openTimestamp: periodStart,
              closeTimestamp: activity.timestamp,
            })
            periodStart = null // Reset for potential next period
          }
        }
      }

      // If there's an open period (user still has balance), leave closeTimestamp as undefined
      if (periodStart && !isBalanceZero(runningBalance.toString())) {
        // console.log(`Open period: ${periodStart} -> undefined`)
        activePeriods.push({
          openTimestamp: periodStart,
          closeTimestamp: undefined,
        })
      }

      //   console.log(`Vault ${vaultId} has ${activePeriods.length} periods:`, activePeriods)

      if (activePeriods.length > 0) {
        positionsActivePeriods[vaultId] = activePeriods
      }
    }

    return positionsActivePeriods
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching positions active periods:', error)

    return {}
  } finally {
    await dbInstance?.db.destroy()
  }
}
