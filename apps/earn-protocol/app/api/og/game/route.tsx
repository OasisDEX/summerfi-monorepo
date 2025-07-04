/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const contentType = 'image/png'

export function GET() {
  try {
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
            color: '#000',
            gap: '0',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '160px', margin: 0, lineHeight: '160px' }}>Yield Racer</p>
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
