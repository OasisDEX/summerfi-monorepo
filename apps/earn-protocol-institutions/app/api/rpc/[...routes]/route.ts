import { NextResponse } from 'next/server'

import { isSameOrigin } from '@/helpers/validate-same-origin'

export async function POST(req: Request, { params }: { params: Promise<{ routes: string[] }> }) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { routes } = await params

  // Reject path-traversal / separator-bearing segments so the upstream path can't be steered to an
  // arbitrary Alchemy endpoint with our key.
  if (
    routes.some(
      (segment) => !segment || segment === '.' || segment === '..' || /[/\\]/u.test(segment),
    )
  ) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const apiUrl = 'https://api.g.alchemy.com'
  const apiKey = process.env.ACCOUNT_KIT_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'ACCOUNT_KIT_API_KEY is not set' }, { status: 500 })
  }

  const body = await req.json()

  const res = await fetch(`${apiUrl}/${routes.join('/')}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    return NextResponse.json(await res.json().catch(() => ({})), {
      status: res.status,
    })
  }

  return NextResponse.json(await res.json())
}
