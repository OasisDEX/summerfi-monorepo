import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export const POST = async (request: Request) => {
  const requestData = await request.json()
  const { tags } = requestData

  if (!tags || typeof tags !== 'object' || !Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ error: 'tags is required' }, { status: 400 })
  }

  tags.forEach((tag: string) => revalidateTag(tag))

  return NextResponse.json(
    { message: `Revalidation triggered for tags: ${tags.join(', ')}` },
    { status: 200 },
  )
}
