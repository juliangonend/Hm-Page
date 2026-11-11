import { beforeEach, describe, expect, it, vi } from 'vitest'
import { markIntroDone, onIntroDone, resetIntroSignal } from './introSignal'

describe('introSignal', () => {
  beforeEach(resetIntroSignal)

  it('notifies subscribers when the intro finishes', () => {
    const listener = vi.fn()
    onIntroDone(listener)
    expect(listener).not.toHaveBeenCalled()
    markIntroDone()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('calls late subscribers immediately', () => {
    markIntroDone()
    const listener = vi.fn()
    onIntroDone(listener)
    expect(listener).toHaveBeenCalledOnce()
  })

  it('notifies only once even if marked twice', () => {
    const listener = vi.fn()
    onIntroDone(listener)
    markIntroDone()
    markIntroDone()
    expect(listener).toHaveBeenCalledOnce()
  })

  it('lets a subscriber unsubscribe', () => {
    const listener = vi.fn()
    const off = onIntroDone(listener)
    off()
    markIntroDone()
    expect(listener).not.toHaveBeenCalled()
  })
})
