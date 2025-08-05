import { sdkDebug } from '@/app/server-handlers/sdk/sdk-debug'

export const GET = async (req: Request) => {
  const institutionId = new URL(req.url).searchParams.get('institutionId') ?? 'test-client'

  const debugCallsData = await sdkDebug(institutionId)

  return new Response(JSON.stringify(debugCallsData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
