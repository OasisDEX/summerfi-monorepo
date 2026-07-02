/**
 * Lifecycle states of an asynchronous query, mirroring the conventional pending/error/success
 * status reported by data-fetching hooks.
 */
export enum QueryStatus {
  Pending = 'pending',
  Error = 'error',
  Success = 'success',
}
