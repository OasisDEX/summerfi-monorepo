export const getAccountType: (
  chainId?: number,
  skipOverrideCheck?: boolean,
) => 'ModularAccountV2' | 'MultiOwnerModularAccount' = (chainId, skipOverrideCheck = false) => {
  const localConfig =
    typeof window !== 'undefined' && !skipOverrideCheck
      ? localStorage.getItem(`smart-account-custom-account-type-${chainId}`)
      : null

  if (localConfig && localConfig !== 'null') {
    return localConfig as 'ModularAccountV2' | 'MultiOwnerModularAccount'
  }
  // HyperEVM uses ModularAccountV2 (entry point 0.7.0)
  if (chainId === 999) {
    return 'ModularAccountV2' as const
  }

  return 'MultiOwnerModularAccount' as const
}

// to be used for cases when user is logged in using smart account and is no longer eligible for gas sponsorship
export const overridesGasSponsorship: { paymasterAndData: `0x${string}` } = {
  paymasterAndData: '0x',
}
