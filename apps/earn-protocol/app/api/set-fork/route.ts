import { forksCookieName } from '@summerfi/app-earn-ui'
import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

import { NetworkIds } from '@/constants/networks-list'

export type SetForkRequest = {
  [key in NetworkIds | 'clear']?: string
}
type ObjectLike<T> = { [K in keyof T as T[K] extends null | undefined ? never : K]: T[K] }

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
    const body = (await request.json()) as SetForkRequest
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
