/**
 * Calculates the remaining order time for a Transak transaction.
 *
 * @param elapsedTime - The time that has already elapsed in seconds.
 * @param maxWaitingTime - The maximum waiting time for the transaction in seconds.
 * @returns A string representing the remaining time in the format `HH:MM:SS` if the remaining time is 1 hour or more, otherwise `MM:SS`.
 */
export const getTransakRemainingOrderTime = (
  elapsedTime: number,
  maxWaitingTime: number,
): string => {
  const remainingTime = Math.max(maxWaitingTime - elapsedTime, 0) // Avoid negative time

  const hours = Math.floor(remainingTime / 3600)
  const minutes = Math.floor((remainingTime % 3600) / 60)
  const seconds = remainingTime % 60

  if (remainingTime >= 3600) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  } else {
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
}
