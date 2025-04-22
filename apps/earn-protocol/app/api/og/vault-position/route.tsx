/* eslint-disable @next/next/no-img-element */
import { getDisplayToken, getTokenGuarded } from '@summerfi/app-earn-ui'
import { iconsSync } from '@summerfi/app-icons'
import { type TokenSymbolsList } from '@summerfi/app-types'
import { formatAddress } from '@summerfi/app-utils'
import { ImageResponse } from 'next/og'
import { type NextRequest } from 'next/server'

export const runtime = 'edge'

export const contentType = 'image/png'

export async function GET(request: NextRequest) {
  try {
    const token = new URL(request.url).searchParams.get('token') as TokenSymbolsList | undefined
    const amount = new URL(request.url).searchParams.get('amount')
    const address = new URL(request.url).searchParams.get('address')
    const sumrEarned = new URL(request.url).searchParams.get('sumrEarned')

    if (
      !amount ||
      typeof amount !== 'string' ||
      !address ||
      typeof address !== 'string' ||
      !token ||
      typeof token !== 'string' ||
      !sumrEarned ||
      typeof sumrEarned !== 'string'
    ) {
      return new Response('Invalid query parameters', { status: 400 })
    }
    const tokenData = getTokenGuarded(token.replace('USD₮0', 'USDT')) // fancy glyphs not supported
    const iconName = tokenData?.iconName ?? 'not_supported_icon'
    const TokenIcon = (await iconsSync[iconName]).default

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
              marginBottom: '30px',
              height: '100px',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '100%',
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
                flexDirection: 'column',
                paddingTop: '20px',
                borderTop: '1px solid #ff49a4',
                paddingBottom: '25px',
                borderBottom: '1px solid #ff49a4',
                textAlign: 'center',
                margin: '20px auto 0',
                gap: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  lineHeight: '100px',
                  fontSize: '100px',
                  textAlign: 'center',
                  color: '#ff49a4',
                  width: '100%',
                }}
              >
                {String(amount)}&nbsp;{tokenData ? getDisplayToken(tokenData.symbol) : ''}
              </div>
              <p
                style={{
                  margin: '0 auto',
                  display: 'flex',
                  lineHeight: '60px',
                  fontSize: '60px',
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {String(sumrEarned)}&nbsp;SUMR&nbsp;earned
              </p>
            </div>
          </div>
          <p
            style={{
              fontSize: '40px',
              fontFamily: 'monospace',
            }}
          >
            {formatAddress(address, { first: 6 })} position
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
