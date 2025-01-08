export const isValidAddress = (address: unknown): address is `0x${string}` => {
  if (typeof address !== 'string' || !/^0x[a-fA-F0-9]{40}$/u.test(address)) {
    return false
  }

  return true
}
