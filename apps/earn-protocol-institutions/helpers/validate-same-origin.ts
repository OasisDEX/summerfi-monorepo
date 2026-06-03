// Lightweight cross-site abuse guard for the browser-facing proxy routes that spend server-held
// API keys (Alchemy RPC, the SDK gateway). These proxies serve pre-auth wallet flows (the wagmi
// transport, the read-only RPC gateway), so we can't require an authenticated session here — instead
// we require the request to be same-origin, which stops another website from driving a visitor's
// browser through our key. This mirrors the Origin-vs-Host check Next.js applies to Server Actions.
//
// A missing Origin/Referer (same-origin top-level navigations, server-to-server / tooling callers)
// is allowed so we don't break legitimate flows; only a present-and-mismatched origin is rejected.
export const isSameOrigin = (req: Request): boolean => {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')

  if (!host) {
    return true
  }

  const requestOrigin = req.headers.get('origin') ?? req.headers.get('referer')

  if (!requestOrigin) {
    return true
  }

  try {
    return new URL(requestOrigin).host === host
  } catch {
    return false
  }
}
