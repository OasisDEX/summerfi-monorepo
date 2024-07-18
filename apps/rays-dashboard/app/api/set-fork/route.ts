import { cookies } from 'next/headers'
import { type NextRequest } from 'next/server'

import { forksCookieName } from '@/constants/forks-cookie-name'
import { NetworkIds } from '@/constants/networks-list'

export type SetForkRequest = {
  [key in NetworkIds | 'clear']?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SetForkRequest

    // Clear all forks or a specific fork
    if (typeof body.clear !== 'undefined') {
      const cookieStore = cookies()

      if (Object.keys(NetworkIds).includes(body.clear)) {
        const currentForks = JSON.parse(
          (cookieStore.get(forksCookieName)?.value as string | undefined) ?? '{}',
        )

        delete currentForks[body.clear]
        cookieStore.set(forksCookieName, JSON.stringify(currentForks))

        return new Response('Fork updated', { status: 200 })
      }

      cookieStore.delete(forksCookieName)

      return new Response('Forks cleared', { status: 200 })
    }

    // Set a new fork
    if (typeof body === 'object' && Object.keys(NetworkIds).includes(Object.keys(body)[0])) {
      const cookieStore = cookies()

      const currentForks = JSON.parse(
        (cookieStore.get(forksCookieName)?.value as string | undefined) ?? '{}',
      )
      const newForks = { ...currentForks, ...body }

      cookieStore.set(forksCookieName, JSON.stringify(newForks))

      return new Response('Forks set', { status: 200 })
    }

    return new Response('Invalid body data', { status: 400 })
  } catch (error) {
    return new Response('Error setting fork', { status: 400 })
  }
}
