import { addressSchema } from '@summerfi/serverless-shared'
import { getSummerProtocolDB } from '@summerfi/summer-protocol-db'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const paramsSchema = z.object({
  walletAddress: addressSchema,
})

export async function GET(
  _request: NextRequest,
  { params }: { params: { walletAddress: string } },
) {
  const validatedParams = paramsSchema.parse(await params)
  const { walletAddress } = validatedParams

  const connectionString = process.env.EARN_PROTOCOL_DB_CONNECTION_STRING

  if (!connectionString) {
    return NextResponse.json(
      { error: 'Summer Protocol DB Connection string is not set' },
      { status: 500 },
    )
  }

  let dbInstance: Awaited<ReturnType<typeof getSummerProtocolDB>> | undefined

  try {
    dbInstance = await getSummerProtocolDB({
      connectionString,
    })

    const latestActivity = await dbInstance.db
      .selectFrom('latestActivity')
      .select('userAddress')
      .where('userAddress', '=', walletAddress.toLowerCase())
      .executeTakeFirst()

    if (!latestActivity) {
      return NextResponse.json({ isNewUser: true })
    }

    return NextResponse.json({ isNewUser: false })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching latest activity' }, { status: 500 })
  } finally {
    if (dbInstance?.db) {
      await dbInstance.db.destroy()
    }
  }
}
