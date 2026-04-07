import { describe, it, expect } from 'vitest'
import { createInitialState, applyDirective, incrementCounter } from '../../src/numbering/state.js'
import { NumberingError } from '../../src/utils/errors.js'

describe('createInitialState', () => {
  it('creates default state', () => {
    const state = createInitialState()
    expect(state.mode).toBe('mainbody')
    expect(state.scope).toBe('heading')
    expect(state.depth).toBe(6)
    expect(state.active).toBe(true)
    expect(state.counters).toEqual([0, 0, 0, 0, 0])
  })
})

describe('applyDirective', () => {
  it('activates mainbody mode and resets counters', () => {
    const state = createInitialState()
    applyDirective(state, 'mainbody')
    expect(state.active).toBe(true)
    expect(state.mode).toBe('mainbody')
    expect(state.counters).toEqual([0, 0, 0, 0, 0])
  })

  it('activates appendix mode and resets counters', () => {
    const state = createInitialState()
    applyDirective(state, 'appendix')
    expect(state.active).toBe(true)
    expect(state.mode).toBe('appendix')
  })

  it('sets scope to heading+paragraph', () => {
    const state = createInitialState()
    applyDirective(state, 'h+p')
    expect(state.scope).toBe('heading+paragraph')
    expect(state.depth).toBe(6)
  })

  it('sets depth for h3', () => {
    const state = createInitialState()
    applyDirective(state, 'h3')
    expect(state.depth).toBe(3)
  })

  it('deactivates numbering on end', () => {
    const state = createInitialState()
    applyDirective(state, 'mainbody')
    expect(state.active).toBe(true)
    applyDirective(state, 'end')
    expect(state.active).toBe(false)
  })
})

describe('incrementCounter', () => {
  it('increments h2 counter in mainbody mode', () => {
    const state = createInitialState()
    applyDirective(state, 'mainbody')
    const num = incrementCounter(state, 2)
    expect(num).toBe('1')
  })

  it('increments h3 counter with parent', () => {
    const state = createInitialState()
    applyDirective(state, 'mainbody')
    incrementCounter(state, 2)
    const num = incrementCounter(state, 3)
    expect(num).toBe('1.1')
  })

  it('resets child counters on parent increment', () => {
    const state = createInitialState()
    applyDirective(state, 'mainbody')
    incrementCounter(state, 2)
    incrementCounter(state, 3)
    incrementCounter(state, 3)
    incrementCounter(state, 2)
    const num = incrementCounter(state, 3)
    expect(num).toBe('2.1')
  })

  it('uses letters in appendix mode', () => {
    const state = createInitialState()
    applyDirective(state, 'appendix')
    const num = incrementCounter(state, 2)
    expect(num).toBe('A')
  })

  it('generates appendix sub-numbers', () => {
    const state = createInitialState()
    applyDirective(state, 'appendix')
    incrementCounter(state, 2)
    const num = incrementCounter(state, 3)
    expect(num).toBe('A.1')
  })

  it('throws NumberingError for invalid level < 2', () => {
    const state = createInitialState()
    expect(() => incrementCounter(state, 1)).toThrow(NumberingError)
    expect(() => incrementCounter(state, 1)).toThrow('Invalid heading level: 1')
  })

  it('throws NumberingError for invalid level > 7', () => {
    const state = createInitialState()
    expect(() => incrementCounter(state, 8)).toThrow(NumberingError)
    expect(() => incrementCounter(state, 8)).toThrow('Invalid heading level: 8')
  })
})
