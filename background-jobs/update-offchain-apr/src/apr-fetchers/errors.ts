/**
 * Configuration problem that prevents a fetcher from running at all (e.g. a
 * missing API key). Distinguished from transient runtime failures so callers
 * and tooling can surface actionable guidance instead of a generic error.
 */
export class FetcherConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FetcherConfigError'
  }
}
