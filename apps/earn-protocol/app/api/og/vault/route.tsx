/* eslint-disable @next/next/no-img-element */
import { getDisplayToken, getTokenGuarded } from '@summerfi/app-earn-ui'
import { iconsSync } from '@summerfi/app-icons/static'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export const contentType = 'image/png'

export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('token') as TokenSymbolsList | undefined
    const tvl = new URL(request.url).searchParams.get('tvl')
    const apy30d = new URL(request.url).searchParams.get('apy30d')

    if (
      !tvl ||
      typeof tvl !== 'string' ||
      !token ||
      typeof token !== 'string' ||
      !apy30d ||
      typeof apy30d !== 'string'
    ) {
      return new Response('Invalid query parameters', { status: 400 })
    }
    const tokenData = getTokenGuarded(token.replace('USD₮0', 'USDT')) // fancy glyphs not supported
    const iconName = tokenData?.iconName ?? 'not_supported_icon'
    const TokenIcon = (await iconsSync[iconName]).default
    const apy30dFormatted = apy30d === 'New' ? 'New Vault' : `${apy30d}%`

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
              left: '-40%',
              width: '170%',
              height: '170%',
              transform: `rotate(-${Math.ceil(Number(Math.random() * 10) + 180)}deg)`,
              objectFit: 'cover',
            }}
          />
          <img
            src="https://summer.fi/earn/img/branding/logo-dark.svg"
            alt="Lazy Summer Protocol"
            style={{
              marginBottom: '30px',
              height: '100px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '40px',
              width: '80%',
              padding: '30px 50px',
              fontSize: '80px',
              lineHeight: '80px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                lineHeight: '40px',
                fontSize: '40px',
                paddingBottom: '40px',
                borderBottom: '1px solid #ff49a4',
                justifyContent: 'center',
              }}
            >
              <TokenIcon
                style={{
                  width: '60px',
                  height: '60px',
                  marginRight: '10px',
                }}
              />
              <p style={{ fontSize: '60px', margin: 0, lineHeight: '60px' }}>Lazy Summer Vault</p>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <p style={{ margin: 0 }}>Assets:</p>
              <b style={{ fontWeight: 700, color: '#ff49a4' }}>
                {String(tvl)}&nbsp;{tokenData ? getDisplayToken(tokenData.symbol) : ''}
              </b>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <p style={{ margin: 0 }}>30d APY:</p>
              <b style={{ fontWeight: 700, color: '#ff49a4' }}>{apy30dFormatted}</b>
            </div>
          </div>
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
