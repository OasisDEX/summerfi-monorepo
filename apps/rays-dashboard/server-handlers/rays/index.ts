import { type RaysApiResponse } from '@summerfi/app-types'

import { getRaysDailyChallengeData } from '@/helpers/get-rays-daily-challenge-data'
import { prisma } from '@/helpers/prisma-client'

export const fetchRays = async (query: { [key: string]: string } | string) => {
  try {
    const urlParams = new URLSearchParams(query)
    const address = urlParams.get('address')

    if (address === null) {
      return {
        error: 'No address provided',
      }
    }

    const dailyChallengeData = await prisma.raysDailyChallenge.findUnique({
      where: {
        address: address.toLocaleLowerCase(),
      },
    })

    const calculatedData = getRaysDailyChallengeData(dailyChallengeData?.claimed_dates)

    const rays = (await fetch(`${process.env.FUNCTIONS_API_URL}/api/rays?${urlParams.toString()}`, {
      method: 'GET',
      next: { revalidate: 60, tags: [urlParams.toString()] },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((resp) => resp.json())) as RaysApiResponse

    return {
      rays: {
        ...rays,
        allPossiblePoints: rays.allPossiblePoints + calculatedData.allBonusRays,
      },
    }
  } catch (e) {
    return {
      error: e,
    }
  }
}
