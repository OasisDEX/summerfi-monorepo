import { selectVaultsFollowedByAddress } from 'handlers/follow/follow'
import { prisma } from 'helpers/prisma-client'
import type { NextApiRequest, NextApiResponse } from 'next'
import * as z from 'zod'

const paramsSchema = z.object({
  address: z.string(),
})

export async function get(req: NextApiRequest, res: NextApiResponse) {
  const { address } = paramsSchema.parse(req.query)
  const followedVaults = await selectVaultsFollowedByAddress(prisma, {
    address,
  })

  res.status(200).json(followedVaults || [])
}
