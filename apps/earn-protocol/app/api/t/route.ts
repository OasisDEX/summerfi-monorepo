import { getMixpanel, trackEventHandler } from '@summerfi/app-server-handlers'
import { EarnProtocolEventNames } from '@summerfi/app-types'
import { snakeCase } from 'lodash-es'
import { type NextRequest, NextResponse } from 'next/server'

export const revalidate = 0

const skipArtificialTrackingOS = [
  'Android 6.0.1', // lotta those in mixpanel skewing data
]

export async function POST(request: NextRequest) {
  try {
    const mixpanel = getMixpanel(process.env.EARN_MIXPANEL_KEY)

    const { distinctId, eventBody, eventName, os, ...rest } = await request.json()

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const reqOrigin = request.headers.get('origin') || ''

    if (
      ![...Object.values(EarnProtocolEventNames)].includes(eventName) ||
      skipArtificialTrackingOS.includes(os) ||
      reqOrigin.includes('staging')
    ) {
      return NextResponse.json({ status: 400 })
    }

    trackEventHandler(
      `${eventName}`,
      {
        // eslint-disable-next-line camelcase
        distinct_id: distinctId,
        ...eventBody,
        ...Object.keys(rest).reduce((a, v) => ({ ...a, [`$${snakeCase(v)}`]: rest[v] }), {}),
      },
      mixpanel,
    )

    return NextResponse.json({ status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking event', error)

    return NextResponse.json({ status: 500 })
  }
}
