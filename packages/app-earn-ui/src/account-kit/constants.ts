export const accountType = 'MultiOwnerModularAccount'

// to be used for cases when user is logged in using smart account and is no longer eligible for gas sponsorship
export const overridesGasSponsorship: { paymasterAndData: `0x${string}` } = {
  paymasterAndData: '0x',
}
