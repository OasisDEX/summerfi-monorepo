import { sdkDebug } from '@/app/server-handlers/sdk/sdk-debug'

export const GET = async (req: Request) => {
  try {
    const institutionId = new URL(req.url).searchParams.get('institutionId') ?? 'test-client'

    const debugCallsData = await sdkDebug(institutionId)

    return new Response(JSON.stringify(debugCallsData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }
}
