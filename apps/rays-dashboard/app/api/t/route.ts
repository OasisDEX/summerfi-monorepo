import { snakeCase } from 'lodash'
import { NextRequest, NextResponse } from 'next/server'

import { trackEventHandler } from '@/server-handlers/mixpanel'
import { MixpanelEventProduct, MixpanelEventTypes } from '@/types/mixpanel'

export const revalidate = 0

export async function POST(request: NextRequest) {
  try {
    const { distinctId, eventBody, eventName, ...rest } = await request.json()

    if (
      ![...Object.values(MixpanelEventTypes)].includes(eventName) ||
      ![...Object.values(MixpanelEventProduct)].includes(eventBody.product)
    ) {
      return NextResponse.json({ status: 400 })
    }

    trackEventHandler(`${eventName}`, {
      // eslint-disable-next-line camelcase
      distinct_id: distinctId,
      ...eventBody,
      ...Object.keys(rest).reduce((a, v) => ({ ...a, [`$${snakeCase(v)}`]: rest[v] }), {}),
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error tracking event', error)

    return NextResponse.json({ status: 500 })
  }
}
