import { formatAddress } from '@summerfi/app-utils'

import { type SumrDecayFactorData } from '@/app/server-handlers/sumr-decay-factor'
import { type SumrDelegates } from '@/app/server-handlers/sumr-delegates'

export interface SumrDelegate {
  sumrAmount: number
  ens: string
  address: string
  title: string
  description: string
  social: {
    linkedin: string | undefined
    x: string | undefined
    link: string | undefined
  }
}

export interface SumrDelegateWithDecayFactor extends SumrDelegate {
  decayFactor: number
}

export const localSumrDelegates: Partial<SumrDelegate>[] = [
  {
    ens: 'a16z',
    address: '0xb0f758323D3798a6A567C1601d84f30d1BCAAA0b',
    title: 'Don Halaprixos',
    description:
      'Don Halaprixos is a crypto investor known for his love for the crypto space and teammates.',
  },
]

export function mergeDelegatesData(
  sumrDelegates: SumrDelegates[],
  sumrDecayFactors: SumrDecayFactorData[],
): SumrDelegateWithDecayFactor[] {
  return sumrDelegates
    .map((sumrDelegate) => {
      const localDelegate = localSumrDelegates.find(
        (local) => local.address?.toLowerCase() === sumrDelegate.account.address.toLowerCase(),
      )

      const decayFactor =
        sumrDecayFactors.find(
          (factor) => factor.address.toLowerCase() === sumrDelegate.account.address.toLowerCase(),
        )?.decayFactor ?? 1

      return {
        // eslint-disable-next-line no-mixed-operators
        sumrAmount: Number(sumrDelegate.votesCount) / 10 ** 18,
        ens: sumrDelegate.account.ens !== '' ? sumrDelegate.account.ens : localDelegate?.ens ?? '',
        address: sumrDelegate.account.address,
        title:
          sumrDelegate.account.name !== ''
            ? sumrDelegate.account.name
            : localDelegate?.title ?? formatAddress(sumrDelegate.account.address),
        description:
          sumrDelegate.account.bio !== ''
            ? sumrDelegate.account.bio
            : sumrDelegate.statement && sumrDelegate.statement.statementSummary !== ''
              ? sumrDelegate.statement.statementSummary
              : localDelegate?.description ?? 'Description not available.',
        social: {
          x:
            sumrDelegate.account.twitter !== ''
              ? sumrDelegate.account.twitter
              : localDelegate?.social?.x ?? undefined,
          linkedin: localDelegate?.social?.linkedin ?? undefined,
          link: `https://basescan.org/address/${sumrDelegate.account.address}`,
        },
        decayFactor,
      }
    })
    .sort((a, b) => b.sumrAmount - a.sumrAmount)
}
