const REDIRECT_TARGET = '/earn/staking'

// Server component: redirects without shipping the client runtime just to bounce.
// `meta refresh` handles the no-JS / crawler case; the inline script makes it
// instant for browsers (replace() avoids leaving an entry in history).
export default function StakingRedirectPage() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=${REDIRECT_TARGET}`} />
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(REDIRECT_TARGET)})`,
        }}
      />
      <noscript>
        <a href={REDIRECT_TARGET}>Continue to staking</a>
      </noscript>
    </>
  )
}
