import { isValidLink } from '@summerfi/app-utils'

import { type TallyDelegate } from '@/app/server-handlers/tally'

import { getDelegateTitle } from './helpers'

interface SumrDelegate {
  sumrAmount: number
  ens: string
  address: string
  title: string
  description: string
  social: {
    linkedin: string | undefined
    x: string | undefined
    link: string | undefined
    etherscan: string | undefined
  }
  picture: string | undefined
}

export interface SumrDelegateWithDecayFactor extends SumrDelegate {
  decayFactor: number
}

export function mergeDelegatesData(sumrDelegates: TallyDelegate[]): SumrDelegateWithDecayFactor[] {
  const mergedDelegates = new Map<string, SumrDelegateWithDecayFactor>()

  // Process delegates from sumrDelegates, overwriting local values if they exist
  sumrDelegates.forEach((sumrDelegate) => {
    const normalizedAddress = sumrDelegate.userAddress.toLowerCase()

    mergedDelegates.set(normalizedAddress, {
      // eslint-disable-next-line no-mixed-operators
      sumrAmount: Number(sumrDelegate.votesCount) / 10 ** 18,
      ens: sumrDelegate.ens || '',
      address: sumrDelegate.userAddress,
      title: getDelegateTitle({
        tallyDelegate: sumrDelegate,
        // just to meet type requirements
        currentDelegate: sumrDelegate.userAddress,
      }),
      description: sumrDelegate.bio || sumrDelegate.customBio || 'Description not available.',
      social: {
        x: isValidLink(sumrDelegate.x)
          ? sumrDelegate.x
          : sumrDelegate.x
            ? `https://x.com/${sumrDelegate.x}`
            : undefined,
        linkedin: undefined,
        etherscan: `https://basescan.org/address/${sumrDelegate.userAddress}`,
        link: sumrDelegate.forumUrl,
      },
      picture: sumrDelegate.photo ?? '',
      decayFactor: Number(sumrDelegate.votePower),
    })
  })

  return Array.from(mergedDelegates.values()).sort((a, b) => b.sumrAmount - a.sumrAmount)
}
