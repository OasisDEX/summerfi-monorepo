import { NextResponse } from 'next/server'
import { freemem, totalmem } from 'os'

export const revalidate = 0

const formatMemoryUsage = (data: number) => `${Math.round((data / 1024 / 1024) * 100) / 100} MB`

// eslint-disable-next-line require-await
export async function GET() {
  try {
    const freeMemory = freemem()
    const totalMemory = totalmem()
    const os = {
      freeMemory: `${formatMemoryUsage(freeMemory)} -> free memory available`,
      totalMemory: `${formatMemoryUsage(totalMemory)} -> total memory available`,
    }

    const memoryData = process.memoryUsage()
    const node = {
      rss: `${formatMemoryUsage(memoryData.rss)} -> Resident Set Size - total memory allocated for the process execution`,
      heapTotal: `${formatMemoryUsage(memoryData.heapTotal)} -> total size of the allocated heap`,
      heapUsed: `${formatMemoryUsage(memoryData.heapUsed)} -> actual memory used during the execution`,
      external: `${formatMemoryUsage(memoryData.external)} -> V8 external memory`,
    }

    return NextResponse.json({
      pong: true,
      time: Date.now(),
      os,
      node,
    })
  } catch (error) {
    return NextResponse.json({
      pong: true,
      time: Date.now(),
      error: error instanceof Error ? error.toString() : String(error),
    })
  }
}
