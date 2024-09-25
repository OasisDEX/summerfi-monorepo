// write test that will check if passed string is matching all values in the opNames array
import { supportedOpenEvents, supportedCloseEvents } from '../src/constants'
import { isCloseEvent } from '../src/isCloseEvent'
import { isOpenEvent } from '../src/isOpenEvent'

describe('utils', () => {
  describe('isOpenEvent', () => {
    it('should return true for all open events', () => {
      supportedOpenEvents.forEach((name) => {
        const result = isOpenEvent({ kind: name })
        expect(result).toBe(true)
      })
    })

    it('should return false for all close event', () => {
      supportedCloseEvents.forEach((name) => {
        const result = isOpenEvent({ kind: name })
        expect(result).toBe(false)
      })
    })
  })

  describe('isCloseEvent', () => {
    it('should return true for all close events', () => {
      supportedCloseEvents.forEach((name) => {
        const result = isCloseEvent({ kind: name })
        expect(result).toBe(true)
      })
    })

    it('should return false for all open event', () => {
      supportedOpenEvents.forEach((name) => {
        const result = isCloseEvent({ kind: name })
        expect(result).toBe(false)
      })
    })
  })
})
