import type { NumberingState } from './types.js'

export function createInitialState(): NumberingState {
  return {
    mode: 'mainbody',
    scope: 'heading',
    depth: 6,
    active: true,
    counters: [0, 0, 0, 0, 0],
  }
}

export function applyDirective(state: NumberingState, type: string): void {
  switch (type) {
    case 'mainbody':
      state.mode = 'mainbody'
      state.active = true
      state.counters = [0, 0, 0, 0, 0]
      break
    case 'appendix':
      state.mode = 'appendix'
      state.active = true
      state.counters = [0, 0, 0, 0, 0]
      break
    case 'h':
      state.scope = 'heading'
      state.depth = 6
      break
    case 'h+p':
      state.scope = 'heading+paragraph'
      state.depth = 6
      break
    case 'h2':
      state.depth = 2
      break
    case 'h3':
      state.depth = 3
      break
    case 'h4':
      state.depth = 4
      break
    case 'h5':
      state.depth = 5
      break
    case 'h6':
      state.depth = 6
      break
    case 'end':
      state.active = false
      break
  }
}

export function incrementCounter(state: NumberingState, level: number): string {
  const idx = level - 2
  state.counters[idx]++

  for (let i = idx + 1; i < 5; i++) {
    state.counters[i] = 0
  }

  const prefix =
    state.mode === 'appendix'
      ? String.fromCharCode(65 + state.counters[0] - 1)
      : String(state.counters[0])

  const parts = [prefix]
  for (let i = 1; i <= idx; i++) {
    if (state.counters[i] > 0) {
      parts.push(String(state.counters[i]))
    }
  }

  return parts.join('.')
}
