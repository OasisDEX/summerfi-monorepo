/**
 * Returns a color variable based on the voting power value
 * @param votingPower - Number between 0 and 1 representing voting power percentage
 * @returns CSS color variable string
 */
export const getVotingPowerColor = (
  votingPower: number,
):
  | 'var(--earn-protocol-success-100)'
  | 'var(--earn-protocol-warning-100)'
  | 'var(--earn-protocol-critical-100)' => {
  if (votingPower === 1) {
    return 'var(--earn-protocol-success-100)'
  }

  if (votingPower > 0.7) {
    return 'var(--earn-protocol-warning-100)'
  }

  return 'var(--earn-protocol-critical-100)'
}
