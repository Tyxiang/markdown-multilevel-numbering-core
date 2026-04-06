export type NumberingMode = 'mainbody' | 'appendix'
export type NumberingScope = 'heading' | 'heading+paragraph'

export interface NumberingState {
  mode: NumberingMode
  scope: NumberingScope
  depth: number
  active: boolean
  counters: number[]
}

export type DirectiveType =
  | 'mainbody'
  | 'appendix'
  | 'h'
  | 'h+p'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'end'

export interface ParsedDirective {
  type: DirectiveType
  raw: string
  position?: { start: number; end: number }
}
