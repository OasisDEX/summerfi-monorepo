export const getAccountType: (
  chainId: number,
) => 'ModularAccountV2' | 'MultiOwnerModularAccount' = (chainId) => {
  // HyperEVM uses ModularAccountV2 (entry point 0.7.0)
  if (chainId === 999) {
    // eslint-disable-next-line no-console
    console.log('getAccountType: returning ModularAccountV2 for HyperEVM chainId 999')

    return 'ModularAccountV2' as const
  }

  return 'MultiOwnerModularAccount' as const
}

// to be used for cases when user is logged in using smart account and is no longer eligible for gas sponsorship
export const overridesGasSponsorship: { paymasterAndData: `0x${string}` } = {
  paymasterAndData: '0x',
}
