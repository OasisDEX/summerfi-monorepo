/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export const contentType = 'image/png'

export function GET(request: NextRequest) {
  try {
    const tvl = new URL(request.url).searchParams.get('tvl')
    const protocols = new URL(request.url).searchParams.get('protocols')

    if (!tvl || !protocols || typeof tvl !== 'string' || isNaN(parseInt(protocols, 10))) {
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
              top: '-20%',
              left: '-10%',
              width: '140%',
              height: '140%',
              objectFit: 'cover',
              zIndex: -1,
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
          <p style={{ fontSize: '100px', margin: 0 }}>
            <b style={{ fontWeight: 700, color: '#ff49a4' }}>${String(tvl)}</b>&nbsp;TVL
          </p>
          <p style={{ fontSize: '70px', margin: 0 }}>
            <b style={{ fontWeight: 700, color: '#ff49a4' }}>{String(protocols)}</b>&nbsp;Protocols
            Supported
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
