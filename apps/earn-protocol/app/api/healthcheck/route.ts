import { readFileSync } from 'fs'
import { type NextRequest, NextResponse } from 'next/server'
import path from 'path'
import { writeHeapSnapshot } from 'v8'

export const revalidate = 0

// eslint-disable-next-line require-await
export async function GET(request: NextRequest) {
  const { searchParams, host } = request.nextUrl
  const jwtSecret = process.env.EARN_PROTOCOL_JWT_SECRET

  if (!jwtSecret) {
    return NextResponse.json({ error: 'Required ENV variable is not set' }, { status: 500 })
  }

  if (searchParams.get('secret') !== jwtSecret) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }
  const filename = searchParams.get('filename')

  if (filename) {
    // return the snapshot file
    const filePath = path.join(process.cwd(), filename)
    const file = readFileSync(filePath)

    return new NextResponse(file, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    })
  }
  // create a heap snapshot
  const snapshot = writeHeapSnapshot()

  return NextResponse.json(
    {
      message: 'Heap snapshot created',
      url: `${host}/earn/api/healthcheck?filename=${snapshot}&secret=${jwtSecret}`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    },
  )
}
