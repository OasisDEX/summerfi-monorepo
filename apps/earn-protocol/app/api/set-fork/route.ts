import { forksCookieName } from '@summerfi/app-earn-ui'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'
import { z } from 'zod'

import { NetworkIds } from '@/constants/networks-list'

export type SetForkRequest = {
  [key in NetworkIds | 'clear']?: string
}
type ObjectLike<T> = { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] }

// `NetworkIds` is a numeric enum, so `Object.keys` yields both the numeric chain-id strings
// (e.g. "1", "8453") and the enum member names (e.g. "MAINNET") - both forms are accepted as
// valid fork-override keys elsewhere in this file (see `handleClearFork`), so validation must
// accept the same set.
const validForkKeys = new Set(Object.keys(NetworkIds))

// Fork override values are RPC URLs (or similar override strings) manually entered by a
// developer; bound the length defensively rather than assume a URL shape.
const MAX_FORK_VALUE_LENGTH = 2048

const setForkRequestSchema = z
  .record(z.string(), z.string().max(MAX_FORK_VALUE_LENGTH))
  .refine((body) => Object.keys(body).every((key) => key === 'clear' || validForkKeys.has(key)), {
    message: 'Invalid fork key: must be a valid NetworkIds key or "clear"',
  })

const getCleanObject = <T extends object, V = ObjectLike<T>>(obj: T): V => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => !((typeof v === 'string' && !v.length) || v === null || typeof v === 'undefined'),
    ),
  ) as V
}

function handleClearFork(clear: string, cookieStore: Awaited<ReturnType<typeof cookies>>) {
  if (Object.keys(NetworkIds).includes(clear)) {
    const currentForks = JSON.parse(
      (cookieStore.get(forksCookieName)?.value as string | undefined) ?? '{}',
    )

    delete currentForks[clear]
    cookieStore.set(forksCookieName, JSON.stringify(currentForks))

    return new Response('Fork updated', { status: 200 })
  }
  cookieStore.delete(forksCookieName)

  return new Response('Forks cleared', { status: 200 })
}
function handleSetFork(body: SetForkRequest, cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const currentForks = JSON.parse(
    (cookieStore.get(forksCookieName)?.value as string | undefined) ?? '{}',
  )
  const newForks = { ...currentForks, ...body }

  cookieStore.set(forksCookieName, JSON.stringify(getCleanObject(newForks)))

  return new Response('Forks set', { status: 200 })
}

export async function POST(request: NextRequest) {
  try {
    const rawBody: unknown = await request.json()
    const result = setForkRequestSchema.safeParse(rawBody)

    if (!result.success) {
      return new Response('Invalid body data', { status: 400 })
    }

    const body = result.data as SetForkRequest
    const cookieStore = await cookies()

    if (typeof body.clear !== 'undefined') {
      return handleClearFork(body.clear, cookieStore)
    }
    if (typeof body === 'object' && Object.keys(NetworkIds).includes(Object.keys(body)[0])) {
      return handleSetFork(body, cookieStore)
    }

    return new Response('Invalid body data', { status: 400 })
  } catch (error) {
    return new Response('Error setting fork', { status: 400 })
  }
}
