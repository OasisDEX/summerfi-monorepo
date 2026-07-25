/* eslint-disable no-mixed-operators */

import { easeInOutCubic } from '@/components/layout/LandingMasterPage/landingPageBlobs.helpers'

// ---- finale timing (seconds since mount) — tune freely ----
// TESTING: calm shortened to 10s — restore to ~27 before launch
export const FINALE_CALM_END_S = 10
export const FINALE_FLASH_START_S = FINALE_CALM_END_S + 14
export const FINALE_FLASH_END_S = FINALE_FLASH_START_S + 1.2

export type FinalePhaseName = 'CALM' | 'COLLAPSE' | 'FLASH' | 'AFTER'

export interface FinaleState {
  phase: FinalePhaseName
  collapseProgress: number
  flash: number
  lensStrength: number
  horizon: number
}

export const finalePhase = (elapsed: number): FinaleState => {
  if (elapsed < FINALE_CALM_END_S) {
    return { phase: 'CALM', collapseProgress: 0, flash: 0, lensStrength: 0, horizon: 0 }
  }

  if (elapsed < FINALE_FLASH_START_S) {
    const t = (elapsed - FINALE_CALM_END_S) / (FINALE_FLASH_START_S - FINALE_CALM_END_S)

    return {
      phase: 'COLLAPSE',
      collapseProgress: easeInOutCubic(t),
      flash: 0,
      lensStrength: t,
      horizon: easeInOutCubic(t),
    }
  }

  if (elapsed < FINALE_FLASH_END_S) {
    // no blackout anymore — FLASH is just the brief "final gulp" window where the
    // sim snaps the remaining field into the well
    return {
      phase: 'FLASH',
      collapseProgress: 1,
      flash: 0,
      lensStrength: 1,
      horizon: 1,
    }
  }

  // the black hole is permanent — the lens never relaxes, the bending never fades
  return {
    phase: 'AFTER',
    collapseProgress: 1,
    flash: 0,
    lensStrength: 1,
    horizon: 1,
  }
}
