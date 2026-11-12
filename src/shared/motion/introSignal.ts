/**
 * Tiny pub/sub so other parts of the page (e.g. the navbar) can wait for the hero intro to finish.
 * `markIntroDone` is idempotent; late subscribers are called immediately.
 */
let done = false
const listeners = new Set<() => void>()

export const markIntroDone = () => {
  if (done) return
  done = true
  listeners.forEach((listener) => listener())
  listeners.clear()
}

export const onIntroDone = (listener: () => void): (() => void) => {
  if (done) {
    listener()
    return () => {}
  }
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Test helper: reset the signal between tests. */
export const resetIntroSignal = () => {
  done = false
  listeners.clear()
}
