/* eslint-disable @next/next/no-img-element */
import { formatAddress } from '@summerfi/app-utils'
import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export const contentType = 'image/png'

export function GET(request: NextRequest) {
  try {
    const amount = new URL(request.url).searchParams.get('amount')
    const address = new URL(request.url).searchParams.get('address')
    const sumrEarned = new URL(request.url).searchParams.get('sumrEarned')

    if (
      !amount ||
      typeof amount !== 'string' ||
      !address ||
      typeof address !== 'string' ||
      !sumrEarned ||
      typeof sumrEarned !== 'string'
    ) {
      return new Response('Invalid query parameters', { status: 400 })
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:
              '"Roboto","Ubuntu","Cantarell","Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji"',
            color: '#fff',
            gap: '0',
            textAlign: 'center',
          }}
        >
          <img
            src="https://summer.fi/earn/img/branding/background-dark.png"
            alt="Lazy Summer Protocol background"
            style={{
              position: 'absolute',
              width: '140%',
              height: '140%',
              transform: `rotate(-${Math.ceil(Number(Math.random() * 5))}deg)`,
              objectFit: 'cover',
            }}
          />
          <img
            src="https://summer.fi/earn/img/branding/logo-dark.svg"
            alt="Lazy Summer Protocol"
            style={{
              marginBottom: '60px',
              height: '100px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              borderTop: '1px solid #ff49a4',
              borderBottom: '1px solid #ff49a4',
            }}
          >
            <p
              style={{
                display: 'flex',
                textAlign: 'center',
                margin: '20px auto 0',
                lineHeight: '140px',
                fontSize: '140px',
                color: '#ff49a4',
              }}
            >
              {String(amount)}
            </p>
            <p
              style={{
                display: 'flex',
                paddingBottom: '25px',
                textAlign: 'center',
                margin: '20px auto 0',
                lineHeight: '60px',
                fontSize: '60px',
                color: '#fff',
              }}
            >
              {String(sumrEarned)}&nbsp;SUMR&nbsp;earned
            </p>
          </div>
          <p
            style={{
              fontSize: '40px',
              fontFamily: 'monospace',
            }}
          >
            {formatAddress(address, { first: 6 })} portfolio
          </p>
        </div>
      ),
      {
        width: 1200,
        height: 700,
      },
    )
  } catch (e: unknown) {
    return new Response('Failed to generate OG Image', { status: 500 })
  }
}
