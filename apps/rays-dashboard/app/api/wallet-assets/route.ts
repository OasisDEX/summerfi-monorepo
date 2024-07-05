import { NextRequest, NextResponse } from 'next/server'
import { isAddress } from 'viem'

export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address')?.toLocaleLowerCase()

    if (!address || !isAddress(address)) {
      return NextResponse.json({ status: 400 })
    }

    const [portfolioOverviewResponse, portfolioAssetsResponse] = await Promise.all([
      fetch(`${process.env.FUNCTIONS_API_URL}/api/portfolio/overview?address=${address}`, {
        method: 'GET',
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json()),
      fetch(`${process.env.FUNCTIONS_API_URL}/api/portfolio/assets?address=${address}`, {
        method: 'GET',
        next: { revalidate: 60 },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((resp) => resp.json()),
    ])

    const totalValue =
      portfolioOverviewResponse.allAssetsUsdValue + portfolioAssetsResponse.totalAssetsUsdValue

    return NextResponse.json({ status: 200, totalValue })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting wallet assets', error)

    return NextResponse.json({ status: 500 })
  }
}
