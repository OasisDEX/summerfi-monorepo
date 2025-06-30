import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'

const getDbInstance = async () => {
  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING
  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  if (!connectionString) {
    throw new Error('EARN_PROTOCOL_DB_CONNECTION_STRING is not set')
  }

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })
  } catch (error) {
    console.error('Error connecting to the database:', error)

    throw new Error('Failed to connect to the database')
  }

  return dbInstance
}

/**
 * Checks if the given wallet address is an OKX wallet (that went through the campaign page)
 * @param address - The address of the wallet to check
 * @returns {boolean} - True if the wallet is an OKX wallet, false otherwise
 */
export const isOkxCampaignWallet = async (address: string): Promise<boolean> => {
  const dbInstance = await getDbInstance()

  try {
    const getOkxWalletData = await dbInstance.db
      .selectFrom('campaigns')
      .selectAll()
      .where('userAddress', '=', address.toLowerCase())
      .executeTakeFirst()

    return Boolean(getOkxWalletData?.campaign === 'okx')
  } catch (error) {
    console.error('Error fetching OKX wallet data:', error)

    return false
  } finally {
    await dbInstance.db.destroy()
  }
}
