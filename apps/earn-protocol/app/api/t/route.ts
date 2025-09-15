import { getMixpanel, trackEventHandler } from '@summerfi/app-server-handlers'
import { EarnProtocolEventNames } from '@summerfi/app-types'
import { snakeCase } from 'lodash-es'
import { type NextRequest, NextResponse } from 'next/server'

const NAME_VALIDATOR = /^[a-z0-9]+(?:-[a-z0-9]+)*$/u
// eslint-disable-next-line no-useless-escape
const SAFE_STRING_RE = /^[A-Za-z0-9\-\._\$]+$/u
const IS_NUMERIC = /^\d+(\.\d+)?$/u
const MAX_NAME_LENGTH = 100
const SANITIZED_TOKEN = '[sanitized]'

const isValidName = (value: unknown) => {
  if (typeof value !== 'string') return false
  const v = value.trim()

  if (v.length === 0 || v.length > MAX_NAME_LENGTH) return false

  return NAME_VALIDATOR.test(v)
}

const sanitizeNamesInObject = (input: unknown): unknown => {
  if (Array.isArray(input)) return input.map(sanitizeNamesInObject)
  if (input && typeof input === 'object') {
    const obj = input as { [key: string]: unknown }
    const out: { [key: string]: unknown } = {}

    for (const [k, v] of Object.entries(obj)) {
      if (k.toLowerCase().includes('name')) {
        out[k] = isValidName(v) ? v : SANITIZED_TOKEN
      } else {
        out[k] = sanitizeNamesInObject(v)
      }
    }

    return out
  }

  return input
}

const containsSanitized = (input: unknown): boolean => {
  if (input === SANITIZED_TOKEN) return true
  if (Array.isArray(input)) return input.some(containsSanitized)
  if (input && typeof input === 'object') {
    return Object.values(input as { [key: string]: unknown }).some(containsSanitized)
  }

  return false
}

const isValidUrl = (value: unknown) => {
  if (typeof value !== 'string') return false
  const v = value.trim()

  if (v.length === 0 || v.length > 2000) return false
  try {
    const parsed = new URL(v)

    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

const isSafeDomain = (value: unknown) => {
  if (typeof value !== 'string') return false
  const v = value.trim()

  if (v.length === 0 || v.length > 200) return false
  // simple regex to check for valid domain (no protocol, no path, no auth)
  // eslint-disable-next-line no-useless-escape
  const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9\-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/iu

  return DOMAIN_RE.test(v)
}

const isSafeString = (value: unknown) => {
  if (value === null) return true
  if (typeof value !== 'string') return false
  const v = value.trim()

  if (v.length === 0 || v.length > 200) return false

  return SAFE_STRING_RE.test(v)
}

const isNumericOrNumericString = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value)
  if (typeof value === 'string') return IS_NUMERIC.test(value.trim())

  return false
}

const isValidScreenDimension = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) && value > 0 && value < 20000
  if (typeof value === 'string') {
    const n = Number(value)

    return Number.isFinite(n) && n > 0 && n < 20000 && /^\d+$/u.test(value.trim())
  }

  return false
}

const validateSpecialKeys = (obj: { [key: string]: unknown }) => {
  // $current_url handled separately
  const check = (key: string, validator: (v: unknown) => boolean) => {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return validator(obj[key])
    }

    return true
  }

  // $browser: safe string or null
  if (!check('$browser', isSafeString)) return false

  // $browser_version: number or numeric string or null
  if (
    !check(
      '$browser_version',
      (v) =>
        v === null ||
        isNumericOrNumericString(v) ||
        (typeof v === 'string' && /^\d+(\.\d+){0,5}$/u.test(v.trim())),
    )
  )
    return false

  // $initial_referrer & $initial_referring_domain: safe strings (allow "$direct")
  if (
    !check(
      '$initial_referrer',
      (v) => v === null || (typeof v === 'string' && (v === '$direct' || isValidUrl(v))),
    )
  )
    return false
  if (
    !check(
      '$initial_referring_domain',
      (v) => v === null || (typeof v === 'string' && (v === '$direct' || isSafeDomain(v))),
    )
  )
    return false

  // $mobile: boolean or null
  if (!check('$mobile', (v) => v === null || typeof v === 'boolean')) return false

  // screen height/width: numbers
  if (!check('$screen_height', (v) => v === null || isValidScreenDimension(v))) return false
  if (!check('$screen_width', (v) => v === null || isValidScreenDimension(v))) return false

  return true
}

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

    const wholeEventBody = {
      ...eventBody,
      ...Object.keys(rest).reduce(
        (a, v) => ({
          ...a,
          [`$${snakeCase(v)}`]: rest[v],
        }),
        {},
      ),
    }

    // --- sanitizer & blocking logic (uses top-level utilities) ---
    const sanitizedEventBody = sanitizeNamesInObject(wholeEventBody) as { [key: string]: unknown }

    // Validate $current_url when present and reject if invalid
    const currentUrlValue = sanitizedEventBody.$current_url

    if (currentUrlValue !== undefined && !isValidUrl(currentUrlValue)) {
      return NextResponse.json({ status: 400, message: 'Invalid $current_url' }, { status: 400 })
    }

    // validate other special keys
    if (!validateSpecialKeys(sanitizedEventBody)) {
      return NextResponse.json({ status: 400, message: 'Invalid special keys' }, { status: 400 })
    }

    if (containsSanitized(sanitizedEventBody)) {
      // Drop events that contain sanitized name fields
      return NextResponse.json(
        { status: 400, message: 'Contains sanitized fields' },
        { status: 400 },
      )
    }
    // --- end sanitizer & blocking logic ---

    // cleaning up: ensure page exists and looks like a path (use sanitized body)
    if (
      !sanitizedEventBody.page ||
      typeof sanitizedEventBody.page !== 'string' ||
      !sanitizedEventBody.page.startsWith('/')
    ) {
      return NextResponse.json({ status: 400 })
    }
    trackEventHandler(
      `${eventName}`,
      {
        // eslint-disable-next-line camelcase
        distinct_id: distinctId,
        wholeEventBody: sanitizedEventBody,
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
