declare global {
  const grecaptcha: {
    enterprise: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, options: { action: string }) => Promise<string>
    }
  }
}
