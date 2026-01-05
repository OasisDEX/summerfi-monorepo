import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

const isValidPath = (value: unknown): value is string => {
  if (typeof value !== 'string' || !value.startsWith('/')) return false

  try {
    const url = new URL(value, 'https://summer.fi')

    return url.origin === 'https://summer.fi'
  } catch (err) {
    return false
  }
}

export const POST = async (request: Request) => {
  const requestData = await request.json()
  const { tags, paths } = requestData

  // tags and/or paths must be provided
  if ((!tags || tags.length === 0) && (!paths || paths.length === 0)) {
    return NextResponse.json(
      { message: 'No tags or paths provided for revalidation' },
      { status: 400 },
    )
  }

  // validate and normalize input
  const tagRegex = /^[A-Za-z0-9\-_]+$/u

  if (tags !== undefined) {
    if (
      !Array.isArray(tags) ||
      tags.some((t: unknown) => typeof t !== 'string' || !tagRegex.test(t))
    ) {
      return NextResponse.json(
        { message: 'Tags must be an array of URL-safe strings (letters, numbers, - or _)' },
        { status: 400 },
      )
    }
  }

  if (paths !== undefined) {
    if (!Array.isArray(paths) || paths.some((p: unknown) => !isValidPath(p))) {
      return NextResponse.json(
        {
          message: 'Paths must be an array of URL paths starting with',
        },
        { status: 400 },
      )
    }
  }

  // perform revalidation here and return (avoids issues if one of tags/paths is undefined)
  const safeTags: string[] = Array.isArray(tags) ? tags : []
  const safePaths: string[] = Array.isArray(paths) ? paths : []

  safeTags.forEach((tag) => revalidateTag(tag))
  safePaths.forEach((path) => revalidatePath(path))

  const finalMessage = []

  if (safeTags.length > 0) {
    finalMessage.push(`tags: ${safeTags.join(', ')}`)
  }
  if (safePaths.length > 0) {
    finalMessage.push(`paths: ${safePaths.join(', ')}`)
  }

  return NextResponse.json(
    {
      message: `Revalidation triggered for ${finalMessage.join(' and ')}`,
    },
    { status: 200 },
  )
}
