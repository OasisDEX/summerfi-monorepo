import {
  analyticsCookieName,
  slippageConfigCookieName,
  sumrNetApyConfigCookieName,
} from '@summerfi/app-earn-ui'
import { type DeviceType, type UserConfigResponse } from '@summerfi/app-types'
import { getServerSideCookies, safeParseJson } from '@summerfi/app-utils'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieRaw = await cookies()
  const cookie = cookieRaw.toString()
  const analyticsCookie = safeParseJson(getServerSideCookies(analyticsCookieName, cookie))
  const deviceType = getServerSideCookies('deviceType', cookie) as DeviceType
  const sumrNetApyConfig = safeParseJson(getServerSideCookies(sumrNetApyConfigCookieName, cookie))
  const slippageConfig = safeParseJson(getServerSideCookies(slippageConfigCookieName, cookie))
  const country = getServerSideCookies('country', cookie)

  return NextResponse.json({
    analyticsCookie,
    deviceType,
    sumrNetApyConfig,
    slippageConfig,
    country,
  } as UserConfigResponse)
}
